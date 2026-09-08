/**
 * Portfolio project data for dynamic detail pages
 * Populates portfolio-details.html based on ?project= query parameter
 */
(function() {
  "use strict";

  const projects = {
    'task-manager': {
      title: 'Task Manager',
      category: 'Mobile App',
      client: 'Personal Project',
      date: '2024',
      description: 'A cross-platform mobile application built with Ionic framework. Features include task creation, categorization, reminders, and progress tracking with a clean, intuitive interface. The app supports offline mode and push notifications for seamless task management on the go.',
      image: '../assets/img/portfolio/app-1.jpg',
      tags: ['Ionic', 'TypeScript', 'Mobile', 'Task Management']
    },
    'e-commerce': {
      title: 'E-Commerce Platform',
      category: 'Web App',
      client: 'Client Project',
      date: '2024 - 2025',
      description: 'Full-stack web application built with Angular frontend and PHP backend. Features product catalog, shopping cart, user authentication, and payment integration. Designed with a focus on responsive design, security, and scalability.',
      image: '../assets/img/portfolio/product-1.jpg',
      tags: ['Angular', 'PHP', 'Web', 'E-Commerce']
    },
    'pos-system': {
      title: 'POS System',
      category: 'Desktop',
      client: 'Local Business',
      date: '2024',
      description: 'Desktop application for point-of-sale management. Includes inventory tracking, sales reporting, customer management, and receipt printing capabilities. Built with a focus on reliability and ease of use for retail environments.',
      image: '../assets/img/portfolio/branding-1.jpg',
      tags: ['Desktop', 'Business', 'Inventory', 'Sales']
    },
    'voice-robot': {
      title: 'Voice Robot',
      category: 'Robotics',
      client: 'Academic Project',
      date: '2024 - 2025',
      description: 'Arduino-based voice-controlled robot integrated with AI capabilities. Uses TensorFlow Lite for voice recognition and natural language processing. Features obstacle avoidance and real-time control for autonomous operation.',
      image: '../assets/img/portfolio/books-1.jpg',
      tags: ['Arduino', 'AI', 'Robotics', 'Voice']
    },
    'fitness-tracker': {
      title: 'Fitness Tracker',
      category: 'Mobile App',
      client: 'Personal Project',
      date: '2024',
      description: 'Health and wellness mobile application with workout tracking, calorie counting, progress visualization, and personalized recommendations. Built with a user-centric design that makes fitness tracking simple and engaging.',
      image: '../assets/img/portfolio/app-2.jpg',
      tags: ['Mobile', 'Health', 'UI/UX']
    },
    'dashboard': {
      title: 'Analytics Dashboard',
      category: 'Web App',
      client: 'Client Project',
      date: '2024 - 2025',
      description: 'Interactive analytics dashboard with real-time data visualization, customizable widgets, and comprehensive reporting capabilities. Provides clear, actionable insights with a focus on data clarity and user experience.',
      image: '../assets/img/portfolio/product-2.jpg',
      tags: ['Web', 'Data Visualization', 'Analytics']
    },
    'inventory': {
      title: 'Inventory Manager',
      category: 'Desktop',
      client: 'Local Business',
      date: '2024',
      description: 'Desktop software for inventory management with stock tracking, automated alerts, supplier management, and detailed reporting. Streamlines the entire inventory workflow from ordering to stock level monitoring.',
      image: '../assets/img/portfolio/branding-2.jpg',
      tags: ['Desktop', 'Inventory', 'Management']
    },
    'smart-home': {
      title: 'Smart Home System',
      category: 'Robotics',
      client: 'Academic Project',
      date: '2024 - 2025',
      description: 'IoT home automation system built with Arduino. Controls lighting, temperature, and security through a web interface and mobile app. Includes remote control, scheduling, and energy monitoring capabilities.',
      image: '../assets/img/portfolio/books-2.jpg',
      tags: ['IoT', 'Arduino', 'Automation']
    },
    'chat-app': {
      title: 'Chat Application',
      category: 'Mobile App',
      client: 'Personal Project',
      date: '2024',
      description: 'Real-time messaging mobile application with group chats, file sharing, read receipts, and end-to-end encryption. Built for speed and reliability with a focus on privacy and security.',
      image: '../assets/img/portfolio/app-3.jpg',
      tags: ['Mobile', 'Real-time', 'Messaging']
    },
    'portfolio-site': {
      title: 'Portfolio Website',
      category: 'Web App',
      client: 'Personal Project',
      date: '2025',
      description: 'This personal portfolio website built with Bootstrap, featuring responsive design, animations, and modern web technologies. Showcases projects, skills, and services with a clean, professional aesthetic.',
      image: '../assets/img/portfolio/product-3.jpg',
      tags: ['HTML/CSS', 'Bootstrap', 'JavaScript']
    },
    'hr-manager': {
      title: 'HR Manager',
      category: 'Desktop',
      client: 'Local Company',
      date: '2024 - 2025',
      description: 'Human resources desktop application for employee management, attendance tracking, payroll processing, and performance evaluations. Centralizes HR operations into one reliable, easy-to-use platform.',
      image: '../assets/img/portfolio/branding-3.jpg',
      tags: ['Desktop', 'HR', 'Management']
    },
    'line-follower': {
      title: 'Line Follower Robot',
      category: 'Robotics',
      client: 'Academic Project',
      date: '2024',
      description: 'Autonomous line-following robot using infrared sensors and PID control algorithm for smooth and accurate path following. Features sensor fusion for reliable navigation in various lighting conditions.',
      image: '../assets/img/portfolio/books-3.jpg',
      tags: ['Arduino', 'Robotics', 'Autonomous']
    }
  };

  function getProjectFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const projectKey = params.get('project');
    return projectKey ? projects[projectKey] || null : null;
  }

  function renderProject() {
    const project = getProjectFromUrl();
    if (!project) return;

    // Update title
    const titleEl = document.getElementById('project-title');
    if (titleEl) {
      titleEl.textContent = `${project.title} - Details`;
      document.title = `${project.title} - Philibert RAZAFIMAHEFA`;
    }

    // Update description
    const descEl = document.getElementById('project-description');
    if (descEl) {
      descEl.textContent = project.description;
    }

    // Update info list
    const categoryEl = document.getElementById('project-category');
    const clientEl = document.getElementById('project-client');
    const dateEl = document.getElementById('project-date');
    if (categoryEl) categoryEl.textContent = project.category;
    if (clientEl) clientEl.textContent = project.client;
    if (dateEl) dateEl.textContent = project.date;

    // Update image
    const slideEl = document.querySelector('[data-project-slide] img');
    if (slideEl) {
      slideEl.src = project.image;
      slideEl.alt = `Screenshot of ${project.title}`;
    }

    // Add tags
    const infoList = document.getElementById('project-info-list');
    if (infoList && project.tags) {
      const tagsLi = document.createElement('li');
      tagsLi.innerHTML = `<strong>Technologies</strong>: ${project.tags.join(', ')}`;
      infoList.appendChild(tagsLi);
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderProject);
  } else {
    renderProject();
  }
})();
