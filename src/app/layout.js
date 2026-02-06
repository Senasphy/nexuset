import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from 'next-themes'
import QueryProvider from '../lib/queryClient'
import "./globals.css";
import {Inter} from 'next/font/google'

export const metadata = {
  title: "Next Spelling",
  description: "A spelling practising app made for kids",
  icons: {
    icon: '/icon.svg'
  }
 
};

const inter  = Inter({
  subsets:['latin'],
  display:'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>

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
