from __future__ import annotations
from typing import Optional
import numpy as np
import cv2 # type: ignore
from PIL import Image

# Haar cascade có sẵn trong opencv package
_FACE_CASCADE = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml" # type: ignore
)

_HOG = cv2.HOGDescriptor()
_HOG.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector()) # type: ignore


def pil_to_bgr(img: Image.Image) -> np.ndarray:
    rgb = np.asarray(img.convert("RGB"))
    return cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)


def has_person(img: Image.Image) -> bool:
    bgr = pil_to_bgr(img)
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)

    # 1) Face detect (nhanh)
    faces = _FACE_CASCADE.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(40, 40),
    )
    if len(faces) > 0:
        return True

    # 2) People detect (chậm hơn, nhưng bắt được người khi không thấy mặt)
    # Tối ưu: resize nhỏ nếu ảnh quá lớn
    h, w = bgr.shape[:2]
    max_side = max(h, w)
    if max_side > 960:
        scale = 960 / max_side
        bgr = cv2.resize(bgr, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)

    rects, weights = _HOG.detectMultiScale(
        bgr,
        winStride=(8, 8),
        padding=(8, 8),
        scale=1.05,
    )
    # có người nếu có bbox “tự tin” chút
    return len(rects) > 0
