"use client"
import { useEffect, useState } from "react"
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

type ToastType = "success" | "error" | "warning" | "info"

interface Toast {
  id: string
  type: ToastType
  message: string
}

let toastListeners: ((toast: Toast) => void)[] = []

export function toast(message: string, type: ToastType = "info") {
  const id = Math.random().toString(36).slice(2)
  toastListeners.forEach((l) => l({ id, type, message }))
}

toast.success = (msg: string) => toast(msg, "success")
toast.error = (msg: string) => toast(msg, "error")
toast.warning = (msg: string) => toast(msg, "warning")
toast.info = (msg: string) => toast(msg, "info")

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const listener = (t: Toast) => {
      setToasts((prev) => [...prev, t])
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id))
      }, 4000)
    }
    toastListeners.push(listener)
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener)
    }
  }, [])

  const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle2 size={18} className="text-emerald-600" />,
    error: <XCircle size={18} className="text-red-600" />,
    warning: <AlertCircle size={18} className="text-amber-600" />,
    info: <Info size={18} className="text-blue-600" />,
  }

  const bgColors: Record<ToastType, string> = {
    success: "border-emerald-200 bg-emerald-50",
    error: "border-red-200 bg-red-50",
    warning: "border-amber-200 bg-amber-50",
    info: "border-blue-200 bg-blue-50",
  }

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "flex items-start gap-3 p-3 rounded-xl border shadow-lg animate-in slide-in-from-top-2 fade-in",
            bgColors[t.type]
          )}
        >
          <div className="shrink-0 mt-0.5">{icons[t.type]}</div>
          <p className="text-sm text-slate-900 flex-1">{t.message}</p>
          <button
            onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
            className="shrink-0 text-slate-400 hover:text-slate-600"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}