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
};

export type Meta = ConcatArray<PropertyMetaObj | NameMetaObj>;

export type PropertyMetaObj = {
  property: string;
  content: string;
};

export type NameMetaObj = {
  name: string;
  content: string;
};

export type QueryTypes = {
  site: {
    siteMetadata: {
      title: string;
      description: string;
      author: string;
    };
  };
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
  sku
}: SeoProps) => {
  const { metadata, featuredImage } = useSiteMetadata();

  metadata.siteUrl = metadata.siteUrl.endsWith('/') ? metadata.siteUrl : metadata.siteUrl + '/';

  const seo = {
    title: title && pathname != '/' ? title + ' | ' + metadata.title : metadata.title,
    description: description || metadata.description,
    url: `${metadata.siteUrl}${pathname || ``}`,
    image: featuredImage?.childImageSharp?.gatsbyImageData,
    keywords: keywords || metadata.keywords,
  };

  const fallbackImage = seo.image?.images.fallback
  const mainImage = metadata.siteUrl + (fallbackImage?.src || "");

  const microData: any = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@context': 'https://www.schema.org',
        '@type': 'WebSite',
        url: seo.url,
        name: seo.title,
        description: seo.description,
        image: [metadata.siteUrl + fallbackImage?.src, ...images.map((image) => metadata.siteUrl + image)],
        inLanguage: 'IT',
      },
      {
        '@context': 'https://www.schema.org',
        '@type': 'Organization',
        name: metadata.title,
        url: metadata.siteUrl,
        logo: metadata.siteUrl + fallbackImage?.src,
        description: metadata.description,
      },
    ],
  };

  if (price) {
    microData['@graph'].push({
      '@type': 'Product',
      name: title,
      description: seo.description,
      image: [mainImage, ...images.map((img) => (img.startsWith('http') ? img : metadata.siteUrl + img))],
      sku: sku || pathname?.split('/').pop(),
      brand: {
        '@type': 'Brand',
        name: 'UUUK',
      },
      aggregateRating: {
        // '@type': 'AggregateRating',
        // ratingValue: '4.5',
        // reviewCount: '1',
      },
      review: [
        // {
        //   '@type': 'Review',
        //   reviewRating: {
        //     '@type': 'Rating',
        //     ratingValue: '5',
        //   },
        //   author: {
        //     '@type': 'Person',
        //     name: 'Customer',
        //   },
        //   reviewBody: 'Great product!',
        // },
      ],
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: currency,
        price: price,
        lowPrice: price,
        highPrice: price,
        offerCount: '1',
        url: seo.url,
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
      },
    });
  }

  return (
    <>
      <html lang={lang} />
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      <meta name="image" content={metadata.siteUrl + fallbackImage?.src} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:locale" content={'it_IT'} />
      <meta property="og:image" content={metadata.siteUrl + fallbackImage?.src} />
      <meta property="og:image:type" content={'image/jpg'} />
      <meta property="og:image:alt" content={seo.title} />
      <meta property="og:image:secure_url" content={metadata.siteUrl + fallbackImage?.src} />
      <meta property="og:image:width" content={`${seo.image?.width ?? '1200'}`} />
      <meta property="og:image:height" content={`${seo.image?.height ?? '630'}`} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:site_name" content={seo.title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={'website'} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:url" content={seo.url} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={metadata.siteUrl + fallbackImage?.src} />

      <meta name="robots" content="max-image-preview:large" />

      {structuredData ? <Script type="application/ld+json">{JSON.stringify(microData)}</Script> : <></>}
      {noIndex ? <meta name="robots" content="noindex,nofollow" /> : <></>}

      {/* <link rel="dns-prefetch" href="https://static.mailerlite.com/" /> */}
      {/* <link rel="dns-prefetch" href="https://www.googletagmanager.com" /> */}
      {/* <link rel="dns-prefetch" href="https://assets.mlcdn.com" /> */}
      {/* <link rel="preconnect" href="https://static.mailerlite.com/" /> */}
      {/* <link rel="preconnect" href="https://www.googletagmanager.com" /> */}
      {/* <link rel="preconnect" href="https://assets.mlcdn.com" /> */}

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com"
      // crossOrigin='anonymous'
      />

      <link href="https://fonts.googleapis.com/css2?family=Calligraffitti&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      {/* <meta name="twitter:creator" content={seo.twitterUsername} /> */}
      {children}
    </>
  );
};

export default Index;