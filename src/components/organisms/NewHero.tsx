import React, { useEffect, useState, useMemo } from 'react'
import { graphql, useStaticQuery, navigate } from 'gatsby'
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
    <div className='relative flex min-h-screen items-center overflow-hidden bg-[#0b1122] text-[#f3f7ff]'>
      <Modal show={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Absolute positioned header elements */}
      <div className='absolute top-6 left-6 z-30'>
        <Logo className='w-[60px]' />
      </div>

      <div className='absolute top-6 right-6 z-50'>
        {/* <ButtonTop
          onClick={toggleGallery}
          text={galleryOpen ? "X" : "Galleria"}
          onClickScrolled={() => navigate('/galleria')}
          textScrolled='Ordina ora'
        /> */}

        <ButtonTop
          onClick={() => navigate('/galleria')}
          text={"Ordina"}
          onClickScrolled={() => navigate('/galleria')}
          textScrolled='Ordina ora'
        />
      </div>

      {galleryOpen && (
        <div className="absolute top-20 left-1/2 z-50 flex w-max -translate-x-1/2 scale-[.84] flex-wrap justify-center gap-4 rounded-xl border border-white/20 bg-[#0d1732]/95 p-4 text-[#f2f6ff] sm:scale-100">
          <p className='absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold uppercase tracking-[0.2em] text-[#aac0ef]'>Filtri</p>

          <div className="flex gap-2 flex-col items-center justify-center">
            <p className="mr-2 text-sm font-bold uppercase tracking-wide text-[#ffb170]">Collezioni</p>
            <div className="flex gap-2 flex-wrap">
              {collections.map(col => (
                <button
                  key={col}
                  onClick={() => toggleFilter(col)}
                  className={`rounded-md border px-3 py-1 text-sm font-semibold transition-colors ${selectedFilters.has(col) ? 'border-[#ffb170]/40 bg-gradient-to-r from-[#f97516] to-[#ff9d57] text-[#0b1122]' : 'border-white/25 text-[#e6eeff] hover:border-[#9ad0ff]/45'
                    }`}
                >
                  {col}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 flex-col items-center justify-center ml-4">
            <p className="mr-2 text-sm font-bold uppercase tracking-wide text-[#ffb170]">Formati</p>
            <div className="flex gap-2 flex-wrap">
              {formats.map(fmt => (
                <button
                  key={fmt}
                  onClick={() => toggleFilter(fmt)}
                  className={`rounded-md border px-3 py-1 text-sm font-semibold transition-colors ${selectedFilters.has(fmt) ? 'border-[#ffb170]/40 bg-gradient-to-r from-[#f97516] to-[#ff9d57] text-[#0b1122]' : 'border-white/25 text-[#e6eeff] hover:border-[#9ad0ff]/45'
                    }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Two-column layout (left column larger) */}
      <div className='grid w-full h-screen grid-rows-5 grid-cols-1 md:grid-rows-1 md:grid-cols-5  '>
        {/* Left column: Text & CTA (span 2 cols on md+) */}
        <div className='flex flex-col justify-center items-start px-6 row-span-3 md:col-span-3 md:px-12 lg:px-24 z-20 gap-8'>
          <div className='max-w-lg'>
            <h1 className="uuuk-reveal font-roboto font-extrabold text-4xl md:text-5xl lg:text-6xl leading-tight text-[#eef6ff]">
              Un UUUK unico,<br />
              <span className='text-[#f97516]'>progettato</span> intorno a te.
            </h1>
          </div>

          <div className="max-w-md space-y-2">
            <p className="text-sm font-medium text-[#e6eeff]">
              Personalizza il tuo diario!
            </p>
            <p className="text-xs font-light text-[#b8c5e6] leading-relaxed">
              Crea un diario che non sembri scelta da un catalogo, ma pensato da te e per te
            </p>
          </div>

          <div className=''>
            <Button href="/galleria" text='SCOPRI ORA' />
          </div>
        </div>

        {/* Right column: Showcase */}
        <div className={`flex md:flex items-center justify-center row-span-2 md:col-span-2 transition-all duration-300 ${galleryOpen ? 'z-40 opacity-100' : 'z-10 opacity-100'}`}>
          <Showcase data={filteredEdges} opened={false} openModal={() => navigate('/galleria')} />
        </div>
      </div>

      {/* Mobile overlay showcase */}
      {/* <div className={`absolute inset-0 flex md:hidden items-center justify-center transition-all duration-300 ${galleryOpen ? 'z-40 opacity-100 bg-[#0b1122]/95' : 'z-10 opacity-35 saturate-75 bg-transparent pointer-events-none'}`}>
        <Showcase data={filteredEdges} opened={false} openModal={() => navigate('/galleria')} />
      </div> */}
    </div>
  )
}

export default NewHero