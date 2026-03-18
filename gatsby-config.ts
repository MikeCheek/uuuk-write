import type { GatsbyConfig } from 'gatsby'
import { siteUrl } from './src/utilities/useSiteMetadata'
const path = require('path')

const config: GatsbyConfig = {
  siteMetadata: {
    title: `UUUK | Agenda stampata 3D personalizzabile`,
    description: `UUUK crea agende stampate in 3D personalizzabili: scegli formato, copertina e moduli per realizzare la tua agenda unica, prodotta in Italia.`,
    siteUrl: siteUrl,
    keywords: [
      'agenda stampata 3d',
      'agenda stampata in 3d',
      'agenda personalizzabile',
      'agenda 3d',
      'planner personalizzato',
      'uuuk'
    ]
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  flags: {
    DEV_SSR: true
  },
  plugins: [
    'gatsby-plugin-postcss',
    // 'gatsby-plugin-google-gtag',
    'gatsby-plugin-image',
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        output: '/sitemap.xml',
        excludes: [
          '/404',
          '/404.html',
          '/carrello',
          '/grazie',
          '/arena',
          '/ordini/**'
        ]
      }
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: 'src/images/icon.png'
      }
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: siteUrl,
        sitemap: `${siteUrl}/sitemap.xml`,
        policy: [
          {
            userAgent: '*',
            allow: '/'
          },
          {
            userAgent: '*',
            disallow: ['/api/', '/carrello', '/grazie', '/arena', '/ordini/']
          }
        ]
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`
      },
      __key: 'images'
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/locales`,
        name: `locale`
      }
    },
    // {
    //   resolve: `gatsby-plugin-react-i18next`,
    //   options: {
    //     localeJsonSourceName: `locale`, // name given to `gatsby-source-filesystem` plugin.
    //     languages: [`en`, `it`],
    //     defaultLanguage: `it`,
    //     siteUrl: siteUrl,
    //     // if you are using trailingSlash gatsby config include it here, as well (the default is 'always')
    //     trailingSlash: 'always',
    //     // you can pass any i18next options
    //     i18nextOptions: {
    //       interpolation: {
    //         escapeValue: false // not needed for react as it escapes by default
    //       },
    //       keySeparator: false,
    //       nsSeparator: false
    //     },
    //     pages: [
    //       // {
    //       //   matchPath: '/:lang?/blog/:uid',
    //       //   getLanguageFromPath: true,
    //       //   excludeLanguages: ['es'],
    //       // },
    //       // {
    //       //   matchPath: '/preview',
    //       //   languages: ['en'],
    //       // },
    //     ]
    //   }
    // },
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: path.resolve(__dirname, 'src/assets'),
          options: {
            svgo: false,
            // Add SVGR options to avoid defaultProps
            svgr: {
              icon: true,
              native: false,
              svgo: false,
              // Don't use defaultProps - use native default parameters instead
              exportType: 'default',
              ref: true,
              memo: false,
              replaceAttrValues: {},
              expandProps: 'end',
              titleProp: false,
              descProp: false,
              jsx: {
                babelConfig: {
                  plugins: []
                }
              }
            }
          }
        }
      }
    },
    {
      resolve: 'gatsby-plugin-google-tagmanager',
      options: {
        id: 'GTM-M9MR7CVS',

        // Include GTM in development.
        //
        // Defaults to false meaning GTM will only be loaded in production.
        includeInDevelopment: false,

        // datalayer to be set before GTM is loaded
        // should be an object or a function that is executed in the browser
        //
        // Defaults to null
        defaultDataLayer: { platform: 'gatsby' },

        // Specify optional GTM environment details.
        // gtmAuth: "YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_AUTH_STRING",
        // gtmPreview: "YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_PREVIEW_NAME",
        // dataLayerName: "YOUR_DATA_LAYER_NAME",

        // Name of the event that is triggered
        // on every Gatsby route change.
        //
        // Defaults to gatsby-route-change
        routeChangeEventName: 'route-change',
        // Defaults to false
        enableWebVitalsTracking: true
        // Defaults to https://www.googletagmanager.com
        // selfHostedOrigin: "YOUR_SELF_HOSTED_ORIGIN",
        // Defaults to gtm.js
        // selfHostedPath: "YOUR_SELF_HOSTED_PATH",
      }
    }
  ]
}

export default config
