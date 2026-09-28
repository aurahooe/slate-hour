export function hourKey(date = new Date()) {
  const d = new Date(date);
  d.setMinutes(0, 0, 0);
  return d.toISOString().slice(0, 13);
}

export function formatHourLabel(key) {
  const d = new Date(key + ":00:00.000Z");
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    hour12: false,
  }).format(d) + " UTC";
}

export const KICKERS = [
  "Held under the lamp for one hour.",
  "A page that does not hurry.",
  "Written somewhere quiet.",
  "The hour keeps this one.",
  "Not a headline. A note.",
  "Left on the slate.",
];

export function pickKicker(key) {
  let n = 0;
  for (const c of key) n += c.charCodeAt(0);
  return KICKERS[n % KICKERS.length];
}
