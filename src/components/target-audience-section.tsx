import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TrendingUp, Shield, Users, Target } from "lucide-react";
export const TargetAudienceSection = () => {
  return <section id="target-audience" className="py-24 bg-gradient-trust">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Para Quem é a Plataforma?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Conectamos dois mundos essenciais para o futuro sustentável
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-stretch">
          {/* Para Empreendedores */}
          <Card className="bg-card hover:shadow-green transition-all duration-500 group animate-slide-up">
            <CardHeader className="text-center pb-8">
              <div className="w-20 h-20 bg-gradient-sustainability rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-4">
                Para Empreendedores
              </h3>
              <h4 className="text-xl font-semibold text-accent mb-4">
                Apresente seu Impacto, Atraia o Investimento Certo
              </h4>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground leading-relaxed text-lg">
                Sua dedicação a práticas ambientais, sociais e de governança merece ser vista. Nossa plataforma traduz seu compromisso ESG em uma vitrine poderosa, com métricas claras e dados verificáveis que atraem financiadores sérios e alinhados com sua visão.
              </p>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Valide seu projeto, destaque-se da concorrência e acelere seu crescimento.
              </p>
              
              <div className="flex flex-wrap gap-3 pt-4">
                <div className="flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full">
                  <Target className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">Métricas Verificáveis</span>
                </div>
                <div className="flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full">
                  <Users className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">Rede de Investidores</span>
                </div>
              </div>
              
              
            </CardContent>
          </Card>

          {/* Para Financiadores */}
          <Card className="bg-card hover:shadow-green transition-all duration-500 group animate-slide-up">
            <CardHeader className="text-center pb-8">
              <div className="w-20 h-20 bg-gradient-sustainability rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-4">
                Para Financiadores
              </h3>
              <h4 className="text-xl font-semibold text-accent mb-4">
                Invista com Confiança em Projetos Verificados
              </h4>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground leading-relaxed text-lg">
                Chega de incertezas. Tenha acesso a um portfólio de oportunidades de investimento pré-qualificadas com base em um rigoroso framework ESG.
              </p>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Analise KPIs de sustentabilidade, relatórios de transparência e compare benchmarks do setor para tomar decisões informadas e maximizar tanto seu retorno financeiro quanto seu impacto positivo no mundo.
              </p>
              
              <div className="flex flex-wrap gap-3 pt-4">
                <div className="flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full">
                  <Shield className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">Due Diligence ESG</span>
                </div>
                <div className="flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">ROI + Impacto</span>
                </div>
              </div>
              
              
            </CardContent>
          </Card>
        </div>
      </div>
    </section>;
};