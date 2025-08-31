import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users } from "lucide-react"

export function CoursesPage() {
  const courses = [
    {
      title: "Introducción a Blockchain",
      category: "Tecnología",
      level: "Principiante",
      rating: 4.8,
      students: 1250,
      price: "Gratis",
      image: "/blockchain-course.png",
    },
    {
      title: "Machine Learning Fundamentals",
      category: "IA",
      level: "Intermedio",
      rating: 4.9,
      students: 890,
      price: "$49",
      image: "/machine-learning-course.png",
    },
    {
      title: "Smart Contracts con Solidity",
      category: "Desarrollo",
      level: "Avanzado",
      rating: 4.7,
      students: 567,
      price: "$99",
      image: "/smart-contracts-course.png",
    },
    {
      title: "Fundamentos de Criptomonedas",
      category: "Finanzas",
      level: "Principiante",
      rating: 4.6,
      students: 2100,
      price: "Gratis",
      image: "/placeholder-xhkuj.png",
    },
    {
      title: "Deep Learning con Python",
      category: "IA",
      level: "Avanzado",
      rating: 4.9,
      students: 445,
      price: "$129",
      image: "/deep-learning-course.png",
    },
    {
      title: "DeFi y Finanzas Descentralizadas",
      category: "Finanzas",
      level: "Intermedio",
      rating: 4.7,
      students: 678,
      price: "$79",
      image: "/defi-course.png",
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-poppins font-bold text-foreground mb-4">Explora Nuestros Cursos</h1>
          <p className="text-lg text-muted-foreground">Descubre cursos diseñados con IA y certificados en blockchain</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-muted dark:bg-muted/50">
                <img
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{course.category}</Badge>
                  <Badge variant="outline">{course.level}</Badge>
                </div>
                <CardTitle className="font-poppins">{course.title}</CardTitle>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-accent mr-1" />
                    {course.rating}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {course.students}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-poppins font-bold text-primary">{course.price}</span>
                  <Button className="bg-primary hover:bg-primary/90 dark:hover:bg-primary/80">Inscribirse</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
