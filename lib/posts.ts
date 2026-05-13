import { supabase, supabaseAdmin, Post } from './supabase';

export async function getAllPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('글 목록 가져오기 실패:', error);
    return [];
  }

  return data || [];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('글 가져오기 실패:', error);
    return null;
  }

  return data;
}

export async function savePost(post: Omit<Post, 'id' | 'created_at'>, password: string): Promise<{ success: boolean; error?: string }> {
  if (password !== process.env.ADMIN_PASSWORD) {
    return { success: false, error: '비밀번호가 틀렸습니다' };
  }

  const { error } = await supabaseAdmin
    .from('posts')
    .upsert(post, { onConflict: 'slug' });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}