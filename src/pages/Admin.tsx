import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Download, LogOut } from "lucide-react";
interface PreRegistration {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  created_at: string;
}
export default function Admin() {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const [registrations, setRegistrations] = useState<PreRegistration[]>([]);
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
    }
  }, [user, isAdmin, isLoading, navigate]);
  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };
  const fetchRegistrations = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('pre_registrations').select('*').order('created_at', {
        ascending: false
      });
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
  const exportToCSV = () => {
    const headers = ['Nome', 'Email', 'Telefone', 'Tipo', 'Data de Cadastro'];
    const csvContent = [headers.join(','), ...registrations.map(reg => [`"${reg.name}"`, `"${reg.email}"`, `"${reg.phone}"`, `"${reg.role === 'entrepreneur' ? 'Empreendedor' : 'Financiador/Investidor'}"`, `"${new Date(reg.created_at).toLocaleDateString('pt-BR')}"`].join(','))].join('\n');
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });
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
    return null; // Will redirect via useEffect
  }
  return <div className="min-h-screen bg-gradient-sustainability p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Painel Administrativo</h1>
          <div className="flex gap-4">
            <span className="text-white/80">Bem-vindo, {user.email}</span>
            <Button variant="outline" onClick={handleLogout} className="border-white/30 hover:bg-white/10 text-slate-600">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>


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
                  {registrations.map(registration => <TableRow key={registration.id}>
                      <TableCell className="font-medium">{registration.name}</TableCell>
                      <TableCell>{registration.email}</TableCell>
                      <TableCell>{registration.phone}</TableCell>
                      <TableCell>
                        {registration.role === 'entrepreneur' ? 'Empreendedor' : 'Financiador/Investidor'}
                      </TableCell>
                      <TableCell>
                        {new Date(registration.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
              {registrations.length === 0 && <div className="text-center py-8 text-muted-foreground">
                  Nenhum pré-cadastro encontrado.
                </div>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
}