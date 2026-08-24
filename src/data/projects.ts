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

// URLs verificadas activas (prod/preview) — revisadas contra GitHub Deployments API el 2026-08-24.
// Sin deployment vivo a la fecha: clinicats, eira, veronica.., portfolio-svelte (cldrojas.com caído).
export const projects: Project[] = [
  {
    id: 0,
    title: 'Saldo Cero',
    description:
      'App minimalista de finanzas personales diseñada para ayudarte a tomar decisiones con claridad.',
    category: 'fullstack',
    image: '',
    technologies: ['Nextjs', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    liveUrl: 'https://v0-daily-budget.vercel.app',
    githubUrl: 'https://github.com/cldrojas/daily-budget#readme'
  },
  {
    id: 1,
    title: 'Arid Store',
    description:
      'Tienda online de poleras estampadas con carrito de compras y pagos integrados vía MercadoPago.',
    category: 'fullstack',
    image: '',
    technologies: ['Next.js', 'TypeScript', 'Supabase', 'MercadoPago'],
    liveUrl: 'https://arid-store.vercel.app',
    githubUrl: 'https://github.com/cldrojas/arid-store#readme'
  },
  {
    id: 2,
    title: 'Vertx — Neon Tunnel Diver',
    description:
      'Juego pixel-art tipo tunnel runner optimizado para 60 FPS en móvil. Vanilla JS + Canvas 2D, sin frameworks.',
    category: 'frontend',
    image: '',
    technologies: ['JavaScript', 'Canvas 2D', 'Vite'],
    liveUrl: 'https://vertx-five.vercel.app',
    githubUrl: 'https://github.com/cldrojas/vertx#readme'
  },
  {
    id: 3,
    title: '19/24E — Cocina Casera Chilena',
    description:
      'Landing page para restaurante de comida casera chilena: carta, horarios y contacto.',
    category: 'frontend',
    image: '',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    liveUrl: 'https://v0-18-24-e-restaurant-website-mii4zm3eg-cldrojas.vercel.app',
    githubUrl: 'https://github.com/cldrojas/landing-restaurant#readme'
  },
  {
    id: 4,
    title: 'VetCare',
    description:
      'Plataforma de gestión veterinaria con persistencia en PostgreSQL.',
    category: 'fullstack',
    image: '',
    technologies: ['TypeScript', 'PostgreSQL', 'CSS'],
    liveUrl: 'https://v0-vercel-ai-stack-silk.vercel.app',
    githubUrl: 'https://github.com/cldrojas/vetCare#readme'
  },
  {
    id: 5,
    title: 'Cats Appointments',
    description:
      'Aplicación web para la gestión de citas.',
    category: 'fullstack',
    image: '',
    technologies: ['JavaScript', 'TypeScript', 'CSS'],
    liveUrl: 'https://cats-appointments.vercel.app',
    githubUrl: 'https://github.com/cldrojas/cats-appointments#readme'
  },
  {
    id: 6,
    title: 'Saldo Cero — Landing',
    description:
      'Landing page de presentación del proyecto Saldo Cero.',
    category: 'frontend',
    image: '',
    technologies: ['Next.js', 'TypeScript', 'CSS'],
    liveUrl: 'https://v0-saldo-cero-landing-page.vercel.app',
    githubUrl: 'https://github.com/cldrojas/saldo-cero-2f#readme'
  },
  {
    id: 7,
    title: 'React Todo',
    description:
      'Todo list desarrollada como práctica del curso de introducción a React.js.',
    category: 'frontend',
    image: '',
    technologies: ['React', 'TypeScript', 'CSS'],
    liveUrl: 'https://cldrojas.github.io/react-todo/',
    githubUrl: 'https://github.com/cldrojas/react-todo#readme'
  },
  {
    id: 8,
    title: 'Svelte Todo',
    description:
      'App de tareas pendientes construida con Svelte.',
    category: 'frontend',
    image: '',
    technologies: ['Svelte', 'JavaScript', 'CSS'],
    liveUrl: 'https://cldrojas.github.io/todo/',
    githubUrl: 'https://github.com/cldrojas/todo#readme'
  }
]
