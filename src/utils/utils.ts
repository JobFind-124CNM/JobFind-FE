export const formatCurrency = (value: string) => {
    const number = parseFloat(value);
    if (isNaN(number)) return "";

    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(number);
};
