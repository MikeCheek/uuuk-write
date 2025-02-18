import React, { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);

const VerticalMenu = () => {
  const [active, setActive] = useState("");

  useEffect(() => {
    // For each section, set up a ScrollTrigger to update active state
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
    setActive(sectionId);
  };

  const sections = [
    { id: "section1", label: "Section 1" },
    { id: "section2", label: "Section 2" },
    { id: "section3", label: "Section 3" },
  ];

  const handleScroll = (targetId: string) => {
    gsap.to(window, { duration: 1, scrollTo: `#${targetId}`, ease: "power2.out" });
  };

  return (
    <nav className="fixed top-0 right-0 h-screen w-16 flex flex-col items-center justify-center bg-gray-800">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => handleScroll(section.id)}
          className={`mb-4 p-2 transition-colors ${active === section.id ? "text-cyan-300" : "text-white"}`}
        >
          {section.label}
        </button>
      ))}
    </nav>
  );
};

export default VerticalMenu;
