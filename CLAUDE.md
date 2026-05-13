# 친사's Blog 프로젝트

## 프로젝트 개요
- Next.js 16 기반 개인 블로그
- 도메인: kssarng.org
- 배포: Vercel
- 코드 저장: GitHub (dk64839701/my-blog)

## 기술 스택
- Frontend: Next.js 16, Tailwind CSS, TypeScript
- Database: Supabase (PostgreSQL)
- 이미지/음악 저장: Cloudinary
- 폰트: Noto Sans KR

## 주요 페이지
- `/` : 홈페이지 (주제 카드 + 최근 글)
- `/blog` : 블로그 글 목록 (카테고리 필터)
- `/blog/[slug]` : 블로그 글 상세
- `/about` : 소개 페이지
- `/admin` : 관리자 메인 (글 목록, 작성/수정/삭제)
- `/admin/write` : 글 작성
- `/admin/edit` : 글 수정

## 블로그 카테고리
- 일상, 여행, 한국 & 아제르바이잔, 컴퓨터, 신과 자연

## 데이터베이스 (Supabase)
- 테이블: posts (id, slug, title, date, category, description, content, created_at)
- RLS 활성화, 읽기는 누구나 가능
- 쓰기는 service_role 키로만 가능

## 파일 구조
- `app/` : Next.js 페이지 및 API
- `app/api/posts/` : 글 CRUD API
- `app/api/upload/` : Cloudinary 이미지 업로드 API
- `app/admin/` : 관리자 페이지
- `lib/posts.ts` : Supabase 글 읽기/쓰기 함수
- `lib/supabase.ts` : Supabase 클라이언트
- `app/components/MusicPlayer.tsx` : 음악 플레이어

## 관리자 인증
- 현재: `.env.local` 의 `ADMIN_PASSWORD` 로 비밀번호 확인
- 앞으로: Supabase Auth 로 이메일 로그인 방식으로 변경 예정
- 관리자 이메일 2개로 운영 예정

## 환경변수 (.env.local)
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- ADMIN_PASSWORD
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

## 배포 방법
- GitHub 에 push 하면 Vercel 에서 자동 배포
- `git add . && git commit -m "설명" && git push`

## 현재 진행 중인 작업
- Supabase Auth 를 이용한 관리자 로그인 구현
- 관리자 2명 (이메일 2개) 설정