-- Add mood analysis fields to journal_entries table
ALTER TABLE journal_entries 
ADD COLUMN IF NOT EXISTS mood_confidence DECIMAL(3,2),
ADD COLUMN IF NOT EXISTS mood_keywords TEXT[],
ADD COLUMN IF NOT EXISTS mood_summary TEXT;

-- Add constraint for confidence value
ALTER TABLE journal_entries 
ADD CONSTRAINT journal_entries_mood_confidence_range 
CHECK (mood_confidence IS NULL OR (mood_confidence >= 0 AND mood_confidence <= 1));

-- Add index for mood confidence for better querying
CREATE INDEX IF NOT EXISTS journal_entries_mood_confidence_idx ON journal_entries(mood_confidence);

-- Add GIN index for mood_keywords array for better search performance
CREATE INDEX IF NOT EXISTS journal_entries_mood_keywords_gin_idx ON journal_entries USING GIN(mood_keywords); 