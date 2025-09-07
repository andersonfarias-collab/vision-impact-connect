import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle, Mail, User, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const PreRegistrationSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.role) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    toast({
      title: "Cadastro realizado!",
      description: "Você será notificado sobre o lançamento da plataforma.",
      variant: "default"
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <section className="py-24 bg-gradient-sustainability">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl animate-fade-in">
            <CardContent className="p-12">
              <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Bem-vindo à Comunidade 4VisionESG!
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Obrigado por se juntar a nós. Você receberá atualizações exclusivas sobre o lançamento da plataforma.
              </p>
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => setIsSubmitted(false)}
              >
                Cadastrar Outro Usuário
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-sustainability">
      <div className="max-w-4xl mx-auto px-6">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl animate-fade-in">
          <CardHeader className="text-center pb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Seja o Primeiro a Acessar
            </h2>
            <p className="text-2xl font-semibold text-accent mb-4">
              O Futuro ESG Começa Agora
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Deixe seu e-mail e seja notificado em primeira mão sobre o lançamento da plataforma. 
              Junte-se à comunidade que está construindo o amanhã.
            </p>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nome Completo
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="h-12 text-base"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    E-mail de Contato
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="h-12 text-base"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Eu sou:
                </Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Selecione sua categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrepreneur">Empreendedor</SelectItem>
                    <SelectItem value="investor">Financiador/Investidor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  variant="cta" 
                  size="lg" 
                  className="w-full h-14 text-xl"
                >
                  QUERO FAZER PARTE
                </Button>
              </div>
              
              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground">
                  Ao se cadastrar, você concorda em receber comunicações sobre a plataforma 4VisionESG.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};