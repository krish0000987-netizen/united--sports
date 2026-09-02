import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, subject, message } = body as {
      name?: string
      email?: string
      phone?: string
      subject?: string
      message?: string
    }

    const errors: string[] = []
    if (!name || !name.trim()) errors.push('Name is required')
    if (!email || !EMAIL_RE.test(email)) errors.push('A valid email is required')
    if (!message || !message.trim()) errors.push('Message is required')
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join('. ') }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('enquiries')
      .insert({
        name: name!.trim(),
        email: email!.trim(),
        phone: phone?.trim() || null,
        subject: subject?.trim() || null,
        message: message!.trim(),
        status: 'new',
      })
      .select()
      .single()

    if (error) {
      console.error('[api/enquiries] insert failed:', error.message)
      return NextResponse.json({ error: 'Could not submit your message. Please try again.' }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data.id })
  } catch (err) {
    console.error('[api/enquiries] unexpected error:', err)
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 })
  }
}
