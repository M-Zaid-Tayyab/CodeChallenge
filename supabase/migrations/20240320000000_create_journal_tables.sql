-- Create journal_entries table
CREATE TABLE IF NOT EXISTS journal_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    mood JSONB NOT NULL DEFAULT '{"happiness": 5, "fear": 5, "sadness": 5, "anger": 5, "surprise": 5, "disgust": 5}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create mood_analyses table
CREATE TABLE IF NOT EXISTS mood_analyses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    analysis_result JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security on both tables
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_analyses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for journal_entries
CREATE POLICY "Users can insert their own journal entries"
    ON journal_entries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own journal entries"
    ON journal_entries FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries"
    ON journal_entries FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries"
    ON journal_entries FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for mood_analyses
CREATE POLICY "Users can insert their own mood analyses"
    ON mood_analyses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own mood analyses"
    ON mood_analyses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own mood analyses"
    ON mood_analyses FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mood analyses"
    ON mood_analyses FOR DELETE
    USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS journal_entries_user_id_idx ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS journal_entries_created_at_idx ON journal_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS journal_entries_text_gin_idx ON journal_entries USING gin(to_tsvector('english', text));

CREATE INDEX IF NOT EXISTS mood_analyses_user_id_idx ON mood_analyses(user_id);
CREATE INDEX IF NOT EXISTS mood_analyses_created_at_idx ON mood_analyses(created_at DESC);

-- Create function to automatically update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic updated_at updates
CREATE TRIGGER update_journal_entries_updated_at
    BEFORE UPDATE ON journal_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mood_analyses_updated_at
    BEFORE UPDATE ON mood_analyses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add constraints for data integrity
ALTER TABLE journal_entries 
ADD CONSTRAINT journal_entries_text_not_empty 
CHECK (length(trim(text)) > 0);

ALTER TABLE mood_analyses 
ADD CONSTRAINT mood_analyses_text_not_empty 
CHECK (length(trim(text)) > 0);

-- Add constraint to ensure mood JSON has required structure
ALTER TABLE journal_entries 
ADD CONSTRAINT journal_entries_mood_structure 
CHECK (
    mood ? 'happiness' AND 
    mood ? 'fear' AND 
    mood ? 'sadness' AND 
    mood ? 'anger' AND 
    mood ? 'surprise' AND 
    mood ? 'disgust'
);

-- Add constraint to ensure mood values are between 0 and 10
ALTER TABLE journal_entries 
ADD CONSTRAINT journal_entries_mood_values 
CHECK (
    (mood->>'happiness')::numeric BETWEEN 0 AND 10 AND
    (mood->>'fear')::numeric BETWEEN 0 AND 10 AND
    (mood->>'sadness')::numeric BETWEEN 0 AND 10 AND
    (mood->>'anger')::numeric BETWEEN 0 AND 10 AND
    (mood->>'surprise')::numeric BETWEEN 0 AND 10 AND
    (mood->>'disgust')::numeric BETWEEN 0 AND 10
); 