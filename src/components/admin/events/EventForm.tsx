"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Save, Eye } from "lucide-react"
import { Input, Textarea, Select } from "@/components/ui/form"
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/admin"
import { Button } from "@/components/admin/Button"
import { ImageUploader } from "@/components/admin/ImageUploader"
import { toast } from "@/components/ui/toast"
import { createEvent, updateEvent, createActivityLog, getCurrentUser } from "@/lib/cms/client-actions"
import { slugify } from "@/lib/utils"
import { Event } from "@/lib/cms/types"

export function EventForm({ event }: { event: Event | null }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: event?.title || "",
    slug: event?.slug || "",
    description: event?.description || "",
    event_date: event?.event_date || "",
    start_time: event?.start_time || "09:00",
    end_time: event?.end_time || "18:00",
    location: event?.location || "",
    featured_image: event?.featured_image || null,
    registration_url: event?.registration_url || "",
    status: event?.status || "upcoming",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!event && form.title && !form.slug) {
      setForm((f) => ({ ...f, slug: slugify(form.title) }))
    }
  }, [form.title, event, form.slug])

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: "" }))
  }

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.title.trim()) errs.title = "Title is required"
    if (!form.slug.trim()) errs.slug = "Slug is required"
    if (!form.event_date) errs.event_date = "Event date is required"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function save() {
    if (!validate()) {
      toast.error("Please fix the errors")
      return
    }
    setSaving(true)
    try {
      const user = await getCurrentUser()
      const payload = {
        ...form,
        registration_url: form.registration_url || null,
        location: form.location || null,
        description: form.description || null,
        featured_image: form.featured_image || null,
      }
      if (event) {
        const { error } = await updateEvent(event.id, payload)
        if (error) {
          toast.error(error)
          return
        }
        await createActivityLog({
          admin_user_id: user?.id || null,
          admin_email: user?.email || null,
          action: "update",
          entity_type: "event",
          entity_id: event.id,
          description: form.title,
        })
        toast.success("Event updated")
        router.push("/admin/events")
      } else {
        const { data, error } = await createEvent(payload)
        if (error) {
          toast.error(error)
          return
        }
        await createActivityLog({
          admin_user_id: user?.id || null,
          admin_email: user?.email || null,
          action: "create",
          entity_type: "event",
          entity_id: data?.id || null,
          description: form.title,
        })
        toast.success("Event created")
        router.push("/admin/events")
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end gap-2 sticky top-14 lg:top-0 bg-slate-50 py-3 z-10 -mt-3">
        {event && (
          <Button asChild href={`/events/${event.slug}`} variant="outline">
            <Eye size={14} /> Preview
          </Button>
        )}
        <Button onClick={save} variant="primary" disabled={saving}>
          <Save size={14} /> {saving ? "Saving..." : "Save Event"}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input label="Title" value={form.title} onChange={(e) => update("title", e.target.value)} error={errors.title} required />
              <Input label="Slug" value={form.slug} onChange={(e) => update("slug", e.target.value)} error={errors.slug} required />
              <Textarea label="Description" value={form.description} onChange={(e) => update("description", e.target.value)} rows={6} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Date & Location</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <Input label="Event Date" type="date" value={form.event_date} onChange={(e) => update("event_date", e.target.value)} error={errors.event_date} required />
                <Input label="Start Time" type="time" value={form.start_time} onChange={(e) => update("start_time", e.target.value)} />
                <Input label="End Time" type="time" value={form.end_time} onChange={(e) => update("end_time", e.target.value)} />
              </div>
              <Input label="Location" value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="e.g. Central Stadium, Mumbai" />
              <Input label="Registration URL" type="url" value={form.registration_url} onChange={(e) => update("registration_url", e.target.value)} placeholder="https://..." />
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardBody>
              <Select
                value={form.status}
                onChange={(e) => update("status", e.target.value as any)}
                options={[
                  { value: "upcoming", label: "Upcoming" },
                  { value: "live", label: "Live Event" },
                  { value: "completed", label: "Completed" },
                  { value: "cancelled", label: "Cancelled" },
                ]}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardBody>
              <ImageUploader
                value={form.featured_image}
                onChange={(url) => update("featured_image", url)}
                folder="events"
                aspectRatio="video"
              />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}