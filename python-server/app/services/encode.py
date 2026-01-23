import io
from PIL import Image

def flatten_rgba_to_rgb(img_rgba: Image.Image, bg=(255, 255, 255)) -> Image.Image:
    bg_img = Image.new("RGB", img_rgba.size, bg)
    bg_img.paste(img_rgba, mask=img_rgba.split()[-1])  # alpha
    return bg_img

def encode_image(out_rgba: Image.Image, fmt: str, quality: int = 80, bg=(255,255,255)):
    fmt = (fmt or "png").lower().strip()

    if fmt == "png":
        buf = io.BytesIO()
        out_rgba.save(buf, format="PNG")
        return buf.getvalue(), "image/png"

    if fmt in ["jpg", "jpeg"]:
        rgb = flatten_rgba_to_rgb(out_rgba, bg=bg)
        buf = io.BytesIO()
        rgb.save(buf, format="JPEG", quality=quality, optimize=True)
        return buf.getvalue(), "image/jpeg"

    if fmt == "webp":
        # nếu bạn muốn GIỮ alpha: dùng out_rgba.save(..., "WEBP")
        # nếu muốn flatten: chuyển RGB như JPEG
        rgb = flatten_rgba_to_rgb(out_rgba, bg=bg)
        buf = io.BytesIO()
        rgb.save(buf, format="WEBP", quality=quality, method=6)
        return buf.getvalue(), "image/webp"

    # fallback
    buf = io.BytesIO()
    out_rgba.save(buf, format="PNG")
    return buf.getvalue(), "image/png"
