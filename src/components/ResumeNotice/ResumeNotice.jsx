import { useEffect } from 'react';
import { ConfigProvider, notification } from 'antd';
import { antdThemeConfig } from '../../lib/antdTheme.js';

const NOTICE_KEY = 'resume-unavailable';

// The "résumé unavailable" notice. Loaded only when first needed (ADR-0006), so it brings its own
// antd theme. It opens again, as one notice, each time requestId changes.
export default function ResumeNotice({ requestId, theme }) {
  // Hook form so the notice follows this component's ConfigProvider theme.
  const [noticeApi, noticeHolder] = notification.useNotification();

  useEffect(() => {
    noticeApi.open({
      key: NOTICE_KEY,
      role: 'alert',
      placement: 'top',
      title: 'Résumé unavailable',
      description: (
        <>
          The résumé is temporarily unavailable. Please reach out through the Contact section.{' '}
          <a href="#contact" onClick={() => noticeApi.destroy(NOTICE_KEY)}>
            Go to Contact
          </a>
        </>
      ),
    });
  }, [noticeApi, requestId]);

  return <ConfigProvider theme={antdThemeConfig(theme)}>{noticeHolder}</ConfigProvider>;
}
