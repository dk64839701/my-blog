import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';
import { verifySession, SESSION_COOKIE } from '@/lib/auth';

async function requireAdmin(): Promise<string | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(SESSION_COOKIE)?.value;
  if (!value) return null;
  return verifySession(value);
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('posts')
      .select('slug, title, date, category')
      .order('date', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('글 목록 가져오기 실패:', error);
    return NextResponse.json({ error: '글 목록 가져오기 실패' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const email = await requireAdmin();
    if (!email) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
    }

    const { title, date, category, description, content, slug } = await request.json();

    if (!title || !date || !category || !content || !slug) {
      return NextResponse.json({ error: '필수 입력값이 없습니다' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('posts')
      .upsert(
        { slug, title, date, category, description: description || '', content },
        { onConflict: 'slug' }
      );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('저장 실패:', error);
    return NextResponse.json({ error: '저장 실패' }, { status: 500 });
  }
}
