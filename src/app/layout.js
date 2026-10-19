import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from 'next-themes'
import QueryProvider from '../lib/query-client'
import "./globals.css";
import { Plus_Jakarta_Sans, JetBrains_Mono, Fredoka } from 'next/font/google'

const SITE_URL = "https://nexuset.vercel.app"
const SITE_NAME = "nexuset"
const SITE_DESCRIPTION =
  "A spelling practice app for kids. Hear the word, spell what you hear, and track progress across every session."

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "nexuset · spelling practice that sticks",
    template: "%s · nexuset",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: ["spelling", "practice", "kids", "vocabulary", "learning"],
  icons: {
    icon: '/icon.svg'
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "nexuset · spelling practice that sticks",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/questions.png",
        width: 1200,
        height: 630,
        alt: "A nexuset spelling session with letter tiles being filled in",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "nexuset · spelling practice that sticks",
    description: SITE_DESCRIPTION,
    images: ["/questions.png"],
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF6EE" },
    { media: "(prefers-color-scheme: dark)", color: "#09090B" },
  ],
};

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
})

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-fredoka',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakarta.variable} ${fredoka.variable} ${jetbrainsMono.variable} antialiased`}>
        <a href="#main" className="skip-link">Skip to content</a>

        <AuthProvider>
          <QueryProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
            </ThemeProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
