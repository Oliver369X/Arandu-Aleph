import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, MessageCircle } from "lucide-react"

export function CommunityPage() {
  const posts = [
    {
      title: "¿Cómo implementar un smart contract básico?",
      author: "María González",
      replies: 12,
      votes: 24,
      category: "Desarrollo",
      time: "hace 2 horas",
    },
    {
      title: "Mejores prácticas para el aprendizaje con IA",
      author: "Carlos Ruiz",
      replies: 8,
      votes: 18,
      category: "IA",
      time: "hace 5 horas",
    },
    {
      title: "Experiencias con certificados blockchain",
      author: "Ana López",
      replies: 15,
      votes: 31,
      category: "Blockchain",
      time: "hace 1 día",
    },
    {
      title: "Recursos gratuitos para aprender Solidity",
      author: "Diego Martín",
      replies: 22,
      votes: 45,
      category: "Desarrollo",
      time: "hace 2 días",
    },
    {
      title: "¿Qué opinas sobre el futuro de la educación Web3?",
      author: "Laura Fernández",
      replies: 18,
      votes: 37,
      category: "Blockchain",
      time: "hace 3 días",
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-poppins font-bold text-foreground mb-4">Comunidad ARANDU</h1>
          <p className="text-lg text-muted-foreground">
            Conecta, aprende y crece junto a otros estudiantes y profesores
          </p>
        </div>

        <div className="space-y-6">
          {posts.map((post, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline">{post.category}</Badge>
                      <span className="text-sm text-muted-foreground">{post.time}</span>
                    </div>
                    <h3 className="font-poppins font-semibold text-lg mb-2 hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>por {post.author}</span>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        {post.votes} votos
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {post.replies} respuestas
                      </div>
                    </div>
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
