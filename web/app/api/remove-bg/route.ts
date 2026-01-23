import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
    const timeoutMs = Number(process.env.PY_TIMEOUT_MS || 120_000); // 120s

    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const formData = await req.formData();
        const imageFile = formData.get("image");
        const settingsRaw = formData.get("settings");

        if (!(imageFile instanceof File)) {
            return NextResponse.json(
                { error: "Thiếu file ảnh (image)." },
                { status: 400 },
            );
        }
        if (typeof settingsRaw !== "string") {
            return NextResponse.json(
                { error: "Thiếu settings (settings)." },
                { status: 400 },
            );
        }

        const pyUrl =
            process.env.PY_REMOVE_BG_URL || "http://localhost:8000/remove-bg";
        if (!pyUrl) {
            return NextResponse.json(
                { error: "Chưa cấu hình PY_REMOVE_BG_URL" },
                { status: 500 },
            );
        }

        const fd = new FormData();
        fd.append("image", imageFile);
        fd.append("settings", settingsRaw);

        const pyRes = await fetch(pyUrl, {
            method: "POST",
            body: fd,
            signal: controller.signal, // ✅ đây là “dao chém”
        });

        if (!pyRes.ok) {
            const detail = await pyRes.text().catch(() => "");
            return NextResponse.json(
                { error: "Python xử lý lỗi", detail },
                { status: 502 },
            );
        }

        const outBuf = await pyRes.arrayBuffer();
        const contentType = pyRes.headers.get("content-type") || "image/png";

        return new NextResponse(outBuf, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "no-store",
                "X-Processor": "python-remove-bg",
            },
        });
    } catch (err: any) {
        // ✅ Timeout/Abort ở SERVER
        if (err?.name === "AbortError") {
            return NextResponse.json(
                {
                    error: `Timeout ${Math.round(timeoutMs / 1000)}s (Next server abort Python request)`,
                },
                { status: 504 },
            );
        }

        return NextResponse.json(
            { error: err?.message || "Lỗi nội bộ server" },
            { status: 500 },
        );
    } finally {
        clearTimeout(t);
    }
}
