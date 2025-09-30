import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  
  try {
    console.log('🔄 Iniciando ping keep-alive...');

    // Criar cliente Supabase com service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fazer uma query simples para manter o banco ativo
    const { data: profilesCount, error: queryError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true });

    if (queryError) {
      throw queryError;
    }

    const responseTime = Date.now() - startTime;
    
    console.log(`✅ Ping bem-sucedido! Tempo: ${responseTime}ms`);

    // Registrar log de sucesso
    const { error: logError } = await supabase
      .from('ping_logs')
      .insert({
        status: 'success',
        response_time: responseTime,
        metadata: {
          timestamp: new Date().toISOString(),
          profiles_count: profilesCount,
        }
      });

    if (logError) {
      console.error('Erro ao salvar log:', logError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Keep-alive executado com sucesso',
        responseTime,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    const responseTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    
    console.error('❌ Erro no ping keep-alive:', errorMessage);

    // Tentar registrar log de erro
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      await supabase.from('ping_logs').insert({
        status: 'error',
        response_time: responseTime,
        error_message: errorMessage,
        metadata: { timestamp: new Date().toISOString() }
      });
    } catch (logError) {
      console.error('Erro ao salvar log de erro:', logError);
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        responseTime,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
