export async function resizeImageLongSide(
    file: File,
    longSide: number,
    mime: "image/jpeg" | "image/png" | "image/webp" = "image/jpeg",
    quality = 0.9,
): Promise<Blob> {
    const bitmap = await createImageBitmap(file);

    const w = bitmap.width;
    const h = bitmap.height;
    const cur = Math.max(w, h);

    // nếu ảnh nhỏ hơn target, không resize
    if (!longSide || cur <= longSide) {
        // vẫn convert mime nếu bạn muốn đồng bộ
        const canvas0 = document.createElement("canvas");
        canvas0.width = w;
        canvas0.height = h;
        const ctx0 = canvas0.getContext("2d");
        if (!ctx0) throw new Error("No canvas context");
        ctx0.drawImage(bitmap, 0, 0);

        return await new Promise<Blob>((resolve, reject) => {
            canvas0.toBlob(
                (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
                mime,
                quality,
            );
        });
    }

    const scale = longSide / cur;
    const nw = Math.max(1, Math.round(w * scale));
    const nh = Math.max(1, Math.round(h * scale));

    const canvas = document.createElement("canvas");
    canvas.width = nw;
    canvas.height = nh;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No canvas context");

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, nw, nh);

    return await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
            (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
            mime,
            quality,
        );
    });
}
