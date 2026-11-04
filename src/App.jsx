import { Fragment, useEffect } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { content as defaultContent } from './data/index.js';
import { getVisibleSections } from './lib/sections.js';
import { useTheme } from './hooks/useTheme.js';
import { useActiveSection } from './hooks/useActiveSection.js';
import SkipLink from './components/SkipLink/SkipLink.jsx';
import Header from './components/Header/Header.jsx';
import PageSection from './components/PageSection/PageSection.jsx';
import Hero from './components/Hero/Hero.jsx';
import About from './components/About/About.jsx';
import Skills from './components/Skills/Skills.jsx';
import Projects from './components/Projects/Projects.jsx';
import Experience from './components/Experience/Experience.jsx';
import Footer from './components/Footer/Footer.jsx';

const MAIN_ID = 'main';

function renderSection(section, content, visibleSectionIds) {
  switch (section.id) {
    case 'hero':
      return <Hero profile={content.profile} visibleSectionIds={visibleSectionIds} />;
    case 'about':
      return <About bio={content.profile.bio} />;
    case 'skills':
      return <Skills skillGroups={content.skillGroups} />;
    case 'projects':
      return <Projects projects={content.projects} />;
    case 'experience':
      return <Experience experience={content.experience} />;
    default:
      // Contact content is added in task group 8.
      return <PageSection id={section.id} heading={section.label} />;
  }
}

export default function App({ content = defaultContent }) {
  const sections = getVisibleSections(content);
  const visibleSectionIds = sections.map((section) => section.id);
  const { theme, toggleTheme } = useTheme();
  const activeId = useActiveSection(visibleSectionIds);

  // The browser tries to jump to a #section before React has rendered it, so jump once rendered.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id) {
      document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  }, []);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      }}
    >
      <SkipLink targetId={MAIN_ID} />
      <Header
        siteName={content.profile.name}
        sections={sections}
        activeId={activeId}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <main id={MAIN_ID} tabIndex={-1}>
        {sections.map((section) => (
          <Fragment key={section.id}>{renderSection(section, content, visibleSectionIds)}</Fragment>
        ))}
      </main>
      <Footer ownerName={content.profile.name} />
    </ConfigProvider>
  );
}
