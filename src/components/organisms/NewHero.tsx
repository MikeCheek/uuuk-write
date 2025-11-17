import React, { useEffect, useState } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import Hero3 from '../molecules/Hero3'
import Actions from '../atoms/Actions'
import Footer from '../molecules/Footer'
import Logo from "../../assets/loguuuk.svg"
import Typography from '../atoms/Typography'

const NewHero = () => {
  const [galleryOpen, setGalleryOpen] = useState(false)

  const toggleGallery = () => setGalleryOpen(!galleryOpen)

  const rawData = useStaticQuery(graphql`
    query {
      allFile(
        filter: {
          extension: { regex: "/(jpg|jpeg|png)/" }
          relativePath: { regex: "/collezioni\\//" }
        }
      ) {
        edges {
          node {
            childImageSharp {
              gatsbyImageData(
                placeholder: BLURRED
                layout: CONSTRAINED
              )
            }
            relativePath
            name
          }
        }
      }
    }
  `)

  const parseCollectionAndFormat = (relativePath: string): { collection: string; format: string } => {
    const normalized = relativePath.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '')
    const parts = normalized.split('/').filter(Boolean)
    if (parts.length < 4 || parts[0].toLowerCase() !== 'collezioni') {
      return { collection: '', format: '' }
    }
    return { collection: parts[1], format: parts[2] }
  }

  const [data] = useState(() => {
    const edges = [...rawData.allFile.edges]

    const modEdges = edges.map(e => {
      const { collection, format } = parseCollectionAndFormat(e.node.relativePath)
      return { ...e, collection, format }
    })

    for (let i = modEdges.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
        ;[modEdges[i], modEdges[j]] = [modEdges[j], modEdges[i]]
    }
    return { allFile: { modEdges } }
  })


  const filters = Array.from(new Set([
    ...data.allFile.modEdges.map(e => e.collection.toUpperCase()).filter(c => c),
    ...data.allFile.modEdges.map(e => e.format.toUpperCase()).filter(f => f)
  ]));

  const [selectedFilters, setSelectedFilters] = useState(new Set(filters));

  // Toggles for collections and formats
  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => {
      const upFilter = filter.toUpperCase();
      const updated = new Set(prev);
      if (updated.has(upFilter)) updated.delete(upFilter);
      else updated.add(upFilter);
      return updated;
    });
  };

  // Filter data according to selected filters
  const filteredEdges = data.allFile.modEdges.filter(e => selectedFilters.has(e.collection.toUpperCase()) && selectedFilters.has(e.format.toUpperCase()));

  const collections = filters.filter(f => !f.startsWith("A"))
  const formats = filters.filter(f => f.startsWith("A"))

  useEffect(() => {
    setSelectedFilters(new Set(filters));
  }, [galleryOpen]);

  return (
    <div className='relative h-full flex flex-col items-center justify-center gap-40'>
      <Logo className="absolute top-2 left-2 z-50"
        width={60} height={60} fill='#ecddbe' />
      <button onClick={toggleGallery} className="absolute cursor-none z-50 top-4 right-4 px-4 py-2 border border-transparent text-lg font-medium rounded-lg text-darkBrown bg-beige focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-amber-700 focus:ring-beige transition duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105">
        {galleryOpen ? "X" : "Gallery"}
      </button>

      {galleryOpen && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 flex flex-wrap justify-center gap-4 z-50 bg-black bg-opacity-70 p-3 rounded-lg">
          <div className="flex gap-2 flex-col items-center justify-center">
            <p className="text-beige font-semibold mr-2">Collezioni:</p>
            <div className="flex gap-2 flex-wrap">
              {collections.map(col => (
                <button
                  key={col}
                  onClick={() => toggleFilter(col)}
                  className={`px-3 py-1 rounded-md text-sm font-semibold border ${selectedFilters.has(col) ? 'bg-beige text-darkBrown border-darkBrown' : 'text-beige border-beige'
                    }`}
                >
                  {col}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 flex-col items-center justify-center ml-4">
            <p className="text-beige font-semibold mr-2">Formati:</p>
            <div className="flex gap-2 flex-wrap">
              {formats.map(fmt => (
                <button
                  key={fmt}
                  onClick={() => toggleFilter(fmt)}
                  className={`px-3 py-1 rounded-md text-sm font-semibold border ${selectedFilters.has(fmt) ? 'bg-beige text-darkBrown border-darkBrown' : 'text-beige border-beige'
                    }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <Typography variant="h1" className="uppercase mb-4 md:mb-60 -mt-20 text-beige [text-shadow:_0_10px_10px_#ecddbe22] w-full text-center opacity-100">
        Write your story
      </Typography>
      <Actions />
      <div className={`w-full h-screen flex items-center justify-center absolute top-0 left-0 transition-all duration-200 ${galleryOpen ? 'z-10 opacity-100 bg-black' : '-z-10 opacity-50 bg-transparent'}`}>
        <Hero3 data={filteredEdges} opened={galleryOpen} />
      </div>
      <div className='absolute w-full bottom-0 left-0 flex items-center justify-center'>
        <Footer />
      </div>
    </div>
  )
}

export default NewHero