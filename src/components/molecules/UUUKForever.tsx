import React from "react";
import Section from "./Section";
import ShowOnView from "./ShowOnView";
import Typography from "../atoms/Typography";
import renderText from "../../utilities/renderText";
import { StaticImage } from "gatsby-plugin-image";

const UUUKForever = () => {

  return (
    <Section id="section2" bgColor="bg-[#f3ebde]" shapeColor="text-darkBrown" preset="center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(249,117,22,0.22),transparent_36%),radial-gradient(circle_at_90%_80%,rgba(37,41,169,0.16),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(11,17,34,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(11,17,34,0.08)_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative z-10 grid w-full max-w-6xl grid-cols-1 items-center gap-10 py-14 md:grid-cols-12 md:py-20">
        <ShowOnView className="!items-start !text-left md:col-span-6" fadeIn="leftRight">
          <span className="inline-flex rounded-full border border-[#f97516]/40 bg-[#f97516]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#b05a10]">
            Modularità
          </span>

          <Typography variant="h2" render="div" className="font-bold uppercase !text-[#0b1122] mt-6 mb-6 [perspective:450px]" >
            <h2 className="text-4xl md:text-6xl w-fit">Un UUUK</h2>
            <h2 className="[transform:rotateY(-26deg)] text-6xl md:text-8xl w-fit -mt-2 ml-10 md:ml-14 text-shadow-lg">e per</h2>
            <h2 className="text-5xl md:text-7xl w-fit -mt-2 ml-2 text-[#1e2e63]">sempre</h2>
          </Typography>

          <div className="rounded-2xl border border-[#0b1122]/10 /80 p-5 shadow-[0_14px_34px_rgba(11,17,34,0.12)] md:max-w-[30rem]">
            <Typography variant="p" className="!mx-0 !max-w-none !mt-0 text-left !text-[#2f241c]">
              {renderText("Puoi sempre cambiare le parti del tuo UUUK e personalizzarlo secondo le tue ***esigenze***")}
            </Typography>
          </div>
        </ShowOnView>

        <ShowOnView className="relative md:col-span-6" fadeIn="rightLeft">
          <div className="relative mx-auto w-full max-w-[34rem]">
            <div className="pointer-events-none absolute -left-8 top-8 h-28 w-28 rounded-full bg-[#f97516]/25 blur-2xl" />
            <div className="pointer-events-none absolute -right-8 bottom-10 h-28 w-28 rounded-full bg-[#1e2e63]/20 blur-2xl" />

            <div className="rounded-[28px] border border-[#0b1122]/10 p-4 shadow-[0_18px_40px_rgba(11,17,34,0.2)] backdrop-blur-sm">
              <StaticImage
                src="../../images/triadic-render.png"
                alt="Triadic Ballet Render"
                width={760}
                height={520}
                className="rounded-2xl"
                objectFit="contain"
                objectPosition="center"
                layout="constrained"
              />
            </div>

            <div className="absolute -bottom-5 -left-3 w-24 md:w-28 rotate-[-8deg] rounded-xl border border-[#0b1122]/15  p-1 shadow-[0_12px_24px_rgba(11,17,34,0.2)]">
              <StaticImage src="../../images/collezioni/TRIADIC/A7/Flusso.png" alt="Flusso cover" className="rounded-lg" />
            </div>

          </div>
        </ShowOnView>
      </div>
    </Section>
  );
};

export default UUUKForever;
