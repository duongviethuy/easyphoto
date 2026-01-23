from __future__ import annotations
from typing import Literal, Dict
from PIL import Image
from rembg import remove

from app.core.removebg_session import session_manager # type: ignore
from app.services.person_dectector import has_person # type: ignore

QualityTier = Literal["standard", "balance", "high"]

MODELS_PERSON: Dict[QualityTier, str] = {
    "standard": "u2net_human_seg",
    "balance": "isnet-general-use",
    "high": "birefnet-portrait",
}

MODELS_NO_PERSON: Dict[QualityTier, str] = {
    "standard": "u2net",
    "balance": "bria-rmbg",
    "high": "birefnet-general",
}

def normalize_quality(q: str | None) -> QualityTier:
    q = (q or "").strip().lower()
    # accept typo
    if q not in ("standard", "balance", "high"):
        return "balance"
    return q  # type: ignore

def choose_model(img: Image.Image, quality: str | None) -> str:
    tier = normalize_quality(quality)
    if has_person(img):
        return MODELS_PERSON[tier]
    return MODELS_NO_PERSON[tier]

def remove_background_auto(img: Image.Image, quality: str | None) -> Image.Image:
    img = img.convert("RGBA")
    model_name = choose_model(img, quality)
    session = session_manager.get(model_name)
    out = remove(img, session=session) # type: ignore
    return out # type: ignore
