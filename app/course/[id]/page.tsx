import { CoursePlayer } from "@/components/pages/course-player"

interface CoursePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { id } = await params
  return <CoursePlayer courseId={id} />
}
