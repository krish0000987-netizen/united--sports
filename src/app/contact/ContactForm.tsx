"use client"

import { useState } from "react"
import { Send, CheckCircle2, AlertCircle } from "lucide-react"

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" })
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("submitting")
    setErrorMsg(null)
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || null,
          subject: form.subject,
          message: form.message,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error || "Failed to submit")
      }
      setStatus("success")
      setForm({ name: "", email: "", phone: "", subject: "", message: "" })
    } catch (err: any) {
      setErrorMsg(err.message)
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className="surface-card rounded-sm p-10 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/15 text-primary">
          <CheckCircle2 size={28} />
        </div>
        <h3 className="mt-4 text-2xl">Message sent!</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Thank you for getting in touch. Our team will get back to you as soon as possible.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-bold uppercase tracking-[0.14em] text-primary hover:underline"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="surface-card rounded-sm p-8 sm:p-10">
      <div className="space-y-6">
        <Field id="name" label="Name" required value={form.name} onChange={update("name")} />
        <Field id="email" label="Email" type="email" required value={form.email} onChange={update("email")} />
        <Field id="phone" label="Phone (optional)" type="tel" value={form.phone} onChange={update("phone")} />
        <Field id="subject" label="Subject (optional)" value={form.subject} onChange={update("subject")} />
        <div>
          <label
            htmlFor="message"
            className="text-xs uppercase tracking-[0.24em] text-muted-foreground"
          >
            Message
          </label>
          <textarea
            id="message"
            required
            rows={5}
            value={form.message}
            onChange={update("message")}
            className="mt-3 w-full resize-none rounded-sm border border-input bg-background/60 px-4 py-3 outline-none transition-colors focus:border-primary"
          />
        </div>

        {status === "error" && errorMsg && (
          <div className="flex items-start gap-2 rounded-sm border border-destructive/40 bg-destructive/10 p-3 text-sm text-red-300">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="group inline-flex w-full items-center justify-center gap-3 rounded-sm bg-primary px-8 py-4 text-sm font-extrabold uppercase tracking-[0.14em] text-primary-foreground transition-transform duration-300 hover:-translate-y-1 disabled:opacity-60"
        >
          {status === "submitting" ? "Sending..." : "Submit"}
          <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </form>
  )
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  id: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label htmlFor={id} className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="mt-3 w-full rounded-sm border border-input bg-background/60 px-4 py-3 outline-none transition-colors focus:border-primary"
      />
    </div>
  )
}
