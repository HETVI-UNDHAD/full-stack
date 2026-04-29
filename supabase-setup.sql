-- ============================================
-- COLLEGE DISCOVERY PLATFORM - SUPABASE SETUP
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. COLLEGES TABLE
create table if not exists colleges (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text not null,
  fees integer not null,
  rating numeric(3,1) default 0,
  placement_percentage integer default 0,
  description text,
  created_at timestamptz default now()
);

-- 2. COURSES TABLE
create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  college_id uuid references colleges(id) on delete cascade,
  course_name text not null,
  duration text not null,
  created_at timestamptz default now()
);

-- 3. SAVED COLLEGES TABLE
create table if not exists saved_colleges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  college_id uuid references colleges(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, college_id)
);

-- 4. ROW LEVEL SECURITY
alter table colleges enable row level security;
alter table courses enable row level security;
alter table saved_colleges enable row level security;

-- Public read for colleges and courses
create policy "Public read colleges" on colleges for select using (true);
create policy "Public read courses" on courses for select using (true);

-- Authenticated users manage their saved colleges
create policy "Users manage saved" on saved_colleges
  for all using (auth.uid() = user_id);

-- ============================================
-- SEED DATA (10 sample colleges)
-- ============================================
insert into colleges (name, location, fees, rating, placement_percentage, description) values
('Indian Institute of Technology Bombay', 'Mumbai, Maharashtra', 250000, 4.9, 98, 'IIT Bombay is one of the premier engineering institutions in India, known for its world-class research facilities and outstanding placement record.'),
('Indian Institute of Technology Delhi', 'New Delhi, Delhi', 240000, 4.8, 97, 'IIT Delhi offers cutting-edge programs in engineering and technology with a strong focus on innovation and entrepreneurship.'),
('BITS Pilani', 'Pilani, Rajasthan', 450000, 4.7, 95, 'BITS Pilani is a deemed university known for its practice school program and strong industry connections.'),
('National Institute of Technology Trichy', 'Tiruchirappalli, Tamil Nadu', 150000, 4.5, 92, 'NIT Trichy is one of the top NITs in India with excellent academic programs and placement opportunities.'),
('Vellore Institute of Technology', 'Vellore, Tamil Nadu', 200000, 4.3, 88, 'VIT is a private university known for its diverse student community and strong placement cell.'),
('Manipal Institute of Technology', 'Manipal, Karnataka', 350000, 4.2, 85, 'MIT Manipal offers a wide range of engineering programs with state-of-the-art infrastructure.'),
('SRM Institute of Science and Technology', 'Chennai, Tamil Nadu', 280000, 4.0, 82, 'SRM is a leading private university with strong industry partnerships and modern facilities.'),
('Amity University', 'Noida, Uttar Pradesh', 320000, 3.9, 80, 'Amity University offers diverse programs across engineering, management, and liberal arts.'),
('Lovely Professional University', 'Phagwara, Punjab', 180000, 3.8, 78, 'LPU is one of the largest private universities in India with a vibrant campus life.'),
('Chandigarh University', 'Chandigarh, Punjab', 160000, 4.1, 86, 'Chandigarh University is a NAAC A+ accredited university known for its placement record and modern curriculum.');

-- Seed courses
insert into courses (college_id, course_name, duration)
select id, 'B.Tech Computer Science', '4 Years' from colleges where name = 'Indian Institute of Technology Bombay'
union all
select id, 'B.Tech Electrical Engineering', '4 Years' from colleges where name = 'Indian Institute of Technology Bombay'
union all
select id, 'M.Tech Data Science', '2 Years' from colleges where name = 'Indian Institute of Technology Bombay'
union all
select id, 'B.Tech Computer Science', '4 Years' from colleges where name = 'Indian Institute of Technology Delhi'
union all
select id, 'B.Tech Mechanical Engineering', '4 Years' from colleges where name = 'Indian Institute of Technology Delhi'
union all
select id, 'B.E. Computer Science', '4 Years' from colleges where name = 'BITS Pilani'
union all
select id, 'B.E. Electronics', '4 Years' from colleges where name = 'BITS Pilani'
union all
select id, 'M.E. Software Systems', '2 Years' from colleges where name = 'BITS Pilani'
union all
select id, 'B.Tech CSE', '4 Years' from colleges where name = 'National Institute of Technology Trichy'
union all
select id, 'B.Tech Civil Engineering', '4 Years' from colleges where name = 'National Institute of Technology Trichy'
union all
select id, 'B.Tech CSE', '4 Years' from colleges where name = 'Vellore Institute of Technology'
union all
select id, 'B.Tech AI & ML', '4 Years' from colleges where name = 'Vellore Institute of Technology'
union all
select id, 'MBA', '2 Years' from colleges where name = 'Vellore Institute of Technology';
