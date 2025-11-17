import type { GatsbyConfig } from 'gatsby'
const path = require('path')

const siteUrl = `https://uuuk.netlify.app/`
const config: GatsbyConfig = {
  siteMetadata: {
    title: `UUUK | Write your story`,
    siteUrl: siteUrl,
    keywords: [`innovation`, 'agenda', 'uuuk', 'creative', '3d print']
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
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: 'src/images/icon.png'
      }
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
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
    {
      resolve: `gatsby-plugin-react-i18next`,
      options: {
        localeJsonSourceName: `locale`, // name given to `gatsby-source-filesystem` plugin.
        languages: [`en`, `it`],
        defaultLanguage: `it`,
        siteUrl: siteUrl,
        // if you are using trailingSlash gatsby config include it here, as well (the default is 'always')
        trailingSlash: 'always',
        // you can pass any i18next options
        i18nextOptions: {
          interpolation: {
            escapeValue: false // not needed for react as it escapes by default
          },
          keySeparator: false,
          nsSeparator: false
        },
        pages: [
          // {
          //   matchPath: '/:lang?/blog/:uid',
          //   getLanguageFromPath: true,
          //   excludeLanguages: ['es'],
          // },
          // {
          //   matchPath: '/preview',
          //   languages: ['en'],
          // },
        ]
      }
    },
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: path.resolve(__dirname, 'src/assets')
        }
      }
    }
  ]
}

export default config
