import { getAllPosts } from '@/lib/posts';
import BlogList from './BlogList';

export const dynamic = 'force-dynamic';

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const posts = await getAllPosts();
  const { category } = await searchParams;
  return <BlogList posts={posts} initialCategory={category} />;
}