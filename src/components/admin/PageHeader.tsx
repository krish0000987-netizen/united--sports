import Link from "next/link"
import { ArrowLeft } from "lucide-react"
export { AddButton } from "@/components/admin/Button"

export function PageHeader({
  title,
  description,
  back,
  action,
}: {
  title: string
  description?: string
  back?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div>
        {back && (
          <Link href={back} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 mb-2">
            <ArrowLeft size={14} />
            Back
          </Link>
        )}
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}