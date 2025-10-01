export const calculateDuration = (
  startString?: string,
  endString?: string
): string => {
  if (!startString || !endString) return "-";

  try {
    const cleanStart = startString.replace(/[^\d/: ]/g, "").trim();
    const [datePart, timePart] = cleanStart.split(" ");
    const [day, month, year] = datePart.split("/").map(Number);
    const [sH, sM, sS] = (timePart || "00:00:00").split(":").map(Number);
    const startDate = new Date(year, month - 1, day, sH, sM, sS);

    const endDate = new Date(endString);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return "Datas inválidas";
    }

    let diffMs = endDate.getTime() - startDate.getTime();
    if (diffMs < 0) return "Datas inválidas";

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const days = Math.floor(diffMinutes / (60 * 24));
    const hours = Math.floor((diffMinutes % (60 * 24)) / 60);
    const minutes = diffMinutes % 60;

    const parts: string[] = [];
    if (days > 0) parts.push(`${days} dia${days > 1 ? "s" : ""}`);
    if (hours > 0) parts.push(`${hours} hora${hours > 1 ? "s" : ""}`);
    if (minutes > 0) parts.push(`${minutes} minuto${minutes > 1 ? "s" : ""}`);

    return parts.length > 0 ? parts.join(" e ") : "menos de 1 minuto";
  } catch (err) {
    console.error("Erro em calculateDuration:", err);
    return "-";
  }
};

export const parseSpreadsheetDateTime = (input: string): string => {
  if (!input) return "-";

  try {
    const clean = input.replace(/[^\d/: ]/g, "").trim();

    const [datePart, timePart] = clean.split(" ");
    if (!datePart) return "-";

    const [day, month, year] = datePart.split("/").map(Number);
    const [hours, minutes] = (timePart || "00:00").split(":").map(Number);

    const d = new Date(year, month - 1, day, hours, minutes || 0);

    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return "-";
  }
};
