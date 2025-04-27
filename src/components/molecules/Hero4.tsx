import React from 'react'
import Section from './Section'

const Hero4 = () => {
  const CoverIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>
  )

  const SidebarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
    </svg>
  )

  const TemplateIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75c0-.231-.035-.454-.1-.664M6.75 7.5H18a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25H6.75a2.25 2.25 0 0 1-2.25-2.25v-9a2.25 2.25 0 0 1 2.25-2.25Z" />
    </svg>
  )

  const cards = [
    {
      Icon: CoverIcon,
      title: "Personalized Covers",
      description: "Choose materials, colors, and add custom text or monograms for a unique first impression."
    },
    {
      Icon: SidebarIcon,
      title: "Configurable Sidebars",
      description: "Add widgets, quick links, calendars, or notes sections to your sidebar for easy access."
    },
    {
      Icon: TemplateIcon,
      title: "Diverse Page Templates",
      description: "Select from daily, weekly, monthly layouts, plus specialized templates for notes, habits, goals & more."
    }
  ]

  return (
    <Section id="section4" bgColor='bg-redBrick' shapeColor='text-black' preset='center'>
      {/* Customization Intro Section */}
      <section id="customize" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Endless Ways to Make It Yours</h2>
            <p className="text-lg text-beige max-w-3xl mx-auto">From the cover to the smallest detail, tailor every element to create an agenda that's a true extension of you.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {cards.map(({ Icon, title, description }, index) => (
              <div key={index} className="bg-beige p-8 rounded-xl shadow-sm hover:shadow-xl border border-transparent hover:border-amber-200 transition-all duration-300 transform hover:-translate-y-2 group">
                <div className="flex items-center justify-center bg-gradient-to-br from-amber-100 to-red-100 rounded-full w-16 h-16 mb-6 ring-4 ring-amber-500 group-hover:ring-brown transition-all duration-300">
                  <Icon className="w-8 h-8 text-amber-600 group-hover:text-red-600 transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-stone-900 mb-3">{title}</h3>
                <p className="text-stone-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Section>
  )
}

export default Hero4