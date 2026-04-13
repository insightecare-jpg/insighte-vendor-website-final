-- ============================================================
-- Migration: Delayed Deletion (30-Day Grace Period)
-- Implements the safety protocol for hard deletions.
-- ============================================================

ALTER TABLE partners ADD COLUMN IF NOT EXISTS deletion_requested_at TIMESTAMP WITH TIME ZONE;

-- Add a comment explaining the institutional protocol
COMMENT ON COLUMN partners.deletion_requested_at IS 'Institutional grace period start. Permanent purge scheduled for T+30 days.';
