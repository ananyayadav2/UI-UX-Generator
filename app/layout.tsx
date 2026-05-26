import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import Header from './components/Header'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
// Remove <ClerkProvider> from the top and </ClerkProvider> from the bottom
<html lang="en">
  <body>{children}</body>
</html>
  )
}