import { Fragment, lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { content as defaultContent } from './data/index.js';
import { getVisibleSections } from './lib/sections.js';
import { useTheme } from './hooks/useTheme.js';
import { loadMenuDrawer, loadResumeNotice } from './lib/extras.js';
import { useActiveSection } from './hooks/useActiveSection.js';
import { useResumeDownload } from './hooks/useResumeDownload.js';
import { useReveal } from './hooks/useReveal.js';
import { useIdlePrefetch } from './hooks/useIdlePrefetch.js';
import ExtraBoundary from './components/ExtraBoundary/ExtraBoundary.jsx';
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
const ResumeNotice = lazy(loadResumeNotice);
// Fetched in the background once the page is idle, so first use is normally instant.
const EXTRA_LOADERS = [loadMenuDrawer, loadResumeNotice];

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
  useIdlePrefetch(EXTRA_LOADERS);
  // Each request (re)opens the notice; its antd code loads on the first one (ADR-0006).
  const [noticeRequests, setNoticeRequests] = useState(0);
  const showResumeUnavailable = useCallback(() => setNoticeRequests((count) => count + 1), []);

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
    <>
      {noticeRequests > 0 && (
        <ExtraBoundary>
          <Suspense fallback={null}>
            <ResumeNotice requestId={noticeRequests} theme={theme} />
          </Suspense>
        </ExtraBoundary>
      )}
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
    </>
  );
}
