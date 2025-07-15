// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TwitchFleet Auth',
  description: 'Login/Register UI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className="bg-gray-100">
        <div className="animate-fade-in min-h-screen">{children}</div>
      </body>
    </html>
  );
}
