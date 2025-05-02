'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function GoogleAnalytics({ GA_MEASUREMENT_ID = 'G-EJ0159D6PS' }: { GA_MEASUREMENT_ID?: string }) {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname && window.gtag) {
      // Send page view when the path changes
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: pathname,
      });
    }
  }, [pathname, GA_MEASUREMENT_ID]);

  // Page view tracking script
  const pageViewTrackingScript = `
    function sendPageView() {
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}');
    }
    sendPageView();
  `;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: pageViewTrackingScript,
        }}
      />
    </>
  );
}

// Add TypeScript declaration for gtag
declare global {
  interface Window {
    gtag: (
      command: string,
      target: string,
      config?: Record<string, unknown> | string
    ) => void;
  }
}
