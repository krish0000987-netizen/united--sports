import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml']
const MAX_BYTES = 10 * 1024 * 1024 // 10MB

export async function POST(req: NextRequest) {
  try {
    // Must be a signed-in admin (RLS also enforces this in the storage policies)
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_active')
      .eq('user_id', user.id)
      .maybeSingle()
    if (!profile?.is_active) {
      return NextResponse.json({ error: 'Account inactive' }, { status: 403 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const bucket = (formData.get('bucket') as string) || 'media'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: `Unsupported file type "${file.type}". Allowed: PNG, JPEG, GIF, WebP, SVG` }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
    }

    // Folder prefixes keep the bucket organised: media/ is the root; requests
    // like "articles" become articles/<file>. Sanitise to avoid traversal.
    const folder = bucket.replace(/[^a-z0-9_-]/gi, '').slice(0, 40) || 'uploads'
    const ext = file.name.split('.').pop()?.replace(/[^a-z0-9]/gi, '') || 'bin'
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const { data, error } = await supabase.storage.from('media').upload(filename, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    })
    if (error) {
      console.error('[api/upload] storage error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data: urlData } = supabase.storage.from('media').getPublicUrl(data.path)
    return NextResponse.json({ url: urlData.publicUrl, path: data.path })
  } catch (err) {
    console.error('[api/upload] unexpected error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { path } = body as { path?: string }
    if (!path) {
      return NextResponse.json({ error: 'No path provided' }, { status: 400 })
    }

    const { error } = await supabase.storage.from('media').remove([path])
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[api/upload] delete error:', err)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
