import React from 'react';

export default function Projects() {
  const projects = [
    {
      name: 'E-Commerce Microservices',
      description: 'Built a scalable e-commerce platform using microservices architecture',
      tech: ['Node.js', 'MongoDB', 'Docker', 'Kubernetes']
    },
    {
      name: 'Real-time Chat Application',
      description: 'Developed a real-time messaging system with WebSocket integration',
      tech: ['Socket.io', 'Redis', 'Express', 'React']
    },
    {
      name: 'API Gateway Service',
      description: 'Implemented a centralized API gateway for microservices communication',
      tech: ['Spring Boot', 'JWT', 'PostgreSQL']
    }
  ];

  return (
    <div className="text-gray-300">
      <p className="text-green-400 mb-4">$ ls -la ~/projects</p>
      
      {projects.map((project, index) => (
        <div key={index} className="mb-6 border-l-2 border-gray-700 pl-4">
          <p className="text-yellow-400 font-bold">{project.name}</p>
          <p className="text-gray-400 mt-1">{project.description}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {project.tech.map((tech, techIndex) => (
              <span
                key={techIndex}
                className="px-2 py-1 text-xs bg-gray-800 rounded-md text-blue-400"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}