"use client";

import Link from "next/link";
// Import thêm icon Aperture cho giống ảnh mẫu
import { Facebook, Github, Mail, Aperture } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        // THAY ĐỔI LỚN VỀ CHIỀU CAO:
        // - py-4: Padding trên dưới rất nhỏ (bằng 1/3 trước đây)
        // - Flex row trên PC để dàn trải nội dung nằm ngang
        <footer className="bg-primary mt-auto text-white py-4">
            <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                {/* PHẦN 1: LOGO & SOCIAL (Nằm bên trái trên PC) */}
                <div className="flex flex-col md:flex-row items-center gap-4">
                    {/* Logo & Tên */}
                    <div className="flex items-center gap-2">
                        {/* Dùng icon Aperture của Lucide thay cho box chữ E cũ */}
                        <Aperture className="w-6 h-6" />
                        <span className="text-lg font-bold tracking-tight">
                            EasyPhoto
                        </span>
                    </div>

                    {/* Social Icons Mini (Gọn hơn version trước) */}
                </div>

                {/* PHẦN 2: LINKS LIÊN HỆ (Nằm giữa) */}
                {/* Chỉ giữ lại đúng 2 link theo yêu cầu */}
                <div className="flex gap-3 text-primary-100">
                    <SocialMiniLink
                        href="https://github.com/duongviethuy"
                        icon={Github}
                    />
                    <SocialMiniLink
                        href="https://facebook.com"
                        icon={Facebook}
                    />
                    <SocialMiniLink
                        href="mailto:contact@easyphoto.com"
                        icon={Mail}
                    />
                </div>

                {/* PHẦN 3: COPYRIGHT (Nằm phải) */}
                <div className="text-xs text-primary-100/70 whitespace-nowrap">
                    © {currentYear} Modern Team.
                </div>
            </div>
        </footer>
    );
}

// Component con cho icon mạng xã hội nhỏ gọn
function SocialMiniLink({ href, icon: Icon }: { href: string; icon: any }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white hover:scale-110 transition-all"
        >
            <Icon className="w-4 h-4" />
        </a>
    );
}
