"use client";

import { useState, useEffect } from "react";
import ColorPicker from "./ColorPicker";

export default function ThemeSwitcher() {
    const [themeColor, setThemeColor] = useState("#2563eb"); // Mặc định xanh

    // Hàm helper đổi HEX sang RGB (chỉ dùng nội bộ ở đây)
    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
            : "37 99 235";
    };

    // Load màu từ localStorage khi f5
    useEffect(() => {
        const savedColor = localStorage.getItem("theme-color-hex");
        if (savedColor) {
            updateTheme(savedColor);
        }
    }, []);

    // Hàm xử lý logic đổi màu App
    const updateTheme = (hex: string) => {
        setThemeColor(hex);
        localStorage.setItem("theme-color-hex", hex);
        const rgb = hexToRgb(hex);
        document.documentElement.style.setProperty("--primary-color", rgb);
    };

    return (
        // Dùng lại ColorPicker, truyền logic đổi theme vào
        <div className="flex text-xs font-extralight items-center h-full">
            <span className="text-primary mr-2">Màu chủ đề:</span>
            <ColorPicker value={themeColor} onChange={updateTheme} />
        </div>
    );
}
