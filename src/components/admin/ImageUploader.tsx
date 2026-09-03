"use client"
import { useState, useRef } from "react"
import Image from "next/image"
import { Upload, X, Loader2, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/toast"

const API_BASE = "/api/upload"

/** Extract the storage path from a public media URL (or return null for external URLs). */
function extractPath(url: string | null): string | null {
  if (!url) return null
  const marker = "/storage/v1/object/public/media/"
  const idx = url.indexOf(marker)
  if (idx === -1) return null
  return url.substring(idx + marker.length)
}

interface ImageUploaderProps {
  value: string | null
  onChange: (url: string | null) => void
  folder?: string
  label?: string
  hint?: string
  className?: string
  aspectRatio?: "square" | "video" | "wide"
}

export function ImageUploader({
  value,
  onChange,
  folder = "uploads",
  label,
  hint,
  className,
  aspectRatio = "video",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[21/9]",
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setProgress(0)
    try {
      if (!API_BASE) {
        toast.error("Upload not configured: missing Supabase URL")
        return
      }

      // Simulated progress
      const progressInterval = setInterval(() => {
        setProgress((p) => Math.min(p + 10, 90))
      }, 100)

      const form = new FormData()
      form.set("file", file)
      form.set("bucket", folder)

      const res = await fetch(API_BASE, {
        method: "POST",
        body: form,
        credentials: "include",
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        toast.error(err.error || "Upload failed")
        return
      }

      const result = await res.json()
      if (result.error) {
        toast.error(result.error)
      } else if (result.url) {
        // If there was a previous uploaded image, delete it via API
        const oldPath = extractPath(value)
        if (oldPath && API_BASE) {
          try {
            await fetch(API_BASE, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ path: oldPath, bucket: "media" }),
              credentials: "include",
            }).catch(() => {})
          } catch {}
        }
        onChange(result.url)
        toast.success("Image uploaded successfully")
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to upload image")
    } finally {
      setUploading(false)
      setProgress(0)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  async function handleRemove() {
    if (value) {
      const path = extractPath(value)
      if (path && API_BASE) {
        try {
          await fetch(API_BASE, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path, bucket: "media" }),
            credentials: "include",
          }).catch(() => {})
        } catch {}
      }
      onChange(null)
      toast.success("Image removed")
    }
  }

  return (
    <div className={cn("w-full", className)}>
      {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}

      <div
        className={cn(
          "relative border-2 border-dashed border-slate-200 rounded-xl overflow-hidden bg-slate-50",
          aspectClasses[aspectRatio]
        )}
      >
        {value ? (
          <>
            <Image
              src={value}
              alt="Uploaded"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors group">
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-8 w-8 rounded-full bg-white shadow grid place-items-center text-slate-700 hover:bg-slate-100"
                  title="Replace image"
                >
                  <Upload size={14} />
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="h-8 w-8 rounded-full bg-white shadow grid place-items-center text-red-600 hover:bg-red-50"
                  title="Remove image"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {uploading ? (
              <>
                <Loader2 size={32} className="animate-spin mb-2" />
                <p className="text-sm font-medium">Uploading... {progress}%</p>
              </>
            ) : (
              <>
                <ImageIcon size={32} className="mb-2" />
                <p className="text-sm font-medium">Click to upload</p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPEG, WebP, GIF, SVG • Max 10MB</p>
              </>
            )}
          </button>
        )}

        {uploading && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200">
            <div className="h-full bg-[#0B1D3A] transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />

      {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
    </div>
  )
}