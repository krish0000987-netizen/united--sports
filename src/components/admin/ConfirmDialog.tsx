"use client"
import { useState } from "react"
import { AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: "danger" | "warning" | "info"
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null

  const colors = {
    danger: "bg-red-600 hover:bg-red-700",
    warning: "bg-amber-600 hover:bg-amber-700",
    info: "bg-blue-600 hover:bg-blue-700",
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/50 animate-in fade-in" onClick={onCancel}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className={cn(
            "h-10 w-10 rounded-full grid place-items-center shrink-0",
            variant === "danger" ? "bg-red-100" : variant === "warning" ? "bg-amber-100" : "bg-blue-100"
          )}>
            <AlertTriangle size={20} className={cn(
              variant === "danger" ? "text-red-600" : variant === "warning" ? "text-amber-600" : "text-blue-600"
            )} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-600 mt-1">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 h-9 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={cn("px-4 h-9 rounded-lg text-sm font-medium text-white", colors[variant])}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export function useConfirm() {
  const [state, setState] = useState<{
    open: boolean
    title: string
    message: string
    onConfirm: () => void
    variant?: "danger" | "warning" | "info"
  }>({ open: false, title: "", message: "", onConfirm: () => {} })

  const confirm = (opts: { title: string; message: string; variant?: "danger" | "warning" | "info"; confirmText?: string }): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        open: true,
        title: opts.title,
        message: opts.message,
        variant: opts.variant || "danger",
        onConfirm: () => {
          setState((s) => ({ ...s, open: false }))
          resolve(true)
        },
      })
    })
  }

  const dialog = (
    <ConfirmDialog
      open={state.open}
      title={state.title}
      message={state.message}
      variant={state.variant}
      onConfirm={state.onConfirm}
      onCancel={() => setState((s) => ({ ...s, open: false }))}
    />
  )

  return { confirm, dialog }
}