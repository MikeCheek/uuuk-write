import { graphql, useStaticQuery } from 'gatsby'
import { IGatsbyImageData } from 'gatsby-plugin-image'

type SiteMetadata = {
  title: string
  description: string
  siteUrl: string
  keywords: string[]
}

type QueryResult = {
  site: {
    siteMetadata: SiteMetadata
  }
  featuredImage: {
    childImageSharp: {
      gatsbyImageData: IGatsbyImageData
    }
  }
}

const siteUrl = `https://uuuk.it`

const useSiteMetadata = (): {
  metadata: SiteMetadata
  featuredImage: QueryResult['featuredImage']
} => {
  const data = useStaticQuery<QueryResult>(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          siteUrl
          keywords
        }
      }
      featuredImage: file(absolutePath: { glob: "**/src/images/logo.png" }) {
        childImageSharp {
          gatsbyImageData(layout: FIXED, width: 720)
        }
      }
    }
  `)

  // featuredImage: file(absolutePath: { glob: "**/src/images/logo-og.jpg" }) {
  //   childImageSharp {
  //     gatsbyImageData(layout: FIXED, width: 1200)
  //   }
  // }

  return { metadata: data.site.siteMetadata, featuredImage: data.featuredImage }
}

export default useSiteMetadata
export { siteUrl }
