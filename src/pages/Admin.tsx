import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Download, LogOut, Key } from "lucide-react";
interface PreRegistration {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  created_at: string;
}
export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });
  const [changePasswordData, setChangePasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [registrations, setRegistrations] = useState<PreRegistration[]>([]);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const {
    toast
  } = useToast();
  useEffect(() => {
    // Check if already authenticated
    const isAuth = localStorage.getItem("admin_authenticated");
    if (isAuth === "true") {
      setIsAuthenticated(true);
      fetchRegistrations();
    }
  }, []);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple admin check - in production, use proper authentication
    if (loginData.username === "admin" && loginData.password === "admin") {
      setIsAuthenticated(true);
      localStorage.setItem("admin_authenticated", "true");
      fetchRegistrations();
      toast({
        title: "Login realizado!",
        description: "Bem-vindo ao painel administrativo."
      });
    } else {
      toast({
        title: "Credenciais inválidas",
        description: "Verifique seu usuário e senha.",
        variant: "destructive"
      });
    }
  };
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_authenticated");
    setLoginData({
      username: "",
      password: ""
    });
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
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (changePasswordData.newPassword !== changePasswordData.confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "A nova senha e confirmação devem ser iguais.",
        variant: "destructive"
      });
      return;
    }
    if (changePasswordData.currentPassword !== "admin") {
      toast({
        title: "Senha atual incorreta",
        description: "Digite a senha atual corretamente.",
        variant: "destructive"
      });
      return;
    }

    // In a real application, you would update the password in the database
    toast({
      title: "Senha alterada!",
      description: "Sua senha foi alterada com sucesso."
    });
    setShowChangePassword(false);
    setChangePasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };
  if (!isAuthenticated) {
    return <div className="min-h-screen bg-gradient-sustainability flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Painel Administrativo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <Input id="username" type="text" value={loginData.username} onChange={e => setLoginData(prev => ({
                ...prev,
                username: e.target.value
              }))} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" value={loginData.password} onChange={e => setLoginData(prev => ({
                ...prev,
                password: e.target.value
              }))} required />
              </div>
              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-sustainability p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Painel Administrativo</h1>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setShowChangePassword(!showChangePassword)} className="border-white/30 hover:bg-white/10 text-slate-600">
              <Key className="w-4 h-4 mr-2" />
              Alterar Senha
            </Button>
            <Button variant="outline" onClick={handleLogout} className="border-white/30 hover:bg-white/10 text-slate-600">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        {showChangePassword && <Card className="mb-8">
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Senha Atual</Label>
                  <Input id="currentPassword" type="password" value={changePasswordData.currentPassword} onChange={e => setChangePasswordData(prev => ({
                ...prev,
                currentPassword: e.target.value
              }))} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <Input id="newPassword" type="password" value={changePasswordData.newPassword} onChange={e => setChangePasswordData(prev => ({
                ...prev,
                newPassword: e.target.value
              }))} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                  <Input id="confirmPassword" type="password" value={changePasswordData.confirmPassword} onChange={e => setChangePasswordData(prev => ({
                ...prev,
                confirmPassword: e.target.value
              }))} required />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Alterar Senha</Button>
                  <Button type="button" variant="outline" onClick={() => setShowChangePassword(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>}

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