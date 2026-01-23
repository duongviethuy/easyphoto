"use client";
import { Palette } from "lucide-react";

interface ColorPickerProps {
    value: string;
    onChange: (hex: string) => void;
    className?: string;
}

export default function ColorPicker({
    value,
    className,
    onChange,
}: ColorPickerProps) {
    return (
        <div className={`relative group flex items-center ${className}`}>
            {/* Icon Palette */}
            <Palette className="w-5 h-5 text-primary mr-2 group-hover:text-primary transition-colors" />

            {/* Input Color ẩn bên trong vòng tròn */}
            <div
                className="relative overflow-hidden w-8 h-8 rounded-full border-2 border-gray-200 cursor-pointer shadow-sm hover:scale-110 transition-transform"
                style={{ backgroundColor: value }} // Hiển thị luôn màu đang chọn lên vòng tròn
            >
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 cursor-pointer opacity-0"
                />
            </div>
        </div>
    );
}
