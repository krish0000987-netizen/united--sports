"use client"
import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErr("")

    try {
      // 1. Try local API login (supports both Supabase Auth and Master Admin credentials)
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErr(data.error || "Invalid login credentials. Please check your email and password.")
        setLoading(false)
        return
      }

      // 2. Also authenticate browser Supabase client if possible
      if (supabase) {
        try {
          await supabase.auth.signInWithPassword({ email, password })
        } catch {
          // Ignore browser auth fallback
        }
      }

      const redirectPath = searchParams.get("redirect") || "/admin"
      router.push(redirectPath)
      router.refresh()
    } catch {
      setErr("Failed to connect to login server. Please try again.")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin} className="surface-card w-full max-w-md rounded-sm p-8 space-y-6">
      <div className="text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary font-display text-2xl text-primary-foreground">
          U
        </div>
        <h1 className="mt-4 text-2xl">UnitedAthletes Admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to manage your website content</p>
      </div>
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Email</label>
          <input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            autoComplete="email"
            className="mt-3 w-full rounded-sm border border-input bg-background/60 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Password</label>
          <input
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            autoComplete="current-password"
            className="mt-3 w-full rounded-sm border border-input bg-background/60 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
          />
        </div>
      </div>
      {err && (
        <p className="rounded-sm border border-destructive/40 bg-destructive/10 p-3 text-sm text-red-300">
          {err}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-sm bg-primary px-8 py-4 text-sm font-extrabold uppercase tracking-[0.14em] text-primary-foreground transition-transform duration-300 hover:-translate-y-1 disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
      <Link
        href="/"
        className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to website
      </Link>
    </form>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="grain relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4 pt-24">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/texture-navy.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/95 to-background" />
      <div className="relative">
        <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
