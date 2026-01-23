import json
import io
from typing import Literal

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import Response
from PIL import Image

from app.services.remove_bg import remove_background_auto

router = APIRouter()

Format = Literal["png", "jpeg", "webp"]
Quality = Literal["standard", "balance", "high"]
Resolution = Literal[1024, 2048, 4096]


def _parse_resolution(v) -> Resolution | None:
    if v is None:
        return None
    # UI gửi string "1024"/"2048"/"4096"
    try:
        n = int(v)
    except Exception:
        raise HTTPException(status_code=400, detail="resolution phải là 1024/2048/4096")

    if n not in (1024, 2048, 4096):
        raise HTTPException(status_code=400, detail="resolution phải là 1024/2048/4096")
    return n  # type: ignore


def _resize_long_side(img: Image.Image, long_side: int) -> Image.Image:
    w, h = img.size
    cur = max(w, h)
    if cur <= long_side:
        return img
    scale = long_side / cur
    nw, nh = max(1, int(w * scale)), max(1, int(h * scale))
    return img.resize((nw, nh), Image.LANCZOS)  # type: ignore


def _flatten_rgba_to_rgb(img_rgba: Image.Image, bg=(255, 255, 255)) -> Image.Image:
    bg_img = Image.new("RGB", img_rgba.size, bg)
    bg_img.paste(img_rgba, mask=img_rgba.split()[-1])  # alpha
    return bg_img


def _quality_to_int(q: Quality) -> int:
    if q == "standard":
        return 80
    if q == "balance":
        return 86
    return 92  # high


@router.post("/remove-bg")
async def remove_bg(
    image: UploadFile = File(...),
    settings: str = Form(...),
):
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="image phải là file ảnh")

    raw = await image.read()
    if not raw:
        raise HTTPException(status_code=400, detail="image rỗng")

    # parse settings JSON (bắt buộc đúng schema)
    try:
        s = json.loads(settings)
        if not isinstance(s, dict):
            raise ValueError()
    except Exception:
        raise HTTPException(status_code=400, detail="settings phải là JSON object hợp lệ")

    # format (bắt buộc)
    if "format" not in s:
        raise HTTPException(status_code=400, detail="Thiếu settings.format")
    out_format: Format = s["format"]
    if out_format not in ("png", "jpeg", "webp"):
        raise HTTPException(status_code=400, detail="format phải là png/jpeg/webp")

    # quality (bắt buộc)
    if "quality" not in s:
        raise HTTPException(status_code=400, detail="Thiếu settings.quality")
    quality: Quality = s["quality"]
    if quality not in ("standard", "balance", "high"):
        raise HTTPException(status_code=400, detail="quality phải là standard/balance/high")

    # resolution (optional)
    resolution = _parse_resolution(s.get("resolution"))

    # load image
    try:
        img = Image.open(io.BytesIO(raw)).convert("RGBA")
    except Exception:
        raise HTTPException(status_code=400, detail="Không đọc được ảnh")

    # resize nếu có
    if resolution is not None:
        img = _resize_long_side(img, resolution)

    # remove bg (auto chọn model theo quality + detect người)
    out_rgba = remove_background_auto(img, quality=quality)

    # encode output
    if out_format == "png":
        buf = io.BytesIO()
        out_rgba.save(buf, format="PNG")  # type: ignore
        return Response(content=buf.getvalue(), media_type="image/png")

    q_int = _quality_to_int(quality)
    out_rgb = _flatten_rgba_to_rgb(out_rgba, bg=(255, 255, 255))  # type: ignore

    if out_format == "jpeg":
        buf = io.BytesIO()
        out_rgb.save(buf, format="JPEG", quality=q_int, optimize=True)
        return Response(content=buf.getvalue(), media_type="image/jpeg")

    # webp
    buf = io.BytesIO()
    out_rgb.save(buf, format="WEBP", quality=q_int, method=6)
    return Response(content=buf.getvalue(), media_type="image/webp")
