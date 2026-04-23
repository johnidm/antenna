import { HeadContent, Link, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import Header from '../components/Header'
import { Player } from '../components/Player'
import { PlayerProvider } from '../lib/playerContext'
import { SearchProvider } from '../lib/searchContext'

import appCss from '../styles.css?url'

// TODO Move the const to a file `lib/constants.ts`

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`
const SITE_TITLE = 'Antenna: Where Radio Streaming Comes Alive'
const SITE_DESCRIPTION =
  'Tune in to curated live radio stations from around the world with Antenna.'
const OG_IMAGE_PATH = '/logo/antenna-512.png'
const SITE_URL = 'https://antenna.show'
const PAGE_URL = SITE_URL ?? '/'
const OG_IMAGE_URL = SITE_URL ? `${SITE_URL}${OG_IMAGE_PATH}` : OG_IMAGE_PATH

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: SITE_TITLE,
      },
      {
        name: 'description',
        content: SITE_DESCRIPTION,
      },
      {
        property: 'og:title',
        content: SITE_TITLE,
      },
      {
        property: 'og:description',
        content: SITE_DESCRIPTION,
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:url',
        content: PAGE_URL,
      },
      {
        property: 'og:image',
        content: OG_IMAGE_URL,
      },
      {
        property: 'og:image:alt',
        content: 'Antenna logo',
      },
      {
        name: 'twitter:card',
        content: 'summary',
      },
      {
        name: 'twitter:title',
        content: SITE_TITLE,
      },
      {
        name: 'twitter:description',
        content: SITE_DESCRIPTION,
      },
      {
        name: 'twitter:image',
        content: OG_IMAGE_URL,
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})


// Create a file for each componement
function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-fg-muted">
        Signal lost
      </p>
      <h1 className="font-mono text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
        404 — Page not found
      </h1>
      <p className="max-w-md text-sm text-fg-muted">
        The frequency you were tuning to does not exist. Try returning to the main dial.
      </p>
      <Link
        to="/"
        className="mt-2 rounded-sm border border-border px-4 py-2 font-mono text-xs uppercase tracking-widest text-fg transition-colors hover:border-fg"
      >
        Back to stations
      </Link>
    </main>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="min-h-screen flex flex-col pb-20 sm:pb-24">
        <SearchProvider>
          <PlayerProvider>
            <Header />
            <div className="flex-1 mx-auto w-full max-w-5xl px-3 py-6 sm:px-6 sm:py-10 lg:py-12">
              {children}
            </div>
            <Player />
          </PlayerProvider>
        </SearchProvider>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
