import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Leaf, Users, Shield, BarChart3, Heart } from "lucide-react";

export const MethodologySection = () => {
  const pillars = [
    {
      icon: Leaf,
      title: "Práticas Ambientais",
      description: "Metas claras de sustentabilidade e redução de emissões.",
      color: "text-green-600"
    },
    {
      icon: Users,
      title: "Responsabilidade Social",
      description: "Compromisso com a diversidade, inclusão e a comunidade.",
      color: "text-blue-600"
    },
    {
      icon: Shield,
      title: "Governança Corporativa",
      description: "Ética, transparência e gestão de riscos.",
      color: "text-purple-600"
    },
    {
      icon: BarChart3,
      title: "Métricas Verificáveis",
      description: "KPIs auditáveis e dados que comprovam o desempenho.",
      color: "text-orange-600"
    },
    {
      icon: Heart,
      title: "Impacto Real",
      description: "Histórias de sucesso e estudos de caso que demonstram a transformação.",
      color: "text-red-600"
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Como Funciona
          </h2>
          <p className="text-2xl font-semibold text-accent mb-4">
            Nossa Metodologia
          </p>
          <h3 className="text-xl font-bold text-foreground mb-6">
            Transparência e Rigor em Cada Etapa
          </h3>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-4">
            Nossa plataforma será um ecossistema de confiança que avaliará cada projeto com base em 5 pilares essenciais de ESG:
          </p>
          <div className="bg-accent/10 rounded-xl p-4 max-w-2xl mx-auto">
            <p className="text-accent font-semibold text-sm">
              ✨ Framework em desenvolvimento - Seja o primeiro a experimentar quando lançarmos!
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <Card 
                key={index} 
                className="bg-card hover:shadow-accent transition-all duration-500 group animate-slide-up border-2 hover:border-accent/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 bg-gradient-sustainability rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {pillar.title}
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-center">
                    {pillar.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 bg-gradient-trust rounded-3xl p-12 text-center animate-fade-in">
          <h3 className="text-2xl font-bold text-foreground mb-8">
            Nossos Diferenciais de Confiança
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-foreground">Auditoria Independente</h4>
              <p className="text-muted-foreground text-sm">
                Todos os dados são verificados por terceiros certificados
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-foreground">Relatórios em Tempo Real</h4>
              <p className="text-muted-foreground text-sm">
                Acompanhe o progresso dos projetos com dashboards atualizados
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-foreground">Comunidade Verificada</h4>
              <p className="text-muted-foreground text-sm">
                Rede curada de empreendedores e investidores qualificados
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};