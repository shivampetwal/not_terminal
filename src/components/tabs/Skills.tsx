import React from 'react';

export default function Skills() {
  const skills = {
    'Languages': ['JavaScript/TypeScript', 'Python', 'Java', 'SQL'],
    'Backend': ['Node.js', 'Express', 'Django', 'Spring Boot'],
    'Databases': ['PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch'],
    'DevOps': ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
    'Tools': ['Git', 'Linux', 'Postman', 'Swagger']
  };

  return (
    <div className="text-gray-300">
      <p className="text-green-400 mb-4">$ cat skills.json</p>
      
      {Object.entries(skills).map(([category, items]) => (
        <div key={category} className="mb-4">
          <p className="text-yellow-400">{category}:</p>
          <div className="ml-4">
            {items.map((skill, index) => (
              <div key={index} className="flex items-center">
                <span className="text-blue-400">→</span>
                <span className="ml-2">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}