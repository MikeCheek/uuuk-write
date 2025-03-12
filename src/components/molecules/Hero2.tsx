import React from "react";
import Section from "./Section";
import ShowOnView from "./ShowOnView";
import Typography from "../atoms/Typography";
import { useTranslation } from "react-i18next";
import renderText from "../../utilities/renderText";

const Hero2 = () => {
  const { t } = useTranslation()

  return (
    // <Section id="section2" bgColor="bg-gradient-to-b from-1% from-white via-50% via-red to-99% to-blue" shapeColor="text-white" preset="left">
    <Section id="section2" bgColor="bg-redBrick" shapeColor="text-white" preset="left">
      <div className="max-w-3xl text-left text-white">
        {/* <ShowOnView>
          <Typography variant='h2'>
            Modulare
          </Typography>
        </ShowOnView> */}
        <ShowOnView>
          <Typography variant="p">
            {renderText(t("Hero2Text"))}
          </Typography>
        </ShowOnView>
      </div>
    </Section>
  );
};

export default Hero2;
