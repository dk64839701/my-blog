import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const postsDir = path.join(process.cwd(), 'posts');
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

console.log(`총 ${files.length}개의 글을 옮깁니다...\n`);

for (const file of files) {
  const slug = file.replace(/\.md$/, '');
  const filePath = path.join(postsDir, file);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  const { error } = await supabase.from('posts').upsert({
    slug,
    title: data.title,
    date: data.date,
    category: data.category,
    description: data.description || '',
    content,
  }, { onConflict: 'slug' });

  if (error) {
    console.log(`❌ ${slug}: ${error.message}`);
  } else {
    console.log(`✅ ${slug}: ${data.title}`);
  }
}

console.log('\n완료!');