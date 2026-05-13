import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { verifySession, SESSION_COOKIE } from '@/lib/auth';

async function requireAdmin(): Promise<string | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(SESSION_COOKIE)?.value;
  if (!value) return null;
  return verifySession(value);
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: '글을 찾을 수 없습니다' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('글 가져오기 실패:', error);
    return NextResponse.json({ error: '글 가져오기 실패' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const email = await requireAdmin();
    if (!email) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
    }

    const { slug } = await params;

    const { error } = await supabaseAdmin
      .from('posts')
      .delete()
      .eq('slug', slug);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('삭제 실패:', error);
    return NextResponse.json({ error: '삭제 실패' }, { status: 500 });
  }
}
