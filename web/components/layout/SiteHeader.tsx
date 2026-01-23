import Link from "next/link";
import { Aperture, IdCard, Eraser, Info } from "lucide-react";
import ThemeSwitcher from "../tools/ThemeSwitcher"; // Đảm bảo đường dẫn đúng nhé

export default function Header() {
    return (
        <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* === TRÁI: LOGO === */}
                <Link href="/" className="flex items-center gap-2 group">
                    {/* SỬA LỖI: Dùng class text-primary thay vì text-(...) */}
                    <Aperture className="w-8 h-8 text-primary transition-transform group-hover:rotate-180" />
                    <span className="font-bold text-xl uppercase tracking-tight text-primary group-hover:scale-105 transition-all">
                        Easy Photo
                    </span>
                </Link>

                {/* === PHẢI: NAV + SWITCHER === */}
                {/* Gom 2 ông này vào 1 div để chúng nằm cạnh nhau bên phải */}
                <div className="flex items-center gap-6">
                    <nav className="flex items-center gap-6 text-sm font-medium text-primary">
                        <Link
                            href="/id-photo"
                            className="flex items-center gap-2 hover:text-primary transition-colors"
                        >
                            <IdCard className="w-4 h-4" />
                            <span className="hidden sm:inline">
                                Ảnh thẻ 1-click
                            </span>
                        </Link>

                        <Link
                            href="/remove-bg"
                            className="flex items-center gap-2 hover:text-primary transition-colors"
                        >
                            <Eraser className="w-4 h-4" />
                            <span className="hidden sm:inline">Xóa nền</span>
                        </Link>

                        <Link
                            href="/about"
                            className="flex items-center gap-2 hover:text-primary transition-colors"
                        >
                            <Info className="w-4 h-4" />
                            <span className="hidden sm:inline">
                                Về chúng tôi
                            </span>
                        </Link>
                    </nav>

                    {/* Vạch ngăn cách */}
                    <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>

                    {/* Nút đổi màu */}
                    <ThemeSwitcher />
                </div>
            </div>
        </header>
    );
}
