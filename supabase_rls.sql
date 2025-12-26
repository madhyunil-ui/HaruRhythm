-- Enable Row Level Security
ALTER TABLE "logs" ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see their own logs
DROP POLICY IF EXISTS "Users can select their own logs" ON "logs";
CREATE POLICY "Users can select their own logs" ON "logs"
FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own logs
DROP POLICY IF EXISTS "Users can insert their own logs" ON "logs";
CREATE POLICY "Users can insert their own logs" ON "logs"
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own logs
DROP POLICY IF EXISTS "Users can update their own logs" ON "logs";
CREATE POLICY "Users can update their own logs" ON "logs"
FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own logs
DROP POLICY IF EXISTS "Users can delete their own logs" ON "logs";
CREATE POLICY "Users can delete their own logs" ON "logs"
FOR DELETE USING (auth.uid() = user_id);
