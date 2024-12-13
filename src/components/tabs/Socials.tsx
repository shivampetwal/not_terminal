import React from 'react';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';

export default function Socials() {
  const socials = [
    {
      name: 'GitHub',
      url: 'https://github.com/shivampetwal',
      icon: Github,
      username: '@shivampetwal'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/shivampetwal',
      icon: Linkedin,
      username: 'shivampetwal'
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/shivampetwal',
      icon: Twitter,
      username: '@shivampetwal'
    },
    {
      name: 'Email',
      url: 'mailto:contact@shivampetwal.dev',
      icon: Mail,
      username: 'contact@shivampetwal.dev'
    }
  ];

  return (
    <div className="text-gray-300">
      <p className="text-green-400 mb-4">$ cat social_links.txt</p>
      
      <div className="space-y-4">
        {socials.map((social) => {
          const Icon = social.icon;
          return (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:bg-gray-800 p-2 rounded-md transition-colors"
            >
              <Icon className="w-5 h-5 text-blue-400" />
              <span className="text-yellow-400">{social.name}:</span>
              <span>{social.username}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}