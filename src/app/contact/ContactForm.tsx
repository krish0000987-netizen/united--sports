"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createEnquiry } from "@/lib/cms/data"
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
    const { error } = await createEnquiry({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      subject: form.subject || null,
      message: form.message,
      status: "new",
    })
    if (error) {
      setErrorMsg(error)
      setStatus("error")
      return
    }
    setStatus("success")
    setForm({ name: "", email: "", phone: "", subject: "", message: "" })
  }

  if (status === "success") {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
        <div className="mx-auto h-14 w-14 rounded-full bg-emerald-100 grid place-items-center text-emerald-600 mb-4">
          <CheckCircle2 size={28} />
        </div>
        <h3 className="text-xl font-bold text-[#0B1D3A]">Message sent!</h3>
        <p className="text-slate-500 mt-2 text-sm max-w-md mx-auto">
          Thank you for getting in touch. Our team will get back to you as soon as possible.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-medium text-[#C9A227] hover:underline"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-5">
      <div className="grid md:grid-cols-2 gap-5">
        <Field label="Name *" value={form.name} onChange={update("name")} required />
        <Field label="Email *" type="email" value={form.email} onChange={update("email")} required />
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <Field label="Phone" type="tel" value={form.phone} onChange={update("phone")} />
        <Field label="Subject" value={form.subject} onChange={update("subject")} />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Message *</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={update("message")}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B1D3A]/20 focus:border-[#0B1D3A]"
        />
      </div>

      {status === "error" && errorMsg && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <Button type="submit" variant="gold" size="lg" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending..." : <>Send Message <Send size={16} className="ml-2" /></>}
      </Button>
    </form>
  )
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B1D3A]/20 focus:border-[#0B1D3A]"
      />
    </div>
  )
}
