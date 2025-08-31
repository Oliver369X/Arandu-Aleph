import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, CheckCircle, Shield, QrCode } from "lucide-react"

export function CertificatesPage() {
  const certificates = [
    {
      title: "Blockchain Fundamentals",
      issuer: "ARANDU Academy",
      date: "2024-01-15",
      verified: true,
      tokenId: "0x1a2b3c4d5e6f...",
      blockchainNetwork: "Polygon",
    },
    {
      title: "Smart Contract Development",
      issuer: "ARANDU Academy",
      date: "2024-02-20",
      verified: true,
      tokenId: "0x4d5e6f7a8b9c...",
      blockchainNetwork: "Ethereum",
    },
    {
      title: "Machine Learning Specialist",
      issuer: "ARANDU Academy",
      date: "2024-03-10",
      verified: true,
      tokenId: "0x7a8b9c1d2e3f...",
      blockchainNetwork: "Polygon",
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-poppins font-bold text-foreground mb-4">Certificados Blockchain</h1>
          <p className="text-lg text-muted-foreground">
            Certificaciones verificables e inmutables respaldadas por blockchain
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {certificates.map((cert, index) => (
            <Card key={index} className="border-2 border-secondary/20 hover:border-secondary/40 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Award className="w-8 h-8 text-accent" />
                  <Badge className="bg-secondary text-secondary-foreground">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verificado
                  </Badge>
                </div>
                <CardTitle className="font-poppins">{cert.title}</CardTitle>
                <CardDescription>
                  Emitido por {cert.issuer} • {cert.date}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Red:</span>
                      <Badge variant="outline">{cert.blockchainNetwork}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Token ID:</span>
                      <code className="bg-muted px-2 py-1 rounded text-xs">{cert.tokenId}</code>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <Shield className="w-4 h-4 mr-2" />
                      Verificar
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <QrCode className="w-4 h-4 mr-2" />
                      QR
                    </Button>
                    <Button className="flex-1 bg-primary hover:bg-primary/90">Compartir</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
