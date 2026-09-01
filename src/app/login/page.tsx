"use client"
import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

function LoginForm() {
  const [email, setEmail] = useState("admin@unitedsports.com")
  const [password, setPassword] = useState("Admin@2026")
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) {
      setErr("Supabase not configured")
      return
    }
    setLoading(true)
    setErr("")
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setErr(error.message)
      setLoading(false)
      return
    }
    router.push(searchParams.get("redirect") || "/admin")
    router.refresh()
  }

  return (
    <form onSubmit={handleLogin} className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6">
      <div className="text-center">
        <div className="mx-auto h-14 w-14 rounded-2xl bg-[#0B1D3A] flex items-center justify-center text-white font-bold text-2xl mb-3">
          U
        </div>
        <h1 className="text-2xl font-bold text-slate-900">United Sports Admin</h1>
        <p className="text-sm text-slate-500 mt-1">Sign in to manage your website content</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0B1D3A]/20 focus:border-[#0B1D3A]"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0B1D3A]/20 focus:border-[#0B1D3A]"
          />
        </div>
      </div>
      {err && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">{err}</p>}
      <Button type="submit" disabled={loading} className="w-full h-11">
        {loading ? "Signing in..." : "Sign In"}
      </Button>
      <div className="bg-slate-50 rounded-xl p-4 text-xs space-y-2">
        <p className="font-semibold text-slate-900">Demo Accounts:</p>
        <div className="space-y-1.5 text-slate-600">
          <p><span className="font-medium text-slate-900">Super Admin:</span> admin@unitedsports.com / Admin@2026</p>
          <p><span className="font-medium text-slate-900">Admin:</span> admin@demo.hirekaro.com / Demo@1234</p>
          <p><span className="font-medium text-slate-900">Editor:</span> employer@demo.hirekaro.com / Demo@1234</p>
        </div>
      </div>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B1D3A] via-[#0B1D3A] to-[#1a3a6b] p-4">
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}