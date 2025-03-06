import { GatsbyNode } from 'gatsby'
import { resolve } from 'path'

export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] =
  ({ stage, loaders, actions }) => {
    const { createTypes } = actions
    createTypes(`
    type SitePage implements Node {
      context: SitePageContext
    }
    type SitePageContext {
      i18n: i18nContext
    }
    type i18nContext {
        language: String,
        languages: [String],
        defaultLanguage: String,
        originalPath: String
        routed: Boolean
    }
  `)
    // if (stage === 'build-html' || stage === 'develop-html') {
    //   actions.setWebpackConfig({
    //     module: {
    //       rules: [
    //         {
    //           test: /react-p5/,
    //           use: (loaders as any).null(),
    //         },
    //       ],
    //     },
    //   });
    // }
  }
