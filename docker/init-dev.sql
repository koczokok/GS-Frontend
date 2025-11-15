-- Development database initialization
-- This file runs when the PostgreSQL container starts for the first time

-- Create development database if it doesn't exist
-- (Note: This is handled by POSTGRES_DB environment variable, but we can add additional setup here)

-- You can add any development-specific database setup here
-- For example: creating test data, additional schemas, etc.

-- Example: Create a simple test user (optional)
-- INSERT INTO users (email, provider_id, role_id, is_profile_completed, team)
-- VALUES ('test@example.com', 'test-provider', 1, false, 'development-team')
-- ON CONFLICT DO NOTHING;

