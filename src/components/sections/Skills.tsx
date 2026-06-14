import { useState } from 'react'

interface Skill {
  name: string
  category: string
  icon: string
  level: number // 1-5
  description: string
}

const skills: Skill[] = [
  {
    name: 'React',
    category: 'frontend',
    icon: '⚛️',
    level: 5,
    description: 'Hooks, Context, Redux, Next.js'
  },
  {
    name: 'TypeScript',
    category: 'frontend',
    icon: '📘',
    level: 5,
    description: 'Type safety, Generics, Advanced types'
  },
  {
    name: 'Astro',
    category: 'frontend',
    icon: '🚀',
    level: 4,
    description: 'Server islands, Content collections'
  },
  {
    name: 'Tailwind CSS',
    category: 'frontend',
    icon: '🎨',
    level: 5,
    description: 'Custom designs, Responsive'
  },
  {
    name: 'JavaScript',
    category: 'frontend',
    icon: '💛',
    level: 5,
    description: 'ES6+, Async/Await, DOM'
  },
  {
    name: 'Node.js',
    category: 'backend',
    icon: '🟢',
    level: 4,
    description: 'Express, REST APIs, Serverless'
  },
  {
    name: 'GraphQL',
    category: 'backend',
    icon: '🔮',
    level: 4,
    description: 'Apollo, Queries, Mutations'
  },
  {
    name: 'PostgreSQL',
    category: 'database',
    icon: '🐘',
    level: 3,
    description: 'Queries, Schema design'
  },
  {
    name: 'Git',
    category: 'tools',
    icon: '📦',
    level: 5,
    description: 'Branching, Rebase, Workflows'
  },
  {
    name: 'Testing',
    category: 'tools',
    icon: '🧪',
    level: 4,
    description: 'Jest, React Testing Library'
  }
]

const categories = ['all', 'frontend', 'backend', 'database', 'tools']

export function Skills() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  const filteredSkills =
    activeCategory === 'all'
      ? skills
      : skills.filter((skill) => skill.category === activeCategory)

  return (
    <section
      id="skills"
      className="py-20"
    >
      <div className="container-custom">
        <h2 className="section-title">Skills & Technologies</h2>
        <p className="section-subtitle">Technologies and tools I work with</p>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === category
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-dark-200 dark:bg-dark-700 text-dark-700 dark:text-dark-300 hover:bg-dark-300 dark:hover:bg-dark-600'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredSkills.map((skill, index) => (
            <div
              key={skill.name}
              className={`card cursor-pointer group transition-all duration-300 ${
                hoveredSkill === skill.name ? 'ring-2 ring-primary-500' : ''
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
              onMouseEnter={() => setHoveredSkill(skill.name)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{skill.icon}</span>
                <span className="font-semibold text-dark-900 dark:text-light">
                  {skill.name}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-dark-500 dark:text-dark-400 group-hover:text-dark-600 dark:group-hover:text-dark-300 transition-colors">
                {skill.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
