export type Option = {
    value: string;
    label: string;
    disabled?: boolean;
};
export const formatOptions: Option[] = [
    { value: "png", label: "PNG" },
    { value: "jpeg", label: "JPEG" },
] as const;

export const resolutionOptions: Option[] = [
    { value: "1024", label: "1024px" },
    { value: "2048", label: "2048px" },
    { value: "4096", label: "4096px" },
] as const;

export const qualityOptions: Option[] = [
    { value: "high", label: "CAO NHẤT" },
    { value: "balance", label: "CÂN BẰNG" },
    { value: "standard", label: "TIÊU CHUẨN" },
] as const;
