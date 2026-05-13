import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createSession, SESSION_COOKIE, SESSION_DURATION_MS, ADMIN_EMAILS } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!ADMIN_EMAILS.includes(email)) {
      return NextResponse.json({ error: '관리자 계정이 아닙니다' }, { status: 403 });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      return NextResponse.json({ error: '이메일 또는 비밀번호가 틀렸습니다' }, { status: 401 });
    }

    const session = await createSession(email);
    const response = NextResponse.json({ success: true });

    response.cookies.set(SESSION_COOKIE, session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: SESSION_DURATION_MS / 1000,
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('로그인 오류:', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
