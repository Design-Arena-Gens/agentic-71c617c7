import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sora Free - Unlimited AI Video Generation',
  description: 'Generate stunning AI videos instantly. No watermarks, no restrictions, completely free.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
