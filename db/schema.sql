-- ============================================================
-- 이음푸드시스템 사이트 DB 스키마 (Supabase / PostgreSQL)
-- 작업 순서:
-- 1. Supabase 대시보드 → SQL Editor → 새 쿼리
-- 2. 이 파일 전체 복사 → 붙여넣기 → Run
-- 3. Authentication → Users → admin@eumfood.com 계정 생성 (가족용)
-- ============================================================

-- ============================================================
-- 1. 공지사항 (notice)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notices (
  id          BIGSERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  category    TEXT,                    -- 분류 (예: 일반, 채용, 공지)
  is_pinned   BOOLEAN DEFAULT FALSE,   -- 상단 고정
  view_count  INTEGER DEFAULT 0,
  attachments JSONB,                   -- [{name, url, size}] 첨부파일
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  -- 원본 사이트에서 가져온 데이터의 원래 ID·일자 (마이그레이션 추적용)
  legacy_id   TEXT,
  legacy_date TEXT
);

CREATE INDEX IF NOT EXISTS idx_notices_created  ON public.notices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notices_pinned   ON public.notices(is_pinned DESC, created_at DESC);

-- ============================================================
-- 2. 보도자료 (press)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.press_releases (
  id          BIGSERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  source      TEXT,                    -- 매체명 (예: 매일경제, 식품저널)
  link_url    TEXT,                    -- 원본 기사 URL
  thumbnail   TEXT,                    -- 썸네일 이미지 URL
  view_count  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  legacy_id   TEXT,
  legacy_date TEXT
);

CREATE INDEX IF NOT EXISTS idx_press_created ON public.press_releases(created_at DESC);

-- ============================================================
-- 3. 다운로드 자료실 (download / board)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.downloads (
  id          BIGSERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT,
  category    TEXT,                    -- (예: 회사소개서, 카탈로그, 로고)
  file_url    TEXT NOT NULL,           -- Supabase Storage 또는 외부 URL
  file_size   BIGINT,                  -- bytes
  file_type   TEXT,                    -- mime type 또는 확장자
  download_count INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  legacy_id   TEXT
);

CREATE INDEX IF NOT EXISTS idx_downloads_created ON public.downloads(created_at DESC);

-- ============================================================
-- 4. 1:1 문의 (contact)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.contacts (
  id           BIGSERIAL PRIMARY KEY,
  writer_name  TEXT NOT NULL,
  email        TEXT,
  phone        TEXT,
  subject      TEXT NOT NULL,
  content      TEXT NOT NULL,
  is_private   BOOLEAN DEFAULT TRUE,    -- 비공개 글 여부
  password     TEXT,                    -- 비공개 글 비밀번호 (해시)
  answer       TEXT,                    -- 관리자 답변
  answered_at  TIMESTAMPTZ,
  status       TEXT DEFAULT 'pending',  -- pending / answered
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  legacy_id    TEXT
);

CREATE INDEX IF NOT EXISTS idx_contacts_created ON public.contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_status  ON public.contacts(status);

-- ============================================================
-- 5. 영업 문의 (contact_sales)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.sales_inquiries (
  id           BIGSERIAL PRIMARY KEY,
  company      TEXT NOT NULL,
  position     TEXT,
  writer_name  TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT,
  country      TEXT,
  category     TEXT,                    -- 제품/브랜드, 제휴, 협찬, 기업일반
  content      TEXT NOT NULL,
  attachments  JSONB,                   -- 첨부파일
  privacy_agreed BOOLEAN DEFAULT FALSE,
  status       TEXT DEFAULT 'pending',  -- pending / contacted / closed
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  legacy_id    TEXT
);

CREATE INDEX IF NOT EXISTS idx_sales_created ON public.sales_inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sales_status  ON public.sales_inquiries(status);

-- ============================================================
-- 6. 회사 연혁 (history)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.history_entries (
  id          BIGSERIAL PRIMARY KEY,
  year        INTEGER NOT NULL,
  month       INTEGER,                  -- 1-12, NULL이면 연도만 표시
  title       TEXT NOT NULL,
  description TEXT,
  sort_order  INTEGER DEFAULT 0,        -- 같은 연/월 안 정렬
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_history_year ON public.history_entries(year DESC, month DESC, sort_order);

-- ============================================================
-- updated_at 자동 갱신 trigger
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY['notices','press_releases','downloads','contacts','sales_inquiries']) LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS %I_updated_at ON public.%I;
      CREATE TRIGGER %I_updated_at
        BEFORE UPDATE ON public.%I
        FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
    ', t, t, t, t);
  END LOOP;
END $$;

-- ============================================================
-- Row Level Security (RLS) — 공개 읽기 + 인증 사용자 쓰기
-- ============================================================
ALTER TABLE public.notices         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.press_releases  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.history_entries ENABLE ROW LEVEL SECURITY;

-- 공개 게시판 (notice/press/download/history): 누구나 SELECT 가능
CREATE POLICY "public_read_notices"   ON public.notices         FOR SELECT USING (TRUE);
CREATE POLICY "public_read_press"     ON public.press_releases  FOR SELECT USING (TRUE);
CREATE POLICY "public_read_downloads" ON public.downloads       FOR SELECT USING (TRUE);
CREATE POLICY "public_read_history"   ON public.history_entries FOR SELECT USING (TRUE);

-- 문의 (1:1, 영업): 누구나 INSERT 가능 (사용자가 글 작성), SELECT는 admin만 (기본 거부)
CREATE POLICY "public_insert_contacts"  ON public.contacts        FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "public_insert_sales"     ON public.sales_inquiries FOR INSERT WITH CHECK (TRUE);

-- 인증 사용자(=admin)는 모든 테이블 INSERT/UPDATE/DELETE 가능
CREATE POLICY "auth_all_notices"   ON public.notices         FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_all_press"     ON public.press_releases  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_all_downloads" ON public.downloads       FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_all_contacts"  ON public.contacts        FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_all_sales"     ON public.sales_inquiries FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_all_history"   ON public.history_entries FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- 끝. 이 SQL을 Supabase SQL Editor에서 실행 후:
-- 1. Authentication → Users → "Add user" → admin 이메일/비밀번호 등록
-- 2. Storage → 새 버킷 "attachments" 생성 (public read)
-- ============================================================
