import './globals.css'

export const metadata = {
  title: 'react-unsafe-local-variants',
  description: 'Zero-flash client-side variants for React SSR/SSG',
}

// Early theme script - runs before body paint for global CSS variables
const themeScript = `(function(){var v;try{v=localStorage.getItem('theme')}catch(e){}if(!v||['light','dark','system'].indexOf(v)===-1)v='system';var resolved=v;if(v==='system')resolved=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme-choice',v);document.documentElement.setAttribute('data-theme',resolved)})()`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
