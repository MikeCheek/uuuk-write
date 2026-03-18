import React from 'react';
import { Script } from 'gatsby';
import useSiteMetadata from '../../utilities/useSiteMetadata';

export type SeoProps = {
  description?: string;
  lang?: string;
  title: string;
  children?: React.ReactElement;
  pathname?: string;
  structuredData?: boolean;
  keywords?: string;
  noIndex?: boolean;
  images?: string[];
  bgColor?: string;
  price?: number;
  currency?: string;
  sku?: string;
  type?: 'website' | 'article' | 'product';
};

const Index = ({
  lang = 'it',
  title,
  description,
  pathname,
  children,
  structuredData = false,
  keywords,
  noIndex,
  images = [],
  price,
  currency = 'EUR',
  sku,
  type = 'website'
}: SeoProps) => {
  const { metadata, featuredImage } = useSiteMetadata();

  // Ensure siteUrl always ends with a slash for consistent path building
  const siteUrl = metadata.siteUrl.endsWith('/') ? metadata.siteUrl : `${metadata.siteUrl}/`;

  const seo = {
    title: title && pathname !== '/' ? `${title} | ${metadata.title}` : metadata.title,
    description:
      description ||
      metadata.description ||
      "UUUK crea agende stampate in 3D personalizzabili: scegli formato, copertina e moduli per realizzare la tua agenda unica.",
    url: `${siteUrl}${pathname?.replace(/^\//, '') || ''}`, // Prevents double slashes like https://uuuk.it//prodotto
    image: featuredImage?.childImageSharp?.gatsbyImageData,
    keywords: keywords || metadata.keywords?.join(', '),
  };

  const fallbackImageSrc = seo.image?.images?.fallback?.src || "";

  // Safely determine the main image
  let mainImage = `${siteUrl}${fallbackImageSrc.replace(/^\//, '')}`;
  if (images.length > 0 && images[0]) {
    mainImage = images[0].startsWith('http') ? images[0] : `${siteUrl}${images[0].replace(/^\//, '')}`;
  }

  // Structured data graph for richer Search features.
  const microData: any = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}#website`,
        url: siteUrl,
        name: metadata.title,
        description: metadata.description,
        inLanguage: lang,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}galleria`,
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'Organization',
        '@id': `${siteUrl}#organization`,
        name: metadata.title,
        url: siteUrl,
        logo: `${siteUrl}${fallbackImageSrc.replace(/^\//, '')}`,
        description: metadata.description,
      },
      {
        '@type': 'WebPage',
        '@id': `${seo.url}#webpage`,
        url: seo.url,
        name: seo.title,
        description: seo.description,
        inLanguage: lang,
        isPartOf: {
          '@id': `${siteUrl}#website`
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: mainImage
        }
      }
    ],
  };

  if (price) {
    const productSchema: any = {
      '@type': 'Product',
      name: title,
      description: seo.description,
      image: [
        mainImage,
        ...images.map((img) => (img.startsWith('http') ? img : `${siteUrl}${img.replace(/^\//, '')}`))
      ],
      sku: sku || pathname?.split('/').filter(Boolean).pop(),
      brand: {
        '@type': 'Brand',
        name: 'UUUK',
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: currency,
        price: price,
        url: seo.url,
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: '0',
            currency: currency,
          },
          shippingDestination: {
            '@type': 'DefinedRegion',
            addressCountry: 'IT',
          },
        },
      },
    };

    microData['@graph'].push(productSchema);
  }

  return (
    <>
      <html lang={lang} />
      <title>{seo.title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={seo.description} />
      {seo.keywords && <meta name="keywords" content={seo.keywords} />}
      <meta name="image" content={mainImage} />
      <link rel="canonical" href={seo.url} />
      <link rel="alternate" hrefLang={lang} href={seo.url} />
      <link rel="alternate" hrefLang="x-default" href={siteUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={seo.title} />
      <meta property="og:locale" content={lang === 'it' ? 'it_IT' : 'en_US'} />
      <meta property="og:image" content={mainImage} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:alt" content={seo.title} />
      <meta property="og:image:secure_url" content={mainImage} />
      {seo.image?.width && <meta property="og:image:width" content={`${seo.image.width}`} />}
      {seo.image?.height && <meta property="og:image:height" content={`${seo.image.height}`} />}
      <meta property="og:url" content={seo.url} />
      <meta property="og:site_name" content={metadata.title} />

      {/* 2. Fixed og:description fallback */}
      <meta property="og:description" content={seo.description} />
      <meta property="og:type" content={price ? 'product' : type} />

      {/* Twitter - 3. Upgraded to summary_large_image */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:url" content={seo.url} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={mainImage} />

      {/* Robots Control */}
      {noIndex ? (
        <>
          <meta name="robots" content="noindex,nofollow,noarchive" />
          <meta name="googlebot" content="noindex,nofollow,noarchive" />
        </>
      ) : (
        <>
          <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
          <meta name="googlebot" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
        </>
      )}

      {/* JSON-LD Script */}
      {structuredData && (
        <Script type="application/ld+json">{JSON.stringify(microData)}</Script>
      )}

      {/* 4. Restored crossOrigin for proper Font Loading */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Calligraffitti&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />

      {children}
    </>
  );
};

export default Index;