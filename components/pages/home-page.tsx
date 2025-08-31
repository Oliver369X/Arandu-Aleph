import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Shield, Globe, ChevronRight, Play, CheckCircle } from "lucide-react"

export function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-poppins font-bold text-foreground mb-6">
              La Evolución de la <span className="text-primary">Educación</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Inteligente, Verificable y Personalizada
            </p>
            <p className="text-lg text-muted-foreground mb-10 max-w-4xl mx-auto">
              ARANDU une la inteligencia artificial adaptativa con la inmutabilidad de la blockchain para potenciar a
              docentes y estudiantes en su viaje educativo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-3">
                Comienza tu Viaje Educativo
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent">
                <Play className="mr-2 w-5 h-5" />
                Ver Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold text-foreground mb-4">
              ¿Por qué elegir ARANDU?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descubre cómo la combinación de IA y blockchain revoluciona la educación
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-poppins">IA Personalizada</CardTitle>
                <CardDescription>
                  Algoritmos adaptativos que personalizan el aprendizaje según tu ritmo y estilo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-secondary mr-2" />
                    Rutas de aprendizaje personalizadas
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-secondary mr-2" />
                    Recomendaciones inteligentes
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-secondary mr-2" />
                    Análisis de progreso en tiempo real
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-secondary/20 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 dark:bg-secondary/20 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle className="font-poppins">Certificados Blockchain</CardTitle>
                <CardDescription>
                  Certificaciones inmutables y verificables respaldadas por tecnología blockchain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-secondary mr-2" />
                    Verificación instantánea
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-secondary mr-2" />
                    Imposible de falsificar
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-secondary mr-2" />
                    Reconocimiento global
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-accent/20 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 dark:bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-accent-foreground" />
                </div>
                <CardTitle className="font-poppins">Acceso 24/7</CardTitle>
                <CardDescription>
                  Aprende cuando quieras, donde quieras, con contenido siempre disponible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-secondary mr-2" />
                    Plataforma multiplataforma
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-secondary mr-2" />
                    Sincronización en la nube
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-secondary mr-2" />
                    Modo offline disponible
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 dark:bg-muted/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-poppins font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Estudiantes Activos</div>
            </div>
            <div>
              <div className="text-4xl font-poppins font-bold text-secondary mb-2">500+</div>
              <div className="text-muted-foreground">Cursos Disponibles</div>
            </div>
            <div>
              <div className="text-4xl font-poppins font-bold text-accent-foreground mb-2">1K+</div>
              <div className="text-muted-foreground">Profesores Expertos</div>
            </div>
            <div>
              <div className="text-4xl font-poppins font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Certificados Emitidos</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
