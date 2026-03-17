import React from "react";
import Section from "./Section";
import ShowOnView from "./ShowOnView";
import Typography from "../atoms/Typography";
import renderText from "../../utilities/renderText";
import { StaticImage } from "gatsby-plugin-image";
import CircledText from "../atoms/CircledText";

const Infinite = () => {

  return (
    <Section id="section3" bgColor="bg-[#efe5d4]" shapeColor="text-darkBrown" preset="center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_82%,rgba(27,181,127,0.24),transparent_38%),radial-gradient(circle_at_88%_20%,rgba(249,117,22,0.18),transparent_36%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(11,17,34,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(11,17,34,0.1)_1px,transparent_1px)] [background-size:30px_30px]" />

      <div className="relative z-10 grid w-full max-w-6xl grid-cols-1 items-center gap-10 py-14 md:grid-cols-12 md:py-20">
        <ShowOnView className="!items-start !text-left md:col-span-5" fadeIn="leftRight">
          <span className="inline-flex rounded-full border border-[#16a36e]/40 bg-[#16a36e]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#0b6b49]">
            Ricaricabile
          </span>

          <Typography variant="h2" render="div" className="font-bold uppercase !text-[#0b1122] mt-6 mb-6 [perspective:420px]" >
            <h2 className="[transform:rotateY(24deg)] text-6xl md:text-8xl w-fit text-shadow-lg">Infinita</h2>
          </Typography>

          <div className="rounded-2xl border border-[#0b1122]/10/80 p-6 shadow-[0_14px_34px_rgba(11,17,34,0.12)]">
            <Typography variant="p" className="!mx-0 !max-w-none !mt-0 text-left !text-[#2f241c]">
              Ricarica le pagine di ogni fascicolo <CircledText text="all'infinito" />
              <br />
              e proteggi le tue idee.
            </Typography>
          </div>
        </ShowOnView>

        <ShowOnView className="relative md:col-span-7" fadeIn="rightLeft">
          <div className="relative mx-auto w-full max-w-[38rem]">
            <div className="pointer-events-none absolute -left-8 top-10 h-24 w-24 rounded-full bg-[#16a36e]/25 blur-2xl" />
            <div className="pointer-events-none absolute -right-8 bottom-8 h-24 w-24 rounded-full bg-[#f97516]/25 blur-2xl" />

            <div className="rounded-[28px] border border-[#0b1122]/10 p-4 shadow-[0_18px_40px_rgba(11,17,34,0.18)] backdrop-blur-sm">
              <StaticImage
                src="../../images/infinity.png"
                alt="Modulo infinito UUUK"
                width={780}
                height={520}
                className="rounded-2xl"
                objectFit="contain"
                objectPosition="center"
                layout="constrained"
              />
            </div>

            <div className="absolute -top-6 right-2 w-24 md:w-28 rotate-[8deg] rounded-xl border border-[#0b1122]/15 p-1 shadow-[0_12px_24px_rgba(11,17,34,0.2)]">
              <StaticImage src="../../images/collezioni/TRIADIC/A6/Punto.png" alt="Punto cover" className="rounded-lg" />
            </div>
          </div>
        </ShowOnView>
      </div>
    </Section>
  );
};

export default Infinite;
