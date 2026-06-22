import { getAllPosts } from '@/lib/posts';
import TopicCarousel from '@/app/components/TopicCarousel';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const allPosts = await getAllPosts();
  const recentPosts = allPosts.slice(0, 3);

  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <section className="mb-16">
        <TopicCarousel />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-2" style={{color: '#1e3a8a'}}>최근 글</h2>
        <div className="w-12 h-1 mb-6" style={{backgroundColor: '#2563eb'}}></div>
        <ul className="space-y-6">
          {recentPosts.map((post) => (
            <li key={post.slug} className="p-6 rounded-xl shadow-sm" style={{border: '1px solid #e5e7eb'}}>
              <p className="text-sm mb-1" style={{color: '#9ca3af'}}>{post.date}</p>
              <h3 className="text-xl font-semibold mb-2">
                <a href={`/blog/${post.slug}`} style={{color: '#2563eb'}}>
                  {post.title}
                </a>
              </h3>
              <p style={{color: '#4b5563'}}>{post.description}</p>
              <div className="mt-3">
                <a href={`/blog/${post.slug}`} className="text-sm font-semibold" style={{color: '#2563eb'}}>
                  더 읽기 →
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}