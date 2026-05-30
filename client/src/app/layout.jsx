import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'react-hot-toast'
import ErrorBoundary from '../components/shared/ErrorBoundary'
import '../index.css'

export const metadata = {
  title: 'AlgoZen',
  description: 'India\'s #1 Coding Mastery Platform',
}

export default function RootLayout({ children }) {
  const isDevMode = !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('placeholder') || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('xxxx');
  
  const content = (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <Toaster position="top-right" toastOptions={{ style: { background: '#1a1a2e', color: '#e2e8f0' } }} />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );

  if (isDevMode) {
    return content;
  }

  return (
    <ClerkProvider>
      {content}
    </ClerkProvider>
  )
}
