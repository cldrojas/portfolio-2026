interface Project {
  id: number
  title: string
  description: string
  category: 'frontend' | 'fullstack' | 'mobile'
  image: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
}

export const projects: Project[] = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description:
      'A full-stack e-commerce platform with cart functionality, payment integration, and admin dashboard.',
    category: 'fullstack',
    image: '/images/project-1.jpg',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com'
  },
  {
    id: 2,
    title: 'Task Management App',
    description:
      'A collaborative task management application with real-time updates and team features.',
    category: 'fullstack',
    image: '/images/project-2.jpg',
    technologies: ['React', 'TypeScript', 'Firebase', 'Tailwind CSS'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com'
  },
  {
    id: 3,
    title: 'Weather Dashboard',
    description:
      'A beautiful weather dashboard with location-based forecasts and interactive charts.',
    category: 'frontend',
    image: '/images/project-3.jpg',
    technologies: ['React', 'Chart.js', 'OpenWeather API'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com'
  },
  {
    id: 5,
    title: 'Mobile Fitness App',
    description:
      'A cross-platform fitness tracking app with workout plans and progress analytics.',
    category: 'mobile',
    image: '/images/project-5.jpg',
    technologies: ['React Native', 'TypeScript', 'Redux'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com'
  },
  {
    id: 6,
    title: 'Blog Platform',
    description:
      'A static blog platform with Markdown support, syntax highlighting, and RSS feeds.',
    category: 'frontend',
    image: '/images/project-6.jpg',
    technologies: ['Astro', 'Markdown', 'Tailwind CSS'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com'
  }
]
