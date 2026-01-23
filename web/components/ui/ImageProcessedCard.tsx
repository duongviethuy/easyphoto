"use client";

import React from "react";
import { Download, Sparkles } from "lucide-react";

interface ResultViewerProps {
    imageSrc: string | null;
    isProcessing: boolean;
    fileName?: string;
    className?: string;
    onDownload?: (imageSrc: string) => void;
}

// Style caro để hiển thị sự trong suốt
const CHECKER_STYLE: React.CSSProperties = {
    backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
    backgroundSize: "10px 10px",
    backgroundColor: "#f8fafc", // Màu nền nhẹ cho caro
};

export default function ImageProcessedCard({
    imageSrc,
    isProcessing,
    fileName,
    className,
    onDownload,
}: ResultViewerProps) {
    const handleDownload = async (): Promise<void> => {
        if (!imageSrc) return;
        if (onDownload) return onDownload(imageSrc);

        // lấy blob để biết mime
        const blob = await fetch(imageSrc).then((r) => r.blob());
        const mime = blob.type || "image/png";

        const ext =
            mime === "image/png"
                ? "png"
                : mime === "image/jpeg"
                  ? "jpg"
                  : mime === "image/webp"
                    ? "webp"
                    : "png";

        const a = document.createElement("a");
        a.href = imageSrc;
        a.download = fileName ?? `easyphoto-removed-${Date.now()}.${ext}`;
        a.click();
    };

    // --- TRƯỜNG HỢP 1: ĐANG XỬ LÝ (LOADING) ---
    // Giữ nguyên khung cũ để hiện loading cho đẹp
    if (isProcessing) {
        return (
            <div
                className={`h-full min-h-[360px] w-full rounded-3xl border border-slate-200 bg-white flex flex-col items-center justify-center shadow-sm relative overflow-hidden ${className ?? ""}`}
            >
                <div className="absolute inset-0 z-20 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(var(--primary-color))] mb-4" />
                    <p className="text-[rgb(var(--primary-color))] font-medium animate-pulse">
                        Đang phù phép... ⏳
                    </p>
                </div>
            </div>
        );
    }

    // --- TRƯỜNG HỢP 2: ĐÃ CÓ KẾT QUẢ (SHOW ẢNH) ---
    // Đây là chỗ thầy sửa: Bỏ khung, ôm sát ảnh
    if (imageSrc) {
        return (
            <div
                className={`flex flex-col items-center gap-4 w-fit mx-auto ${className ?? ""}`}
            >
                {/* WRAPPER ẢNH:
                    - w-fit: Ôm sát chiều rộng ảnh
                    - relative: Để làm nền cho ảnh
                */}
                <div className="relative w-fit rounded-xl overflow-hidden shadow-sm ring-1 ring-slate-900/5">
                    {/* Lớp nền caro nằm dưới cùng, chỉ to bằng đúng cái ảnh */}
                    <div
                        className="absolute inset-0 z-0 opacity-100"
                        style={CHECKER_STYLE}
                    />

                    {/* Ảnh kết quả đè lên trên */}
                    <img
                        src={imageSrc}
                        alt="Removed Background"
                        className="relative z-10 block max-w-full h-auto object-contain bg-transparent"
                    />
                </div>

                {/* Nút Download nằm tách biệt bên dưới cho sạch */}
                <button
                    type="button"
                    onClick={handleDownload}
                    className={[
                        "flex items-center gap-2 px-6 py-2.5 rounded-full font-bold shadow-md",
                        "bg-[rgb(var(--primary-color))] text-white text-sm",
                        "transition-all duration-200",
                        "hover:opacity-90 hover:-translate-y-0.5 active:scale-95",
                    ].join(" ")}
                >
                    <Download className="w-4 h-4" />
                    Tải ảnh về máy
                </button>
            </div>
        );
    }

    // --- TRƯỜNG HỢP 3: CHƯA CÓ GÌ (EMPTY STATE) ---
    // Giữ nguyên cái hộp để placeholder
    return (
        <div
            className={[
                "h-full min-h-[360px] w-full rounded-3xl",
                "border border-slate-200 bg-white",
                "flex flex-col items-center justify-center relative overflow-hidden",
                "shadow-sm select-none",
                className ?? "",
            ].join(" ")}
        >
            <div className="text-center p-6">
                <div className="bg-white p-4 rounded-full inline-block shadow-sm mb-4 border border-slate-200">
                    <Sparkles className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700">
                    Kết quả sẽ hiện ở đây
                </h3>
                <p className="text-sm mt-1 text-slate-500">
                    Sạch bong kin kít, nền bay màu 😌✨
                </p>
            </div>
        </div>
    );
}
