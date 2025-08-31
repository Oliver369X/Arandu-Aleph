import { QuizPage } from "@/components/pages/quiz-page"

interface QuizPageProps {
  params: {
    id: string
  }
}

export default function Quiz({ params }: QuizPageProps) {
  return <QuizPage quizId={params.id} />
}
