-- Tabela para armazenar logs das execuções do keep-alive
CREATE TABLE IF NOT EXISTS ping_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  status TEXT NOT NULL CHECK (status IN ('success', 'error')),
  response_time INTEGER,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para melhorar performance nas consultas
CREATE INDEX idx_ping_logs_created_at ON ping_logs(created_at DESC);
CREATE INDEX idx_ping_logs_status ON ping_logs(status);

-- RLS Policies (apenas admins podem visualizar)
ALTER TABLE ping_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view ping logs"
  ON ping_logs
  FOR SELECT
  TO authenticated
  USING (is_admin_user(auth.uid()));

-- Política para a edge function inserir logs (usando service role)
CREATE POLICY "Service role can insert ping logs"
  ON ping_logs
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Função para limpar logs antigos (manter apenas últimos 30 dias)
CREATE OR REPLACE FUNCTION cleanup_old_ping_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  DELETE FROM ping_logs
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$;