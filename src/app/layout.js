import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from 'next-themes'
import QueryProvider from '../lib/queryClient'
import "./globals.css";
import { Fraunces, DM_Sans, DM_Mono } from 'next/font/google'

export const metadata = {
  title: "Next Spelling",
  description: "A spelling practising app made for kids",
  icons: {
    icon: '/icon.svg'
  }
 
};

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '600'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-sans',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fraunces.variable} ${dmSans.variable} ${dmMono.variable}`}>

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
