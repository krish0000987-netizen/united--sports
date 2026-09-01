import Link from "next/link"
import { Plus } from "lucide-react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "danger" | "gold" | "ghost"
  size?: "sm" | "md" | "lg"
  asChild?: boolean
  href?: string
  children: React.ReactNode
}

const variants = {
  primary: "bg-[#0B1D3A] text-white hover:bg-[#12295a] shadow-sm",
  outline: "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700",
  danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
  gold: "bg-[#C9A227] text-[#0B1D3A] hover:bg-[#d8b43a] font-semibold shadow-sm",
  ghost: "hover:bg-slate-100 text-slate-700",
}

const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
}

export function Button({ variant = "primary", size = "md", asChild, href, className = "", children, ...props }: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#0B1D3A]/20 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`
  if (asChild && href) {
    return <Link href={href} className={classes}>{children}</Link>
  }
  return <button className={classes} {...props}>{children}</button>
}

export function AddButton({ href, label = "Add New" }: { href: string; label?: string }) {
  return (
    <Button asChild href={href} variant="primary" size="md">
      <Plus size={14} /> {label}
    </Button>
  )
}