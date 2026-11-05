import { Fragment, useCallback, useEffect } from 'react';
import { ConfigProvider, notification, theme as antdTheme } from 'antd';
import { content as defaultContent } from './data/index.js';
import { getVisibleSections } from './lib/sections.js';
import { useTheme } from './hooks/useTheme.js';
import { ACCENT_COLORS } from './lib/theme.js';
import { useActiveSection } from './hooks/useActiveSection.js';
import { useResumeDownload } from './hooks/useResumeDownload.js';
import { useReveal } from './hooks/useReveal.js';
import SkipLink from './components/SkipLink/SkipLink.jsx';
import Header from './components/Header/Header.jsx';
import Hero from './components/Hero/Hero.jsx';
import About from './components/About/About.jsx';
import Skills from './components/Skills/Skills.jsx';
import Projects from './components/Projects/Projects.jsx';
import Experience from './components/Experience/Experience.jsx';
import Education from './components/Education/Education.jsx';
import Contact from './components/Contact/Contact.jsx';
import Footer from './components/Footer/Footer.jsx';

const MAIN_ID = 'main';
const RESUME_NOTICE_KEY = 'resume-unavailable';

function renderSection(section, content, visibleSectionIds, resume) {
  switch (section.id) {
    case 'hero':
      return (
        <Hero profile={content.profile} visibleSectionIds={visibleSectionIds} resume={resume} />
      );
    case 'about':
      return <About bio={content.profile.bio} />;
    case 'skills':
      return <Skills skillGroups={content.skillGroups} />;
    case 'projects':
      return <Projects projects={content.projects} />;
    case 'experience':
      return <Experience experience={content.experience} />;
    case 'education':
      return <Education education={content.education} />;
    case 'contact':
      return <Contact contact={content.contact} socials={content.socials} />;
    default:
      return null;
  }
}

export default function App({ content = defaultContent }) {
  const sections = getVisibleSections(content);
  const visibleSectionIds = sections.map((section) => section.id);
  const { theme, toggleTheme } = useTheme();
  const activeId = useActiveSection(visibleSectionIds);
  useReveal();
  // Hook form so the notice follows the ConfigProvider theme.
  const [noticeApi, noticeHolder] = notification.useNotification();

  const showResumeUnavailable = useCallback(() => {
    noticeApi.open({
      key: RESUME_NOTICE_KEY,
      role: 'alert',
      placement: 'top',
      title: 'Résumé unavailable',
      description: (
        <>
          The résumé is temporarily unavailable. Please reach out through the Contact section.{' '}
          <a href="#contact" onClick={() => noticeApi.destroy(RESUME_NOTICE_KEY)}>
            Go to Contact
          </a>
        </>
      ),
    });
  }, [noticeApi]);

  const resume = useResumeDownload({
    resumePath: content.profile.resumePath,
    ownerName: content.profile.name,
    onUnavailable: showResumeUnavailable,
  });

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
        token: { colorPrimary: ACCENT_COLORS[theme] },
      }}
    >
      {noticeHolder}
      <SkipLink targetId={MAIN_ID} />
      <Header
        siteName={content.profile.name}
        brandInitials={content.profile.brandInitials}
        sections={sections}
        activeId={activeId}
        resume={resume}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <main id={MAIN_ID} tabIndex={-1}>
        {sections.map((section) => (
          <Fragment key={section.id}>
            {renderSection(section, content, visibleSectionIds, resume)}
          </Fragment>
        ))}
      </main>
      <Footer ownerName={content.profile.name} socials={content.socials} />
    </ConfigProvider>
  );
}
