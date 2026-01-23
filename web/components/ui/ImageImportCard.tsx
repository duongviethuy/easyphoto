"use client";

import React, { useEffect, useRef, useState } from "react";
import { Upload, Image as ImageIcon, X, FileWarning } from "lucide-react";

interface ImageImportCardProps {
    rawImage: File | null;
    onRawImageChange: (next: File | null) => void;
    maxSizeMB: number;
    className?: string;
}

export default function ImageImportCard({
    rawImage,
    onRawImageChange,
    maxSizeMB,
    className,
}: ImageImportCardProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const MAX_SIZE_BYTES = maxSizeMB * 1024 * 1024;

    useEffect(() => {
        setError(null);
        if (!rawImage) {
            setPreview(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }
        const url = URL.createObjectURL(rawImage);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [rawImage]);

    const handleFileSelect = (file: File | null) => {
        setError(null);
        if (!file) {
            onRawImageChange(null);
            return;
        }
        if (!file.type.startsWith("image/")) {
            setError("Vui lòng chỉ chọn file ảnh (JPG, PNG...)");
            return;
        }
        if (file.size > MAX_SIZE_BYTES) {
            setError(`Ảnh quá lớn! Vui lòng chọn ảnh dưới ${maxSizeMB}MB.`);
            return;
        }
        onRawImageChange(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileSelect(e.dataTransfer.files?.[0] ?? null);
    };

    return (
        <div className={`w-full h-full flex flex-col gap-3 ${className ?? ""}`}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
                accept="image/*"
                className="hidden"
            />

            {/* --- LOGIC TÁCH BIỆT Ở ĐÂY --- */}

            {preview ? (
                /* =========================================
                   TRẠNG THÁI 1: ĐÃ CÓ ẢNH (PREVIEW MODE)
                   Nguyên tắc: w-fit, block, không padding thừa
                   ========================================= */
                <div className="relative w-fit mx-auto group">
                    {/* Nút Xóa: nằm đè lên góc ảnh */}
                    <button
                        type="button"
                        onClick={() => handleFileSelect(null)}
                        className="
                            absolute -top-0 -right-0 z-50
                            flex h-8 w-8 items-center justify-center rounded-full 
                            bg-white text-slate-500 shadow-md border border-slate-200
                            transition-all duration-200
                            hover:bg-red-500 hover:text-white hover:scale-110 hover:border-red-500
                        "
                        title="Gỡ ảnh"
                    >
                        <X size={16} strokeWidth={2.5} />
                    </button>

                    {/* Ảnh chính: display block để triệt tiêu khoảng trắng dưới chân */}
                    <img
                        src={preview}
                        alt="Preview"
                        className="block max-w-full h-auto rounded-xl shadow-sm object-cover"
                    />
                </div>
            ) : (
                /* =========================================
                   TRẠNG THÁI 2: CHƯA CÓ ẢNH (UPLOAD MODE)
                   Nguyên tắc: min-h lớn, border dashed, căn giữa
                   ========================================= */
                <div
                    className={`
                        relative w-full overflow-hidden rounded-3xl min-h-[360px] 
                        flex flex-col items-center justify-center text-center p-6
                        transition-all duration-300 ease-in-out select-none
                        border-2 border-dashed cursor-pointer
                        ${
                            isDragging
                                ? "border-blue-500 bg-blue-50 scale-[1.01]"
                                : "border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50"
                        }
                    `}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div
                        className={`
                            mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl 
                            shadow-sm transition-transform duration-300
                            ${isDragging ? "bg-blue-100 text-blue-600 scale-110" : "bg-white border border-slate-200 text-slate-400"}
                        `}
                    >
                        <Upload className="h-8 w-8" strokeWidth={1.5} />
                    </div>

                    <h3 className="text-lg font-bold text-slate-700">
                        Kéo thả ảnh vào đây
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 max-w-[200px]">
                        Hỗ trợ JPG, PNG, WebP chất lượng cao
                    </p>

                    <div className="mt-6 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
                        <ImageIcon className="h-3.5 w-3.5" />
                        <span>Tối đa {maxSizeMB}MB</span>
                    </div>
                </div>
            )}

            {/* Thông báo lỗi */}
            {error && (
                <div className="animate-in fade-in slide-in-from-top-2 flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 font-medium">
                    <FileWarning className="h-4 w-4" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}
