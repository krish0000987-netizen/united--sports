import { PageHeader } from "@/components/admin/PageHeader"
import { TestimonialForm } from "@/components/admin/testimonials/TestimonialForm"
import { getTestimonialById } from "@/lib/cms/data"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function TestimonialEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const isNew = id === "new"
  const testimonial = isNew ? null : await getTestimonialById(id)
  if (!isNew && !testimonial) notFound()

  return (
    <div className="max-w-5xl">
      <PageHeader
        title={isNew ? "New Testimonial" : "Edit Testimonial"}
        back="/admin/testimonials"
      />
      <TestimonialForm testimonial={testimonial} />
    </div>
  )
}