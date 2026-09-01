export function formatDate(dateStr: string | Date | null | undefined, format: "short" | "long" | "datetime" = "short"): string {
  if (!dateStr) return "—"
  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr
  if (isNaN(date.getTime())) return "—"

  if (format === "long") {
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }
  if (format === "datetime") {
    return date.toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
  }
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

export function formatDistanceToNow(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return "—"
  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr
  if (isNaN(date.getTime())) return "—"

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return "just now"
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHour < 24) return `${diffHour}h ago`
  if (diffDay < 7) return `${diffDay}d ago`
  if (diffDay < 30) return `${Math.floor(diffDay / 7)}w ago`
  if (diffDay < 365) return `${Math.floor(diffDay / 30)}mo ago`
  return `${Math.floor(diffDay / 365)}y ago`
}

export function formatTime(timeStr: string | null | undefined): string {
  if (!timeStr) return "—"
  try {
    const [h, m] = timeStr.split(":")
    const hour = parseInt(h, 10)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${m} ${ampm}`
  } catch {
    return timeStr
  }
}