import type { GatsbyConfig } from 'gatsby'
const path = require('path')

const config: GatsbyConfig = {
  siteMetadata: {
    title: `uuuk-site`,
    siteUrl: `https://www.yourdomain.tld`,
    keywords: [`innovation`, 'agenda', 'uuuk', 'creative', '3d print']
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
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
        path: './src/images/'
      },
      __key: 'images'
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
