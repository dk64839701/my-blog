import { getAllPosts } from '@/lib/posts';
import BlogList from './BlogList';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const posts = await getAllPosts();
  return <BlogList posts={posts} />;
}