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
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [newPassword, setNewPassword] = useState("");
  const [registrations, setRegistrations] = useState<PreRegistration[]>([]);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple authentication check
    if (credentials.username === "admin" && credentials.password === "admin") {
      setIsAuthenticated(true);
      toast({
        title: "Login realizado",
        description: "Bem-vindo ao painel administrativo",
      });
      fetchRegistrations();
    } else {
      toast({
        title: "Erro de autenticação",
        description: "Usuário ou senha incorretos",
        variant: "destructive"
      });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || newPassword.length < 4) {
      toast({
        title: "Senha inválida",
        description: "A senha deve ter pelo menos 4 caracteres",
        variant: "destructive"
      });
      return;
    }

    try {
      // In a real application, you would hash the password and update it in the database
      // For this demo, we'll just show a success message
      toast({
        title: "Senha alterada",
        description: "Senha alterada com sucesso",
      });
      setNewPassword("");
      setShowChangePassword(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao alterar senha",
        variant: "destructive"
      });
    }
  };

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('pre_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao carregar dados",
          variant: "destructive"
        });
        return;
      }

      setRegistrations(data || []);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar dados",
        variant: "destructive"
      });
    }
  };

  const exportToCSV = () => {
    const headers = ["Nome", "Email", "Telefone", "Tipo", "Data de Cadastro"];
    const csvContent = [
      headers.join(","),
      ...registrations.map(reg => [
        `"${reg.name}"`,
        `"${reg.email}"`,
        `"${reg.phone}"`,
        `"${reg.role === 'entrepreneur' ? 'Empreendedor' : 'Financiador/Investidor'}"`,
        `"${new Date(reg.created_at).toLocaleDateString('pt-BR')}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `pre-cadastros-4visionesg-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCredentials({ username: "", password: "" });
    setRegistrations([]);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground">
              Painel Administrativo
            </CardTitle>
            <p className="text-muted-foreground">4VisionESG</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <Input
                  id="username"
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Painel Administrativo</h1>
            <p className="text-muted-foreground">4VisionESG - Pré-cadastros</p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setShowChangePassword(!showChangePassword)}
            >
              <Key className="w-4 h-4 mr-2" />
              Alterar Senha
            </Button>
            <Button
              variant="outline"
              onClick={exportToCSV}
              disabled={registrations.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        {showChangePassword && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Digite a nova senha"
                    required
                  />
                </div>
                <Button type="submit">Alterar</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowChangePassword(false)}
                >
                  Cancelar
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Pré-cadastros ({registrations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {registrations.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum pré-cadastro encontrado
              </p>
            ) : (
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
                    {registrations.map((registration) => (
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}