/*
# Create users table for username-based auth

1. New Tables
- `app_users` - Store user profiles with username
- `id` (uuid, primary key, references auth.users)
- `username` (text, unique)
- `created_at` (timestamp)

2. Security
- Enable RLS on app_users
- Users can only read/write their own data
*/

CREATE TABLE IF NOT EXISTS app_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_read_own" ON app_users;
CREATE POLICY "users_read_own" ON app_users FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "users_insert_own" ON app_users;
CREATE POLICY "users_insert_own" ON app_users FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "users_update_own" ON app_users;
CREATE POLICY "users_update_own" ON app_users FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE INDEX IF NOT EXISTS idx_app_users_username ON app_users(username);