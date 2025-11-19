import React from "react";
import Section from "./Section";
import ShowOnView from "./ShowOnView";
import Typography from "../atoms/Typography";
import { useTranslation } from "react-i18next";
import renderText from "../../utilities/renderText";
import { StaticImage } from "gatsby-plugin-image";

// const ModuleIconWarm: React.FC<{ className?: string }> = ({ className }) => (
//   <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
//   </svg>
// );

const Hero2 = () => {
  const { t } = useTranslation()

  return (
    // <Section id="section2" bgColor="bg-gradient-to-b from-1% from-white via-50% via-red to-99% to-blue" shapeColor="text-white" preset="left">
    <Section id="section2" bgColor="bg-beige" shapeColor="text-darkBrown" preset="left">
      <ShowOnView className="text-left md:text-center text-darkBrown self-start mt-20 ">
        <div className="self-start">
          <Typography variant="h2" render="div" className="font-bold uppercase mr-auto !text-black opacity-90 text-center md:text-left [perspective:400px] mb-20" >
            <h2 className="text-3xl md:text-5xl w-fit scale-y-125">Un UUUK</h2>
            <h2 className="[transform:rotateY(-35deg)_rotateZ(2deg)] text-5xl md:text-7xl w-fit text-shadow-lg -mb-2 ml-24 md:ml-32">è per</h2>
            <h2 className="[transform:rotateY(50deg)_rotateZ(5deg)] text-7xl md:text-8xl w-fit text-shadow-lg -mt-2  md:ml-8">sempre</h2>
          </Typography>


          <Typography variant="p" className="text-lg md:text-xl mr-auto ml-0 text-center md:text-left bg-opacity-80 rounded-lg self-center justify-self-center">
            {renderText(t("UUUKForever").split("<br/><br/>")[0])}
          </Typography>
        </div>
        {/* <ul className="space-y-5 text-beige mt-10 text-sm md:text-xl">
            <li className="flex items-center justify-start">
              <ModuleIconWarm className="w-5 h-5 md:w-8 md:h-8 text-yellow mr-3 flex-shrink-0 mt-1" />
              <span><strong className="font-semibold text-black opacity-80">Brainstorming Hub:</strong> Mind maps, idea lists, visual thinking tools.</span>
            </li>
            <li className="flex items-center justify-start">
              <ModuleIconWarm className="w-5 h-5 md:w-8 md:h-8 text-yellow mr-3 flex-shrink-0 mt-1" />
              <span><strong className="font-semibold text-black opacity-80">Goal Tracker:</strong> Set objectives, track progress, celebrate milestones.</span>
            </li>
            <li className="flex items-center justify-start">
              <ModuleIconWarm className="w-5 h-5 md:w-8 md:h-8 text-yellow mr-3 flex-shrink-0 mt-1" />
              <span><strong className="font-semibold text-black opacity-80">Habit Builder:</strong> Monitor daily routines and build positive habits.</span>
            </li>
            <li className="flex items-center justify-start">
              <ModuleIconWarm className="w-5 h-5 md:w-8 md:h-8 text-yellow mr-3 flex-shrink-0 mt-1" />
              <span><strong className="font-semibold text-black opacity-80">Sketch Pad:</strong> Simple drawing tools for quick visual notes.</span>
            </li>
          </ul> */}
      </ShowOnView>
      <div className="absolute !w-screen left-0 bottom-[5vh] md:top-1/2 md:bottom-auto md:!-translate-y-1/2 -z-10">
        <ShowOnView className=" flex flex-row !items-end !justify-end">
          <StaticImage
            src="../../images/triadic-render.png"
            alt="Triadic Ballet Render"
            width={600}
            height={400}
            className="w-[90%] md:w-[40%]"
          />
        </ShowOnView>
      </div>
    </Section>
  );
};

export default Hero2;
