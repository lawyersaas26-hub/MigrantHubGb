-- FIX: Add unique constraint to user_subscriptions table
-- PLEASE COPY ALL LINES INCLUDING THIS ONE

-- 1. Remove duplicate subscriptions (keep most recent)
DELETE FROM user_subscriptions a USING (
      SELECT MAX(updated_at) as max_updated, user_id
      FROM user_subscriptions 
      GROUP BY user_id HAVING COUNT(*) > 1
      ) b
      WHERE a.user_id = b.user_id 
      AND a.updated_at < b.max_updated;

-- 2. Add the UNIQUE constraint
ALTER TABLE user_subscriptions
ADD CONSTRAINT user_subscriptions_user_id_key UNIQUE (user_id);
