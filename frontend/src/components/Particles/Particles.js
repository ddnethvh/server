import React from 'react';
import './Particles.css';

const Particles = () => {
  React.useEffect(() => {
    const createParticles = () => {
      const particlesContainer = document.createElement('div');
      particlesContainer.className = 'particles';
      document.body.appendChild(particlesContainer);

      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 20}s`;
        particle.style.opacity = Math.random();
        particlesContainer.appendChild(particle);
      }
    };

    createParticles();
    return () => {
      const particles = document.querySelector('.particles');
      if (particles) {
        particles.remove();
      }
    };
  }, []);

  return null;
};

export default Particles; 