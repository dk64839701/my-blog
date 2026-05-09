import { getAllPosts } from '@/lib/posts';
import BlogList from './BlogList';

export default function BlogPage() {
  const posts = getAllPosts();
  return <BlogList posts={posts} />;
}