export interface User {
  id: string
  name: string
  email: string
  role: "student" | "teacher" | "institution"
  walletAddress?: string
  avatar?: string
  createdAt: Date
}

export interface Course {
  id: string
  title: string
  description: string
  category: string
  level: "Principiante" | "Intermedio" | "Avanzado"
  instructor: User
  price: number
  rating: number
  studentsCount: number
  duration: number
  modules: Module[]
  thumbnail: string
  createdAt: Date
}

export interface Module {
  id: string
  title: string
  description: string
  content: string
  videoUrl?: string
  duration: number
  order: number
  completed?: boolean
}

export interface Certificate {
  id: string
  title: string
  issuer: string
  recipient: User
  courseId: string
  tokenId: string
  blockchainNetwork: string
  transactionHash: string
  issuedAt: Date
  verified: boolean
}

export interface Progress {
  userId: string
  courseId: string
  completedModules: string[]
  currentModule: string
  progressPercentage: number
  lastAccessed: Date
}

export interface ForumPost {
  id: string
  title: string
  content: string
  author: User
  category: string
  votes: number
  replies: ForumReply[]
  createdAt: Date
  updatedAt: Date
}

export interface ForumReply {
  id: string
  content: string
  author: User
  votes: number
  createdAt: Date
}
