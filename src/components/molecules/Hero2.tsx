import React from "react";
import Section from "./Section";
import ShowOnView from "../atoms/ShowOnView";
import Typography from "../atoms/Typography";
import CircledText from "../atoms/CircledText";

const Hero2 = () => {
  return (
    <Section id="section2" bgColor="bg-black" shapeColor="text-white" preset="left">
      <div className="max-w-3xl text-left text-white">
        <ShowOnView>
          <Typography variant='h2'>
            Modulare
          </Typography>
        </ShowOnView>
        <ShowOnView>
          <Typography variant="p">
            Rendiamo alla portata di tutti la riproduzione di opere e grafiche artistiche ed i benefici della modularità.
            UUUK è per tutti coloro che vogliono il meglio della loro <CircledText text="quotidianità" />, e che vogliono lasciare un' impronta della loro vita scrivendola.
          </Typography>
        </ShowOnView>
      </div>
    </Section>
  );
};

export default Hero2;
