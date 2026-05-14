// Root layout — passthrough. The [locale]/layout.tsx renders <html>/<body>
// so the lang attribute can reflect the active locale.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
