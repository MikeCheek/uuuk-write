import React, { useState, useEffect } from 'react';

// Icon Components (using warm colors)
const CoverIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
  </svg>
);

const SidebarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
  </svg>
);

const TemplateIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75c0-.231-.035-.454-.1-.664M6.75 7.5H18a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25H6.75a2.25 2.25 0 0 1-2.25-2.25v-9a2.25 2.25 0 0 1 2.25-2.25Z" />
  </svg>
);

const ModuleIconWarm: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
  </svg>
);

const CheckIconWarm: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
);


const Presentation: React.FC = () => {
  const [year, setYear] = useState<number | null>(null)

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  return (
    <>
      <title>Creative Agenda | Craft Your Unique Planner</title>
      <meta name="description" content="Design a truly personal agenda with customizable covers, layouts, sidebars, and creative modules. Plan with passion." />
      <link rel="icon" href="/favicon.ico" />

      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-red-50 to-orange-100 text-stone-800 font-sans">
        {/* Navigation */}
        <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-red-600">CreativeAgenda</span>
              </div>
              <div className="flex items-center space-x-4">
                <a href="#customize" className="text-stone-600 hover:text-amber-700 transition duration-150 ease-in-out text-sm font-medium">Customize</a>
                <a href="#creativity" className="text-stone-600 hover:text-amber-700 transition duration-150 ease-in-out text-sm font-medium">Creativity</a>
                <a href="#testimonials" className="text-stone-600 hover:text-amber-700 transition duration-150 ease-in-out text-sm font-medium">Testimonials</a>
                <button className="px-5 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition duration-150 ease-in-out shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                  Start Crafting
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 overflow-hidden">
          {/* Subtle background elements */}
          <div className="absolute inset-0 -z-10 opacity-20">
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-amber-200 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-red-200 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-2000"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-stone-900 leading-tight mb-6">
              Your Vision, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-red-600">Your Agenda</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-stone-600 mb-10">
              Go beyond standard planners. Build an agenda that reflects your style, fuels your creativity, and organizes your life with unparalleled personalization.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
              <button className="px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto">
                Design Your Agenda
              </button>
              <button className="px-8 py-3 border border-amber-300 text-base font-medium rounded-lg text-amber-700 bg-white hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition duration-150 ease-in-out shadow-sm hover:shadow-md w-full sm:w-auto">
                See Customizations
              </button>
            </div>
            {/* Enhanced Placeholder for Agenda Visual */}
            <div className="mt-12 max-w-4xl mx-auto group perspective">
              <div className="bg-white border border-stone-200 rounded-xl w-full h-64 md:h-96 flex items-center justify-center text-stone-400 shadow-lg group-hover:shadow-2xl transition-all duration-500 ease-out overflow-hidden relative transform group-hover:rotate-x-4 group-hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-transparent to-red-100 opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
                <span className="text-xl font-medium z-10">Visualize Your Perfect Planner</span>
                {/* Subtle 3D effect element */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-red-200/50 rounded-lg blur-lg group-hover:scale-125 transition-transform duration-500"></div>
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-amber-200/50 rounded-full blur-md group-hover:scale-110 transition-transform duration-500"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Customization Intro Section */}
        <section id="customize" className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Endless Ways to <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-red-600">Make It Yours</span></h2>
              <p className="text-lg text-stone-600 max-w-3xl mx-auto">From the cover to the smallest detail, tailor every element to create an agenda that's a true extension of you.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {/* Feature Card 1: Cover */}
              <div className="bg-stone-50 p-8 rounded-xl shadow-sm hover:shadow-xl border border-transparent hover:border-amber-200 transition-all duration-300 transform hover:-translate-y-2 group">
                <div className="flex items-center justify-center bg-gradient-to-br from-amber-100 to-red-100 rounded-full w-16 h-16 mb-6 ring-4 ring-white group-hover:ring-amber-100 transition-all duration-300">
                  <CoverIcon className="w-8 h-8 text-amber-600 group-hover:text-red-600 transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-stone-900 mb-3">Personalized Covers</h3>
                <p className="text-stone-600">Choose materials, colors, and add custom text or monograms for a unique first impression.</p>
              </div>
              {/* Feature Card 2: Sidebar */}
              <div className="bg-stone-50 p-8 rounded-xl shadow-sm hover:shadow-xl border border-transparent hover:border-amber-200 transition-all duration-300 transform hover:-translate-y-2 group">
                <div className="flex items-center justify-center bg-gradient-to-br from-amber-100 to-red-100 rounded-full w-16 h-16 mb-6 ring-4 ring-white group-hover:ring-amber-100 transition-all duration-300">
                  <SidebarIcon className="w-8 h-8 text-amber-600 group-hover:text-red-600 transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-stone-900 mb-3">Configurable Sidebars</h3>
                <p className="text-stone-600">Add widgets, quick links, calendars, or notes sections to your sidebar for easy access.</p>
              </div>
              {/* Feature Card 3: Templates */}
              <div className="bg-stone-50 p-8 rounded-xl shadow-sm hover:shadow-xl border border-transparent hover:border-amber-200 transition-all duration-300 transform hover:-translate-y-2 group">
                <div className="flex items-center justify-center bg-gradient-to-br from-amber-100 to-red-100 rounded-full w-16 h-16 mb-6 ring-4 ring-white group-hover:ring-amber-100 transition-all duration-300">
                  <TemplateIcon className="w-8 h-8 text-amber-600 group-hover:text-red-600 transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-stone-900 mb-3">Diverse Page Templates</h3>
                <p className="text-stone-600">Select from daily, weekly, monthly layouts, plus specialized templates for notes, habits, goals & more.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Customization Section: Page Templates */}
        <section className="py-16 md:py-24 bg-amber-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
              <div className="mb-10 lg:mb-0">
                <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-5">Layouts for <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-red-600">Every Need</span></h2>
                <p className="text-lg text-stone-700 mb-8">
                  Structure your days, weeks, and months exactly how you want. Mix and match templates to build the perfect planning system for your life and work.
                </p>
                <div className="space-y-3 text-stone-600">
                  <p><strong className="font-semibold text-stone-800">Daily Views:</strong> Detailed scheduling, task lists, reflection prompts.</p>
                  <p><strong className="font-semibold text-stone-800">Weekly Overviews:</strong> Goal setting, habit tracking, weekly summaries.</p>
                  <p><strong className="font-semibold text-stone-800">Monthly Calendars:</strong> Long-term planning, event tracking, deadline management.</p>
                  <p><strong className="font-semibold text-stone-800">Creative Spaces:</strong> Dot grid, lined, blank pages for notes and sketches.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                {/* Placeholder Template Visuals */}
                <div className="bg-white rounded-lg shadow-md p-4 border border-stone-200 aspect-square flex items-center justify-center text-stone-400 text-sm transform hover:scale-105 transition-transform duration-300">Daily Layout</div>
                <div className="bg-white rounded-lg shadow-md p-4 border border-stone-200 aspect-square flex items-center justify-center text-stone-400 text-sm transform hover:scale-105 transition-transform duration-300">Weekly Goals</div>
                <div className="bg-white rounded-lg shadow-md p-4 border border-stone-200 aspect-square flex items-center justify-center text-stone-400 text-sm transform hover:scale-105 transition-transform duration-300">Monthly Calendar</div>
                <div className="bg-white rounded-lg shadow-md p-4 border border-stone-200 aspect-square flex items-center justify-center text-stone-400 text-sm transform hover:scale-105 transition-transform duration-300">Dot Grid Notes</div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Customization Section: Modules */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
              <div className="flex justify-center items-center order-last lg:order-first mb-10 lg:mb-0">
                {/* Placeholder Module Visual */}
                <div className="bg-stone-100 rounded-xl shadow-lg w-full max-w-lg h-72 md:h-96 flex items-center justify-center text-stone-400 border border-stone-200 p-6 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-transparent to-red-100 opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <span className="text-xl font-medium z-10 text-center">Drag & Drop Module Integration (Concept)</span>
                  {/* Floating elements */}
                  <div className="absolute top-10 left-10 w-16 h-16 bg-amber-300/50 rounded-full blur-sm animate-pulse"></div>
                  <div className="absolute bottom-10 right-10 w-20 h-20 bg-red-300/50 rounded-lg blur-md animate-pulse animation-delay-1000"></div>
                </div>
              </div>
              <div className="order-first lg:order-last">
                <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-5">Plug-and-Play <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-red-600">Functionality</span></h2>
                <p className="text-lg text-stone-700 mb-8">
                  Enhance your agenda with specialized modules. Add, remove, and rearrange sections dedicated to specific tasks and creative pursuits.
                </p>
                <ul className="space-y-5 text-stone-700">
                  <li className="flex items-start">
                    <ModuleIconWarm className="w-6 h-6 text-amber-500 mr-3 flex-shrink-0 mt-1" />
                    <span><strong className="font-semibold text-stone-800">Brainstorming Hub:</strong> Mind maps, idea lists, visual thinking tools.</span>
                  </li>
                  <li className="flex items-start">
                    <ModuleIconWarm className="w-6 h-6 text-amber-500 mr-3 flex-shrink-0 mt-1" />
                    <span><strong className="font-semibold text-stone-800">Goal Tracker:</strong> Set objectives, track progress, celebrate milestones.</span>
                  </li>
                  <li className="flex items-start">
                    <ModuleIconWarm className="w-6 h-6 text-amber-500 mr-3 flex-shrink-0 mt-1" />
                    <span><strong className="font-semibold text-stone-800">Habit Builder:</strong> Monitor daily routines and build positive habits.</span>
                  </li>
                  <li className="flex items-start">
                    <ModuleIconWarm className="w-6 h-6 text-amber-500 mr-3 flex-shrink-0 mt-1" />
                    <span><strong className="font-semibold text-stone-800">Sketch Pad:</strong> Simple drawing tools for quick visual notes.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>


        {/* Creativity Section */}
        <section id="creativity" className="py-16 md:py-24 bg-gradient-to-b from-red-50 to-orange-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-5">Where Order Sparks <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-red-600">Imagination</span></h2>
                <p className="text-lg text-stone-700 mb-8">
                  A personalized structure doesn't limit creativity—it cultivates it. By organizing the essentials, you create the mental space needed for inspiration to strike and ideas to flow freely.
                </p>
                <ul className="space-y-5 text-stone-700">
                  <li className="flex items-start">
                    <CheckIconWarm className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
                    <span>Clear the mental clutter that hinders focus.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIconWarm className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
                    <span>Designate specific time and space for creative work.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIconWarm className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
                    <span>Capture and nurture ideas before they fade.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-10 lg:mt-0 flex justify-center items-center">
                {/* Placeholder for Creativity Visual */}
                <div className="bg-white rounded-xl shadow-xl w-full max-w-lg h-72 md:h-96 flex items-center justify-center text-stone-400 border border-stone-200 p-6 relative overflow-hidden group">
                  <div className="absolute -inset-12 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20800%22%3E%3Cdefs%3E%3Cfilter%20id%3D%22b%22%20x%3D%22-20%25%22%20y%3D%22-20%25%22%20width%3D%22140%25%22%20height%3D%22140%25%22%20filterUnits%3D%22objectBoundingBox%22%20primitiveUnits%3D%22userSpaceOnUse%22%20color-interpolation-filters%3D%22sRGB%22%3E%3CfeGaussianBlur%20stdDeviation%3D%2250%22%20x%3D%220%25%22%20y%3D%220%25%22%20width%3D%22100%25%22%20height%3D%22100%25%22%20in%3D%22SourceGraphic%22%20edgeMode%3D%22none%22%20result%3D%22blur%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Cg%20filter%3D%22url(%23b)%22%3E%3Ccircle%20r%3D%22150%22%20cx%3D%22400%22%20cy%3D%22400%22%20fill%3D%22%23fcd34d%22%2F%3E%3Ccircle%20r%3D%22150%22%20cx%3D%22550%22%20cy%3D%22250%22%20fill%3D%22%23fca5a5%22%2F%3E%3Ccircle%20r%3D%22150%22%20cx%3D%22250%22%20cy%3D%22550%22%20fill%3D%22%23fed7aa%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')] bg-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500 animate-pulse"></div>
                  <span className="text-xl font-medium z-10 text-center">Planning Fuels Passion</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Hear From Our Community</h2>
              <p className="text-lg text-stone-600 max-w-2xl mx-auto">Discover how CreativeAgenda empowers diverse individuals.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Testimonial Card 1 */}
              <div className="bg-stone-50 p-6 rounded-lg shadow-sm border border-stone-100 transform transition duration-300 hover:scale-[1.03] hover:shadow-lg">
                <p className="text-stone-700 italic mb-4">"The cover customization made my agenda feel truly mine. It's beautiful and functional!"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-red-200 mr-3 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-stone-900">Javier R.</p>
                    <p className="text-sm text-stone-500">Illustrator</p>
                  </div>
                </div>
              </div>
              {/* Testimonial Card 2 */}
              <div className="bg-stone-50 p-6 rounded-lg shadow-sm border border-stone-100 transform transition duration-300 hover:scale-[1.03] hover:shadow-lg">
                <p className="text-stone-700 italic mb-4">"Being able to add specific modules for my writing projects and client notes is a game-changer."</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-amber-200 mr-3 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-stone-900">Chloe Kim</p>
                    <p className="text-sm text-stone-500">Content Strategist</p>
                  </div>
                </div>
              </div>
              {/* Testimonial Card 3 */}
              <div className="bg-stone-50 p-6 rounded-lg shadow-sm border border-stone-100 transform transition duration-300 hover:scale-[1.03] hover:shadow-lg">
                <p className="text-stone-700 italic mb-4">"I love switching between daily focus and weekly planning. The template variety is fantastic."</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-orange-200 mr-3 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-stone-900">Ben Carter</p>
                    <p className="text-sm text-stone-500">Product Manager</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28 bg-gradient-to-r from-amber-600 to-red-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">Ready to Build Your Masterpiece?</h2>
            <p className="text-lg text-amber-100 mb-10 max-w-2xl mx-auto">
              Stop adapting to your planner. Start designing a planner that adapts to you. Begin your creative journey today.
            </p>
            <button className="px-10 py-4 border border-transparent text-lg font-medium rounded-lg text-amber-700 bg-white hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-amber-700 focus:ring-white transition duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105">
              Craft Your Personalized Agenda
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-stone-800 text-stone-400 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
            <p>&copy; {year ?? new Date().getFullYear()} CreativeAgenda Works. All rights reserved.</p>
            <div className="mt-4 space-x-6">
              <a href="#" className="hover:text-white transition duration-150">Privacy</a>
              <a href="#" className="hover:text-white transition duration-150">Terms</a>
              <a href="#" className="hover:text-white transition duration-150">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Presentation;