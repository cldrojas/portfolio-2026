import { useState } from 'react'
import { categories } from 'src/data/categories'
import { projects } from 'src/data/projects'

export function Projects() {
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredProjects =
    activeCategory === 'all'
      ? projects
      : projects.filter((project) => project.category === activeCategory)

  return (
    <section
      id="projects"
      className="py-20 bg-dark-50 dark:bg-dark-900"
    >
      <div className="container-custom">
        <h2 className="section-title">Featured Projects</h2>
        <p className="section-subtitle">
          A selection of projects I've worked on
        </p>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setActiveCategory(category.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === category.value
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-dark-200 dark:bg-dark-700 text-dark-700 dark:text-dark-300 hover:bg-dark-300 dark:hover:bg-dark-600'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <article
              key={project.id}
              className="card group overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Project Image */}
              <div className="relative h-48 -mx-6 -mt-6 mb-6 bg-dark-200 dark:bg-dark-700 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-dark-400 dark:text-dark-500">
                  <svg
                    className="w-16 h-16"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" />
                  </svg>
                </div>
                {/* Overlay */}
                <div className="absolute inset-0 bg-dark-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-sm"
                    >
                      View Live
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary text-sm"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>

              {/* Project Content */}
              <h3 className="text-xl font-bold text-dark-900 dark:text-light mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {project.title}
              </h3>
              <p className="text-dark-600 dark:text-dark-400 text-sm mb-4">
                {project.description}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-xs font-medium bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-300 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
