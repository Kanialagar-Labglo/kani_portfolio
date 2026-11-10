// The interactive extras that use antd, loaded only when needed (ADR-0006). React.lazy and the
// idle prefetch share these loaders, so each module is downloaded and run once.

export const loadMenuDrawer = () => import('../components/MobileMenu/MenuDrawer.jsx');

export const loadResumeNotice = () => import('../components/ResumeNotice/ResumeNotice.jsx');
