"use client"
import { useState, useRef } from "react"
import Image from "next/image"
import { Upload, X, Loader2, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { uploadMedia, deleteMedia } from "@/lib/cms/data"
import { toast } from "@/components/ui/toast"

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
      // Simulated progress (Supabase doesn't provide upload progress easily)
      const progressInterval = setInterval(() => {
        setProgress((p) => Math.min(p + 10, 90))
      }, 100)

      const result = await uploadMedia(file, folder)
      clearInterval(progressInterval)
      setProgress(100)

      if (result.error) {
        toast.error(result.error)
      } else if (result.url) {
        // If there was a previous image, delete it
        if (value && !value.startsWith("http")) {
          await deleteMedia(value).catch(() => {})
        }
        onChange(result.url)
        toast.success("Image uploaded successfully")
      }
    } catch (err) {
      toast.error("Failed to upload image")
    } finally {
      setUploading(false)
      setProgress(0)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  async function handleRemove() {
    if (value) {
      // Only attempt to delete if it's from our storage
      if (value.includes("/storage/v1/object/public/media/")) {
        await deleteMedia(value).catch(() => {})
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