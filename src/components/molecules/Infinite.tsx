import React from "react";
import Section from "./Section";
import ShowOnView from "./ShowOnView";
import Typography from "../atoms/Typography";
import renderText from "../../utilities/renderText";
import { StaticImage } from "gatsby-plugin-image";
import CircledText from "../atoms/CircledText";

const Infinite = () => {

  return (
    // <Section id="section2" bgColor="bg-gradient-to-b from-1% from-white via-50% via-red to-99% to-blue" shapeColor="text-white" preset="left">
    <Section id="section3" bgColor="bg-beige" shapeColor="text-darkBrown" preset="left">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_78%,rgba(27,181,127,0.2),transparent_40%),radial-gradient(circle_at_85%_20%,rgba(249,117,22,0.16),transparent_36%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:repeating-linear-gradient(135deg,rgba(11,17,34,0.14)_0_1px,transparent_1px_12px)]" />

      <ShowOnView className="relative z-10 text-left md:text-center text-darkBrown self-start mt-20" fadeIn="leftRight">
        <div className="self-start">
          <Typography variant="h2" render="div" className="font-bold uppercase mr-auto !text-black opacity-90 text-center md:text-left [perspective:400px] mb-10 md:mb-20 max-w-[330px] md:max-w-[530px] md:ml-[5vw]" >
            <h2 className="[transform:rotateY(40deg)_rotateZ(0deg)] text-7xl md:text-8xl w-fit text-shadow-lg mt-10 md:ml-8">Infinita</h2>
          </Typography>

          <Typography variant="p" className="mr-auto ml-0 text-center md:text-left bg-opacity-80 rounded-lg self-center justify-self-center !md:max-w-[33vw] md:ml-28 md:mt-40">
            Ricarica le pagine di ogni fascicolo <CircledText text="all'infinito" />
            <br />
            e proteggi le tue idee.
          </Typography>
        </div>
      </ShowOnView>
      <div className="absolute !w-screen left-0 bottom-[5vh] -z-10">
        <ShowOnView className="flex flex-row !items-end !justify-end" fadeIn="rightLeft">
          <StaticImage
            src="../../images/infinity.png"
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

export default Infinite;
