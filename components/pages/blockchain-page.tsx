import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Shield, BookOpen, Zap, CheckCircle, BarChart3 } from "lucide-react"

export function BlockchainPage() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-poppins font-bold text-foreground mb-4">Tecnología Blockchain</h1>
          <p className="text-lg text-muted-foreground">
            Transparencia, seguridad e inmutabilidad en cada certificación
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-poppins flex items-center">
                <Shield className="w-6 h-6 text-primary mr-2" />
                ¿Cómo funciona?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-poppins font-semibold mb-2">1. Completa el Curso</h3>
                  <p className="text-sm text-muted-foreground">Finaliza todos los módulos y aprueba las evaluaciones</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="font-poppins font-semibold mb-2">2. Emisión Automática</h3>
                  <p className="text-sm text-muted-foreground">El certificado se acuña automáticamente como NFT</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-accent-foreground" />
                  </div>
                  <h3 className="font-poppins font-semibold mb-2">3. Verificación Global</h3>
                  <p className="text-sm text-muted-foreground">Cualquiera puede verificar la autenticidad</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-poppins flex items-center">
                <BarChart3 className="w-6 h-6 text-secondary mr-2" />
                Estadísticas de la Red
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Certificados Emitidos</span>
                    <span className="font-semibold">50,247</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Verificaciones</span>
                    <span className="font-semibold">125,891</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Instituciones Conectadas</span>
                    <span className="font-semibold">1,247</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Transacciones Totales</span>
                    <span className="font-semibold">892,156</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
