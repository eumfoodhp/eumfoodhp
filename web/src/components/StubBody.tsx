import { getTranslations } from 'next-intl/server';

/**
 * Placeholder section shown on pages whose detailed content has not yet been
 * ported from the original PHP build. Layout/breadcrumb/tabs are still real,
 * so the navigation works end-to-end; only the page body is provisional.
 *
 * `note` is a developer-facing hint passed by the page itself; intentionally
 * not rendered to visitors (would otherwise show Korean text on /en, /zh).
 */
export default async function StubBody({ note: _note }: { note?: string }) {
  const t = await getTranslations();
  return (
    <section
      style={{
        padding: '120px 24px',
        textAlign: 'center',
        color: '#666',
        fontSize: '15px',
        lineHeight: 1.6,
      }}
    >
      <p>{t('stub_preparing')}</p>
    </section>
  );
}
