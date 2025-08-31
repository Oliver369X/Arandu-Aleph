import { Brain } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative w-8 h-8">
                <Image
                  src="/arandu-logo.png"
                  alt="ARANDU Logo"
                  width={32}
                  height={32}
                  className="rounded-lg"
                  fallback={
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <Brain className="w-5 h-5 text-primary-foreground" />
                    </div>
                  }
                />
              </div>
              <span className="text-xl font-poppins font-bold text-primary">ARANDU</span>
            </div>
            <p className="text-sm text-muted-foreground">Revolucionando la educación con IA y blockchain</p>
          </div>
          <div>
            <h4 className="font-poppins font-semibold mb-4">Plataforma</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Cursos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Certificaciones
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Comunidad
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-poppins font-semibold mb-4">Soporte</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Centro de Ayuda
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Contacto
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-poppins font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Términos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 ARANDU. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
