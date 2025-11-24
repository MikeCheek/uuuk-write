import React from "react";
import Section from "./Section";
import ShowOnView from "./ShowOnView";
import Typography from "../atoms/Typography";
import { useTranslation } from "react-i18next";
import renderText from "../../utilities/renderText";
import { StaticImage } from "gatsby-plugin-image";

const Hero2 = () => {
  const { t } = useTranslation()

  return (
    // <Section id="section2" bgColor="bg-gradient-to-b from-1% from-white via-50% via-red to-99% to-blue" shapeColor="text-white" preset="left">
    <Section id="section2" bgColor="bg-beige" shapeColor="text-darkBrown" preset="left">
      <ShowOnView className="text-left md:text-center text-darkBrown self-start mt-20" fadeIn="leftRight">
        <div className="self-start">
          <Typography variant="h2" render="div" className="font-bold uppercase mr-auto !text-black opacity-90 text-center md:text-left [perspective:400px] mb-10 md:mb-20 max-w-[330px] md:max-w-[530px] md:ml-[5vw]" >
            <h2 className="text-3xl md:text-5xl w-fit scale-y-125 ml-4">Un UUUK</h2>
            <h2 className="[transform:rotateY(-35deg)_rotateZ(2deg)] text-5xl md:text-7xl w-fit text-shadow-lg -mb-2 ml-24 md:ml-32">è per</h2>
            <h2 className="[transform:rotateY(50deg)_rotateZ(5deg)] text-7xl md:text-8xl w-fit text-shadow-lg -mt-2  md:ml-8">sempre</h2>
          </Typography>


          <Typography variant="p" className="text-lg md:text-xl mr-auto ml-0 text-center md:text-left bg-opacity-80 rounded-lg self-center justify-self-center !md:max-w-[33vw] md:ml-28 md:mt-40">
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
      <div className="absolute !w-screen left-0 bottom-[5vh] -z-10">
        <ShowOnView className="flex flex-row !items-end !justify-end" fadeIn="rightLeft">
          <StaticImage
            src="../../images/triadic-render.png"
            alt="Triadic Ballet Render"
            width={600}
            height={400}
            className="max-h-[30vh] md:max-h-[50vh]"
            objectFit="contain"
            objectPosition="right"
            layout="fixed"
          />
        </ShowOnView>
      </div>
    </Section>
  );
};

export default Hero2;
