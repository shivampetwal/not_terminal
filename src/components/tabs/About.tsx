import React from 'react';

export default function About() {
  return (
    <div className="text-gray-300 space-y-4">
      <div className="text-green-400">
        <pre className="text-xs sm:text-sm">
{`
>_SHIVAM PETWAL

`}
        </pre>
      </div>

      <p className="typing-animation">
        Hello, I'm Shivam Petwal! 👋 I'm a Backend Developer passionate about building
        scalable and efficient systems.
      </p>

      <div className="space-y-2">
        <p>$ whoami</p>
        <p className="ml-4">→ Backend Developer with expertise in system design and API development</p>

        <p>$ cat background.txt</p>
        <p className="ml-4">
          → Experienced in building robust backend services and microservices architecture<br />
          → Strong foundation in data structures and algorithms<br />
          → Passionate about clean code and software architecture
        </p>
      </div>
    </div>
  );
}