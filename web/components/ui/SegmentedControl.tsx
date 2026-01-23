"use client";

import React from "react";

export type Option = {
    value: string;
    label: React.ReactNode;
    disabled?: boolean;
};

interface SegmentedControlProps {
    label: string;
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    name?: string;
    className?: string;
    rightIcon?: React.ReactNode;
}

export default function SegmentedControl({
    label,
    options,
    value,
    onChange,
    disabled = false,
    name,
    className = "",
    rightIcon,
}: SegmentedControlProps) {
    if (options.length === 0) return null;

    const selectedIndex = Math.max(
        0,
        options.findIndex((o) => o.value === value),
    );

    // giữ nguyên biến (fallback)
    const widthPercent = 100 / options.length;

    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const btnRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

    const [indicator, setIndicator] = React.useState({
        left: 0,
        width: 0,
        pad: 4,
        ready: false,
    });

    const updateIndicator = React.useCallback(() => {
        const container = containerRef.current;
        const btn = btnRefs.current[selectedIndex];
        if (!container || !btn) return;

        const c = container.getBoundingClientRect();
        const b = btn.getBoundingClientRect();

        const styles = window.getComputedStyle(container);
        const pad = parseFloat(styles.paddingLeft || "0") || 0;

        const left = b.left - c.left;
        const width = b.width;

        setIndicator({ left, width, pad, ready: true });
    }, [selectedIndex]);

    React.useLayoutEffect(() => {
        const id = requestAnimationFrame(updateIndicator);
        return () => cancelAnimationFrame(id);
    }, [updateIndicator, value, options.length]);

    React.useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const ro = new ResizeObserver(() => updateIndicator());
        ro.observe(container);
        btnRefs.current.forEach((b) => b && ro.observe(b));

        window.addEventListener("resize", updateIndicator);
        return () => {
            ro.disconnect();
            window.removeEventListener("resize", updateIndicator);
        };
    }, [updateIndicator, options.length]);

    return (
        <div
            className={[
                "h-full rounded-2xl border border-slate-200 bg-white p-4",
                className,
            ].join(" ")}
        >
            <div className="mb-3 flex items-center justify-between">
                <span className="text-sm uppercase font-bold text-primary">
                    {label}
                </span>
                {rightIcon && (
                    <div className="flex items-center text-primary">
                        {rightIcon}
                    </div>
                )}
            </div>

            {/* Track ôm theo chữ */}
            <div
                ref={containerRef}
                role="radiogroup"
                aria-label={name}
                className={[
                    "relative inline-flex w-fit max-w-full items-center",
                    "rounded-xl border border-slate-200 bg-slate-50 p-1",
                    "isolate overflow-hidden",
                    disabled ? "opacity-60 pointer-events-none" : "",
                ].join(" ")}
            >
                {/* Indicator */}
                <div
                    aria-hidden
                    className={[
                        "absolute rounded-lg bg-white",
                        "shadow-sm ring-1 ring-black/5",
                        "transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]",
                    ].join(" ")}
                    style={{
                        top: indicator.pad,
                        bottom: indicator.pad,
                        left: indicator.pad,
                        width: indicator.ready
                            ? `${indicator.width}px`
                            : `calc(${widthPercent}% - 2px)`,
                        transform: indicator.ready
                            ? `translateX(${indicator.left - indicator.pad}px)`
                            : `translateX(0px)`,
                        opacity: indicator.ready ? 1 : 0,
                    }}
                />

                {options.map((opt, idx) => {
                    const active = opt.value === value;
                    const isDisabled = disabled || opt.disabled;

                    return (
                        <button
                            key={opt.value}
                            ref={(el) => {
                                btnRefs.current[idx] = el;
                            }}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            disabled={isDisabled}
                            onClick={() => {
                                if (!isDisabled) onChange(opt.value);
                            }}
                            className={[
                                "relative z-10 rounded-lg px-3 py-2 text-sm font-medium",
                                "transition-colors duration-200",
                                "outline-none focus:outline-none select-none",
                                active
                                    ? "text-primary font-semibold"
                                    : "text-slate-500 hover:text-slate-700",
                                isDisabled
                                    ? "cursor-not-allowed opacity-50"
                                    : "cursor-pointer",
                            ].join(" ")}
                        >
                            <span className="block transition-transform duration-100 active:scale-95">
                                {opt.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
