const SITE_TITLE = 'Antenna: Where Radio Streaming Comes Alive'
const SITE_DESCRIPTION =
    'Tune in to curated live radio stations from around the world with Antenna.'

const SITE_URL = 'https://antenna.show'

const OG_IMAGE_PATH = '/logo/antenna-512.png'

const PAGE_URL = SITE_URL ?? '/'
const OG_IMAGE_URL = SITE_URL ? `${SITE_URL}${OG_IMAGE_PATH}` : OG_IMAGE_PATH



export const DEFAULT_META = [
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
];