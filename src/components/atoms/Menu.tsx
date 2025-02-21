// VerticalMenu.tsx
import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useSectionContext } from "../../utilities/SectionContext";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);

const VerticalMenu = () => {
  const { activeSection, setActiveSection } = useSectionContext();

  const sections = [
    { id: "section1", label: "Section 1" },
    { id: "section2", label: "Section 2" },
    { id: "section3", label: "Section 3" },
  ];

  useEffect(() => {
    const triggers = sections.map((section) =>
      ScrollTrigger.create({
        trigger: `#${section.id}`,
        start: "top center",
        end: "bottom center",
        onEnter: () => updateActive(section.id),
        onEnterBack: () => updateActive(section.id),
      })
    );

    return () => triggers.forEach((trigger) => trigger.kill());
  }, []);

  const updateActive = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  const handleScroll = (targetId: string) => {
    gsap.to(window, {
      duration: 1,
      scrollTo: `#${targetId}`,
      ease: "power2.out",
    });
  };

  return (
    <nav
      className={`fixed top-0 z-10 w-screen flex flex-row items-center justify-center ${activeSection === "section1"
        ? "bg-black"
        : activeSection === "section2"
          ? "bg-blue"
          : "bg-brown"
        }`}
    >
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => handleScroll(section.id)}
          className="relative group my-2 p-2 transition-colors text-white"
        >
          {section.label}
          <span
            className={`absolute left-0 bottom-0 h-0.5 bg-purple w-full transform transition-transform duration-300 ${activeSection === section.id
              ? "scale-x-100"
              : "scale-x-0 group-hover:scale-x-100"
              }`}
          />
        </button>
      ))}
    </nav>
  );
};

export default VerticalMenu;
