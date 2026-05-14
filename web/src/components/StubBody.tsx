/**
 * Placeholder section shown on pages whose detailed content has not yet been
 * ported from the original PHP build. Layout/breadcrumb/tabs are still real,
 * so the navigation works end-to-end; only the page body is provisional.
 */
export default function StubBody({ note }: { note?: string }) {
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
      <p style={{ marginBottom: 8 }}>이 페이지는 준비 중입니다.</p>
      {note && <p style={{ fontSize: 13, opacity: 0.7 }}>{note}</p>}
    </section>
  );
}
