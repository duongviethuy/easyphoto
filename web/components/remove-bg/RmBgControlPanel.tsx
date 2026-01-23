"use client";

import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import SegmentedControl from "../ui/SegmentedControl";
import {
    FileType2,
    Scan,
    SlidersHorizontal,
    Play,
    ImageUp,
    Sparkles,
} from "lucide-react";
import {
    formatOptions,
    resolutionOptions,
    qualityOptions,
} from "@/config/imageOptions";

import { resizeImageLongSide } from "@/utils/resizeImage";

export type Setting = {
    format: string;
    resolution: string;
    quality: string;
};

interface ControlPanelProps {
    image: File | null; // ✅ image là File
    onProcessedImage?: (url: string) => void;
    onError?: (msg: string) => void;
}

export default function ControlPanel({
    image,
    onProcessedImage,
    onError,
}: ControlPanelProps) {
    const defaults: Setting = useMemo(
        () => ({
            format: "jpeg",
            resolution: "2048",
            quality: "standard",
        }),
        [],
    );

    const [settings, setSettings] = useState<Setting>(defaults);
    const [alert, setAlert] = useState<string>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // dùng để cleanup objectURL nếu server trả blob
    const lastObjectUrlRef = useRef<string | null>(null);

    const disabledSubmit = !image || isSubmitting;

    useEffect(() => {
        // cleanup khi unmount
        return () => {
            if (lastObjectUrlRef.current)
                URL.revokeObjectURL(lastObjectUrlRef.current);
        };
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setAlert(undefined);

        if (!image) {
            const msg = "Vui lòng chọn file ảnh trước khi xử lý.";
            setAlert(msg);
            onError?.(msg);
            return;
        }

        setIsSubmitting(true);
        try {
            const longSide = Number(settings?.resolution ?? 0) || 0;

            // resize trước khi upload (giữ tỉ lệ)
            const resizedBlob = longSide
                ? await resizeImageLongSide(image, longSide, "image/jpeg", 0.92)
                : image;

            const uploadFile =
                resizedBlob instanceof Blob && resizedBlob !== image
                    ? new File(
                          [resizedBlob],
                          image.name.replace(/\.\w+$/, ".jpg"),
                          {
                              type: "image/jpeg",
                          },
                      )
                    : image;

            const formData = new FormData();
            formData.append("image", uploadFile);
            // settings gửi lên: nên set resolution null/0 để server khỏi resize lại
            formData.append("settings", JSON.stringify(settings));

            const res = await fetch("/api/remove-bg", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Request failed");

            const outBlob = await res.blob();
            const outUrl = URL.createObjectURL(outBlob);
            onProcessedImage?.(outUrl);
        } catch (err: any) {
            const msg = err?.message || "Lỗi xử lý";
            setAlert(msg);
            onError?.(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full mx-auto space-y-2">
            {alert && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {alert}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="flex flex-wrap items-stretch gap-3 lg:flex-nowrap"
            >
                <div className="flex-1">
                    <SegmentedControl
                        label="định dạng file"
                        rightIcon={<FileType2 size={20} />}
                        name="format"
                        options={formatOptions}
                        value={settings.format}
                        disabled={disabledSubmit}
                        onChange={(formatValue) =>
                            setSettings((prev) => ({
                                ...prev,
                                format: formatValue,
                            }))
                        }
                    />
                </div>

                <div className="flex-1">
                    <SegmentedControl
                        label="Độ phân giải"
                        rightIcon={<Scan size={20} />}
                        name="resolution"
                        options={resolutionOptions}
                        value={settings.resolution}
                        disabled={disabledSubmit}
                        onChange={(resolutionValue) =>
                            setSettings((prev) => ({
                                ...prev,
                                resolution: resolutionValue,
                            }))
                        }
                    />
                </div>

                <div className="flex-1">
                    <SegmentedControl
                        label="chất lượng xóa"
                        rightIcon={<SlidersHorizontal size={20} />}
                        name="quality"
                        options={qualityOptions}
                        value={settings.quality}
                        disabled={disabledSubmit}
                        onChange={(qualityValue) =>
                            setSettings((prev) => ({
                                ...prev,
                                quality: qualityValue,
                            }))
                        }
                    />
                </div>

                <button
                    type="submit"
                    disabled={disabledSubmit}
                    className={[
                        "shrink-0",
                        "w-full sm:w-[180px]",
                        "rounded-2xl px-6",
                        "flex items-center justify-center gap-2 font-semibold",
                        "border border-primary bg-primary text-white",
                        "transition-all duration-200",
                        "hover:opacity-90 active:scale-[0.98]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                        "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:opacity-60 disabled:active:scale-100",
                        "min-h-20",
                    ].join(" ")}
                >
                    {isSubmitting ? (
                        <>
                            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                            <span>Đang xử lý…</span>
                        </>
                    ) : (
                        <>
                            <Play size={20} />
                            <span>Xử lý</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
