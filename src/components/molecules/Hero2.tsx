import React from "react";
import Section from "./Section";
import ShowOnView from "./ShowOnView";
import Typography from "../atoms/Typography";
import CircledText from "../atoms/CircledText";
import HighlightedText from "../atoms/HighlightedText";

const Hero2 = () => {
  return (
    // <Section id="section2" bgColor="bg-gradient-to-b from-1% from-white via-50% via-red to-99% to-blue" shapeColor="text-white" preset="left">
    <Section id="section2" bgColor="bg-red" shapeColor="text-black" preset="left">
      <div className="max-w-3xl text-left text-white">
        {/* <ShowOnView>
          <Typography variant='h2'>
            Modulare
          </Typography>
        </ShowOnView> */}
        <ShowOnView>
          <Typography variant="p">
            Rendiamo alla portata di tutti la riproduzione di opere e grafiche artistiche ed i benefici della <HighlightedText text="modularità" />.
            UUUK è per tutti coloro che vogliono il meglio della loro quotidianità, e che vogliono lasciare un' impronta della loro vita scrivendola.
          </Typography>
        </ShowOnView>
      </div>
    </Section>
  );
};

export default Hero2;
