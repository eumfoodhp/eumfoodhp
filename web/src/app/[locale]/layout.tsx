import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale, getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Script from 'next/script';

import { routing } from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QuickMenu from '@/components/QuickMenu';

import '../globals.css';
import '@/styles/common.css';
import '@/styles/buttons-override.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata = {
  title: '㈜이음푸드시스템',
  description: '㈜이음푸드시스템 — 절임식품, 나물류, 조림류, 양념젓갈, 소스, 액상차 제조',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Header />
          {children}
          <Footer />
          <QuickMenu />
        </NextIntlClientProvider>
        <Script src="/js/common.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
