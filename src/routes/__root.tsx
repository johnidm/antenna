import { createRootRoute } from '@tanstack/react-router'
import { NotFound } from '../components/ui/NotFound'
import { RootDocument } from '../components/ui/Root'
import { DEFAULT_META } from '../lib/constants/meta'

import appCss from '../styles.css?url'


export const Route = createRootRoute({
  head: () => ({
    meta: DEFAULT_META,
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
