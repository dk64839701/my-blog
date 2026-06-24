import Link from 'next/link';
import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import remarkBreaks from 'remark-breaks';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return notFound();

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">

      <div className="mb-3">
        <Link href="/blog" style={{color: '#2563eb', fontSize: '14px'}}>← 블로그 목록으로</Link>
      </div>

      <div className="mb-3">
        <span className="text-xs px-3 py-1 rounded-full" style={{backgroundColor: '#eff6ff', color: '#2563eb'}}>
          {post.category}
        </span>
      </div>

      <p className="text-sm mb-2" style={{color: '#9ca3af'}}>{post.date}</p>
      <h1 className="text-2xl font-bold mb-4" style={{color: '#1e3a8a'}}>{post.title}</h1>

      <div className="w-16 h-1 mb-6" style={{backgroundColor: '#2563eb'}}></div>

      <div className="post-content leading-snug" style={{color: '#374151', fontSize: '16px'}}>
        <MDXRemote
          source={post.content}
          options={{ mdxOptions: { remarkPlugins: [remarkBreaks] } }}
        />
      </div>

      <div className="mt-8 pt-4" style={{borderTop: '1px solid #e5e7eb'}}>
        <Link href="/blog" style={{color: '#2563eb', fontSize: '14px', fontWeight: '600'}}>← 블로그 목록으로</Link>
      </div>

    </main>
  );
}