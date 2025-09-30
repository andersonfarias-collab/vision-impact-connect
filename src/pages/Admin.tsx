import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Download, LogOut, Activity } from "lucide-react";

interface PreRegistration {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  created_at: string;
}

interface PingLog {
  id: string;
  status: 'success' | 'error';
  response_time: number | null;
  error_message: string | null;
  created_at: string;
}

interface KeepAliveStatus {
  loading: boolean;
  success?: boolean;
  error?: string;
  data?: {
    responseTime: number;
  };
}

export default function Admin() {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const [registrations, setRegistrations] = useState<PreRegistration[]>([]);
  const [pingLogs, setPingLogs] = useState<PingLog[]>([]);
  const [keepAliveStatus, setKeepAliveStatus] = useState<KeepAliveStatus | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Redirect to auth page if not authenticated or not admin
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/auth');
      return;
    }
    
    // Fetch registrations if user is authenticated admin
    if (user && isAdmin) {
      fetchRegistrations();
      fetchPingLogs();
    }
  }, [user, isAdmin, isLoading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('pre_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRegistrations(data || []);
    } catch (error) {
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os pré-cadastros.",
        variant: "destructive"
      });
    }
  };

  const fetchPingLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('ping_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      setPingLogs((data || []) as PingLog[]);
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
    }
  };

  const testKeepAlive = async () => {
    setKeepAliveStatus({ loading: true });
    
    try {
      const { data, error } = await supabase.functions.invoke('ping-keep-alive');
      
      if (error) throw error;
      
      setKeepAliveStatus({
        loading: false,
        success: true,
        data: {
          responseTime: data.responseTime
        }
      });
      
      toast({
        title: "✅ Teste bem-sucedido!",
        description: `Keep-alive executado em ${data.responseTime}ms`,
      });
      
      // Atualizar logs
      fetchPingLogs();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setKeepAliveStatus({
        loading: false,
        success: false,
        error: errorMessage
      });
      
      toast({
        title: "Erro no teste",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const exportToCSV = () => {
    const headers = ['Nome', 'Email', 'Telefone', 'Tipo', 'Data de Cadastro'];
    const csvContent = [
      headers.join(','),
      ...registrations.map(reg => [
        `"${reg.name}"`,
        `"${reg.email}"`,
        `"${reg.phone}"`,
        `"${reg.role === 'entrepreneur' ? 'Empreendedor' : 'Financiador/Investidor'}"`,
        `"${new Date(reg.created_at).toLocaleDateString('pt-BR')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pre-cadastros-4visionesg-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-sustainability flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-sustainability p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Painel Administrativo</h1>
          <div className="flex gap-4 items-center">
            <span className="text-white/80">Bem-vindo, {user.email}</span>
            <Button 
              variant="outline" 
              onClick={handleLogout} 
              className="border-white/30 hover:bg-white/10 text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        <Tabs defaultValue="registrations" className="space-y-6">
          <TabsList className="bg-white/10 backdrop-blur-sm">
            <TabsTrigger 
              value="registrations" 
              className="data-[state=active]:bg-white data-[state=active]:text-primary"
            >
              Pré-cadastros
            </TabsTrigger>
            <TabsTrigger 
              value="keepalive" 
              className="data-[state=active]:bg-white data-[state=active]:text-primary"
            >
              <Activity className="w-4 h-4 mr-2" />
              Keep-Alive
            </TabsTrigger>
          </TabsList>

          <TabsContent value="registrations">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Pré-cadastros ({registrations.length})</CardTitle>
                  <Button onClick={exportToCSV} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {registrations.map(registration => (
                        <TableRow key={registration.id}>
                          <TableCell className="font-medium">{registration.name}</TableCell>
                          <TableCell>{registration.email}</TableCell>
                          <TableCell>{registration.phone}</TableCell>
                          <TableCell>
                            {registration.role === 'entrepreneur' ? 'Empreendedor' : 'Financiador/Investidor'}
                          </TableCell>
                          <TableCell>
                            {new Date(registration.created_at).toLocaleDateString('pt-BR')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {registrations.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      Nenhum pré-cadastro encontrado.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="keepalive" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white">Sistema Keep-Alive</h3>
              <p className="text-sm text-white/70">
                Monitore o status do sistema de keep-alive que mantém o projeto Supabase ativo.
                O sistema executa automaticamente a cada 12 horas (00:00 e 12:00 UTC).
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                    Status do Keep-Alive
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={testKeepAlive} disabled={keepAliveStatus?.loading}>
                    {keepAliveStatus?.loading ? 'Testando...' : 'Testar Keep-Alive'}
                  </Button>
                  
                  {keepAliveStatus && !keepAliveStatus.loading && (
                    <div className={`p-3 rounded-lg ${
                      keepAliveStatus.success 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                      {keepAliveStatus.success ? (
                        <div>
                          <p className="font-medium">✅ Teste bem-sucedido!</p>
                          <p className="text-sm">Tempo: {keepAliveStatus.data?.responseTime}ms</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium">❌ Teste falhou</p>
                          <p className="text-sm">{keepAliveStatus.error}</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Configuração do Cron</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Frequência:</strong> A cada 12 horas</p>
                    <p><strong>Horários:</strong> 00:00 e 12:00 UTC</p>
                    <p><strong>Função:</strong> ping-keep-alive</p>
                    <p><strong>Status:</strong> <span className="text-green-600">Ativo</span></p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Logs Recentes</CardTitle>
                <CardDescription>
                  Últimas 10 execuções do sistema keep-alive
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {pingLogs.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      Nenhum log disponível ainda
                    </p>
                  ) : (
                    pingLogs.map((log) => (
                      <div
                        key={log.id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          log.status === 'success'
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              log.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                            }`}
                          />
                          <div>
                            <p className="font-medium">
                              {log.status === 'success' ? 'Sucesso' : 'Falha'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(log.created_at).toLocaleString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          {log.response_time && (
                            <p className="font-medium">{log.response_time}ms</p>
                          )}
                          {log.error_message && (
                            <p className="text-red-600 text-xs max-w-xs truncate">
                              {log.error_message}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
