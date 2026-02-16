import React, { useEffect, useState, useMemo } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import Showcase from '../molecules/Showcase'
import Button from '../atoms/Button'
import Typography from '../atoms/Typography'
import Modal from '../atoms/Modal'
import Logo from '../atoms/Logo'
import ButtonTop from '../atoms/ButtonTop'

const NewHero = () => {
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

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

    const additional = modEdges
      .filter(e => (e.format || '').toUpperCase() === 'A6')
      .map(e => ({ ...e, format: 'A5' }));

    modEdges.push(...additional);
    return { allFile: { modEdges } }
  })

  // Pre-calculate filter lists
  const collections = useMemo(() => Array.from(new Set(data.allFile.modEdges.map(e => e.collection.toUpperCase()).filter(Boolean))), [data]);
  const formats = useMemo(() => Array.from(new Set(data.allFile.modEdges.map(e => e.format.toUpperCase()).filter(Boolean))), [data]);
  const allFiltersInitial = [...collections, ...formats];

  const initialFilters = ["A5", "TRIADIC"];
  const [selectedFilters, setSelectedFilters] = useState(new Set(allFiltersInitial));
  // Track order of clicks to handle "Show first those elements" logic
  const [filterPriority, setFilterPriority] = useState<string[]>([]);

  const toggleFilter = (filter: string) => {
    const upFilter = filter.toUpperCase();
    const isFormat = formats.includes(upFilter);

    setSelectedFilters(prev => {
      const updated = new Set(prev);

      if (updated.has(upFilter)) {
        // Prevent removal if it's the last one in its category
        const categoryGroup = isFormat ? formats : collections;
        const activeInCategory = categoryGroup.filter(f => updated.has(f));

        if (activeInCategory.length <= 1) return prev; // Do nothing

        updated.delete(upFilter);
        setFilterPriority(prevPrio => prevPrio.filter(f => f !== upFilter));
      } else {
        updated.add(upFilter);
        // Add to the end of priority list (last clicked = highest priority)
        setFilterPriority(prevPrio => [...prevPrio.filter(f => f !== upFilter), upFilter]);
      }
      return updated;
    });
  };

  const filteredEdges = useMemo(() => {
    return data.allFile.modEdges
      .filter(e => selectedFilters.has(e.collection.toUpperCase()) && selectedFilters.has(e.format.toUpperCase()))
      .sort((a, b) => {
        // Sort by priority (most recently toggled filters first)
        const reversedPrio = [...filterPriority].reverse();
        for (const filt of reversedPrio) {
          const aMatches = a.collection.toUpperCase() === filt || a.format.toUpperCase() === filt;
          const bMatches = b.collection.toUpperCase() === filt || b.format.toUpperCase() === filt;
          if (aMatches !== bMatches) return aMatches ? -1 : 1;
        }
        // Secondary sort: Alphabetical
        if (a.format !== b.format) return a.format.localeCompare(b.format);
        if (a.collection !== b.collection) return a.collection.localeCompare(b.collection);
        return a.node.name.localeCompare(b.node.name);
      });
  }, [selectedFilters, filterPriority, data]);

  useEffect(() => {
    if (galleryOpen) {
      setSelectedFilters(new Set(initialFilters));
      setFilterPriority(initialFilters);
    } else {
      setSelectedFilters(new Set(allFiltersInitial));
      setFilterPriority([]);
    }
  }, [galleryOpen]);

  return (
    <div className='relative h-full flex flex-col items-center justify-center gap-40'>
      <Modal show={modalOpen} onClose={() => setModalOpen(false)} />

      <Logo className='w-[60px]' />

      <ButtonTop
        onClick={toggleGallery}
        text={galleryOpen ? "X" : "Galleria"}
        onClickScrolled={() => setModalOpen(true)}
        textScrolled='Ordina ora'
      />

      {galleryOpen && (
        <div className="absolute w-max scale-[.8] sm:scale-100 top-16 left-1/2 border-2 text-beige border-beige transform -translate-x-1/2 flex flex-wrap justify-center gap-4 z-50 bg-black bg-opacity-70 p-3 rounded-lg">
          <p className='absolute -top-8 left-1/2 -translate-x-1/2'>Filtri</p>

          <div className="flex gap-2 flex-col items-center justify-center">
            <p className="font-semibold mr-2">Collezioni:</p>
            <div className="flex gap-2 flex-wrap">
              {collections.map(col => (
                <button
                  key={col}
                  onClick={() => toggleFilter(col)}
                  className={`px-3 py-1 rounded-md text-sm font-semibold border transition-colors ${selectedFilters.has(col) ? 'bg-beige text-darkBrown border-darkBrown' : 'text-beige border-beige'
                    }`}
                >
                  {col}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 flex-col items-center justify-center ml-4">
            <p className="font-semibold mr-2">Formati:</p>
            <div className="flex gap-2 flex-wrap">
              {formats.map(fmt => (
                <button
                  key={fmt}
                  onClick={() => toggleFilter(fmt)}
                  className={`px-3 py-1 rounded-md text-sm font-semibold border transition-colors ${selectedFilters.has(fmt) ? 'bg-beige text-darkBrown border-darkBrown' : 'text-beige border-beige'
                    }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <Typography variant="h1" className="uppercase mb-4 md:mb-0 mt-20 text-beige font-roboto font-medium [text-shadow:_0_10px_10px_#1a1615ee] w-full text-center opacity-100">
        Write your story
      </Typography>

      <Button onClick={() => setModalOpen(true)} />

      <div className={`w-full h-[95vh] md:h-screen flex items-center justify-center absolute top-0 left-0 transition-all duration-200 ${galleryOpen ? 'z-10 opacity-100 bg-black' : '-z-10 opacity-40 bg-transparent'}`}>
        <Showcase data={filteredEdges} opened={galleryOpen} openModal={() => setModalOpen(true)} />
      </div>
    </div>
  )
}

export default NewHero