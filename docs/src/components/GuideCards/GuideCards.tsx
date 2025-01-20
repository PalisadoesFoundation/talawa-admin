import './GuideCards.css';

const GuideCards = () => {
  const ChevronRightArrowIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 512"
      className="svg-icon"
    >
      <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
    </svg>
  );

  const DeveloperGuideIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 512"
      className="svg-icon"
    >
      <path d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z" />
    </svg>
  );

  const UserGuideIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      className="svg-icon"
    >
      <path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40L64 64C28.7 64 0 92.7 0 128l0 16 0 48L0 448c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-256 0-48 0-16c0-35.3-28.7-64-64-64l-40 0 0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40L152 64l0-40zM48 192l352 0 0 256c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-256z" />
    </svg>
  );
  const Guides = [
    {
      title: 'Developer Guides',
      icon: <DeveloperGuideIcon />,
      items: [
        {
          title: 'Manual Documentation',
          description:
            'Setup guides, best practices, and contribution guidelines',
          href: '/docs/INSTALLATION',
        },
        {
          title: 'Plugins Documentation',
          description: 'Explore Talawa Plugins documentation Guide',
          href: '/docs/docs/plugins/implementing-plugins-example',
        },
        {
          title: 'Code Documentation',
          description: 'Explore API references and component documentation',
          href: '/docs/INSTALLATION',
        },
      ],
    },
    {
      title: 'User Guides',
      icon: <UserGuideIcon />,
      items: [
        {
          title: 'Getting Started',
          description: 'Learn the basics of using Talawa',
        },
        {
          title: 'Advanced Features',
          description: 'Detailed guides for power users',
        },
      ],
    },
  ];

  return (
    <div className="section-container">
      <div className="card-grid">
        {Guides.map((guide, index) => (
          <div className="card" key={index}>
            <div className="guide-header">
              {guide.icon}
              <h1>{guide.title}</h1>
            </div>
            {guide.items.map((item) => (
              <a className="card-item" key={item.title} href={item.href}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <ChevronRightArrowIcon />
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuideCards;
