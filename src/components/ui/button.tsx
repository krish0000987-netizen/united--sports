import { cn } from "@/lib/utils"
import React from "react"

export function Button({ className, variant="default", size="default", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default"|"outline"|"ghost"|"gold", size?: "default"|"sm"|"lg"|"icon" }) {
  const base = "inline-flex items-center justify-center rounded-full font-medium transition-all focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50"
  const variants: Record<string,string> = {
    default: "bg-[#0B1D3A] text-white hover:bg-[#12295a] shadow",
    gold: "bg-[#C9A227] text-[#0B1D3A] hover:bg-[#d8b43a] font-semibold shadow",
    outline: "border border-[#0B1D3A]/15 bg-white hover:bg-slate-50 text-[#0B1D3A]",
    ghost: "hover:bg-slate-100 text-[#0B1D3A]"
  }
  const sizes: Record<string,string> = {
    default:"h-10 px-6 py-2 text-sm",
    sm:"h-8 px-4 text-xs",
    lg:"h-12 px-8 text-base",
    icon:"h-10 w-10"
  }
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />
}
