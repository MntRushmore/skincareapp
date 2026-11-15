-- Schema for every table the API reads or writes.
-- Safe to run more than once.
--
-- auth_* columns match the Auth.js adapter in apps/web/src/auth.js
-- (quoted camelCase). App tables store user_id as text because the mobile
-- JWT subject and several queries pass the id as a string. auth_users.id
-- itself is an integer serial; delete-account casts it with parseInt.

CREATE TABLE IF NOT EXISTS auth_users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT,
  "emailVerified" TIMESTAMPTZ,
  image TEXT,
  stripe_id TEXT,
  subscription_status TEXT,
  last_check_subscription_status_at TIMESTAMPTZ
);

ALTER TABLE auth_users ADD COLUMN IF NOT EXISTS stripe_id TEXT;
ALTER TABLE auth_users ADD COLUMN IF NOT EXISTS subscription_status TEXT;
ALTER TABLE auth_users ADD COLUMN IF NOT EXISTS last_check_subscription_status_at TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS auth_users_email_lower_idx
  ON auth_users (LOWER(email));

CREATE TABLE IF NOT EXISTS auth_accounts (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES auth_users (id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  password TEXT
);

CREATE INDEX IF NOT EXISTS auth_accounts_user_id_idx ON auth_accounts ("userId");

CREATE TABLE IF NOT EXISTS auth_sessions (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES auth_users (id) ON DELETE CASCADE,
  expires TIMESTAMPTZ NOT NULL,
  "sessionToken" TEXT NOT NULL UNIQUE
);

CREATE INDEX IF NOT EXISTS auth_sessions_user_id_idx ON auth_sessions ("userId");

CREATE TABLE IF NOT EXISTS auth_verification_token (
  identifier TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  token TEXT NOT NULL,
  PRIMARY KEY (identifier, token)
);

CREATE TABLE IF NOT EXISTS user_profiles (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  full_name TEXT,
  profile_photo_url TEXT,
  skin_type TEXT,
  skin_concerns TEXT[] NOT NULL DEFAULT '{}',
  age_range TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_preferences (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  newsletter_subscribed BOOLEAN NOT NULL DEFAULT FALSE,
  theme TEXT NOT NULL DEFAULT 'light',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skin_scans (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  photo_url TEXT,
  skin_type TEXT,
  texture_analysis JSONB,
  concerns JSONB,
  recommendations JSONB,
  confidence_score NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS skin_scans_user_created_idx
  ON skin_scans (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS user_scan_usage (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  month_year TEXT NOT NULL,
  scan_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, month_year)
);
