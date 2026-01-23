"use client";

import ControlPanel from "../remove-bg/RmBgControlPanel";
import ImageImportCard from "../ui/ImageImportCard";
import ImageProcessedCard from "../ui/ImageProcessedCard";
import { useState } from "react";
import { ImageUp, Sparkles } from "lucide-react";

export default function RmBgPage() {
    const [rawImage, setRawImage] = useState<File | null>(null);
    const [processedImageURL, setProcessedImageURL] = useState<string | null>(
        null,
    );

    return (
        <div className="w-full max-w-6xl mx-auto px-4">
            {/* Header + Slogan */}
            <div className="text-center pt-5">
                <h1 className="uppercase text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                    XÓA NỀN ẢNH{" "}
                    <span className="text-[rgb(var(--primary-color))]">
                        MIỄN PHÍ LẤY LIỀN
                    </span>
                </h1>

                <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Pro Remove Background Studio
                </div>
            </div>

            {/* Main container */}
            <div className="py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-3 items-stretch">
                    {/* BOX 1: Upload */}
                    <div className="rounded-3xl border border-slate-200 bg-white/70 shadow-sm backdrop-blur overflow-hidden flex flex-col min-h-[420px]">
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-[rgb(var(--primary-color))] bg-white">
                                <ImageUp
                                    size={20}
                                    className="text-[rgb(var(--primary-color))]"
                                />
                            </span>
                            <div className="leading-tight">
                                <div className="font-bold uppercase text-[rgb(var(--primary-color))]">
                                    Ảnh gốc
                                </div>
                                <div className="text-xs text-slate-500">
                                    Kéo thả hoặc bấm để chọn file
                                </div>
                            </div>
                        </div>

                        <div className="p-3 flex-1">
                            <ImageImportCard
                                rawImage={rawImage}
                                maxSizeMB={25}
                                onRawImageChange={(file) => setRawImage(file)}
                            />
                        </div>
                    </div>

                    {/* BOX 2: Result */}
                    <div className="rounded-3xl border border-slate-200 bg-white/70 shadow-sm backdrop-blur overflow-hidden flex flex-col min-h-[420px]">
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-[rgb(var(--primary-color))] bg-white">
                                <Sparkles
                                    size={20}
                                    className="text-[rgb(var(--primary-color))]"
                                />
                            </span>
                            <div className="leading-tight">
                                <div className="font-bold uppercase text-[rgb(var(--primary-color))]">
                                    Kết quả
                                </div>
                                <div className="text-xs text-slate-500">
                                    Nền biến mất, chủ thể nổi bật
                                </div>
                            </div>
                        </div>

                        <div className="p-3 flex-1">
                            <ImageProcessedCard
                                imageSrc={processedImageURL}
                                isProcessing={false}
                            />
                        </div>
                    </div>
                </div>

                {/* ControlPanel */}
                <div className="my-3">
                    <div className="rounded-3xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur">
                        <ControlPanel
                            image={rawImage}
                            onProcessedImage={(url) =>
                                setProcessedImageURL(url)
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
