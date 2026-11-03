import { content as defaultContent } from './data/index.js';
import { getVisibleSections } from './lib/sections.js';
import SkipLink from './components/SkipLink/SkipLink.jsx';
import Header from './components/Header/Header.jsx';
import PageSection from './components/PageSection/PageSection.jsx';
import Footer from './components/Footer/Footer.jsx';

const MAIN_ID = 'main';

export default function App({ content = defaultContent }) {
  const sections = getVisibleSections(content);

  return (
    <>
      <SkipLink targetId={MAIN_ID} />
      <Header />
      <main id={MAIN_ID} tabIndex={-1}>
        {sections.map((section) =>
          section.id === 'hero' ? (
            <PageSection
              key={section.id}
              id={section.id}
              heading={content.profile.name}
              headingLevel={1}
            />
          ) : (
            <PageSection key={section.id} id={section.id} heading={section.label} />
          ),
        )}
      </main>
      <Footer />
    </>
  );
}
