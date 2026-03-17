import React, { ReactNode } from "react";
import Shapes from "../atoms/Shapes";

const Section = ({
  id,
  bgColor = "bg-[#0b1122]",
  shapeColor = "text-brown",
  children,
  preset = "center"
}: {
  id?: string;
  bgColor?: string;
  shapeColor?: string;
  children: ReactNode;
  preset?: "center" | "left" | "right"
}) => {

  return (
    <section
      id={id}
      className={`${bgColor} uuuk-grid-bg min-h-screen flex items-center z-20 relative ${preset === "center" ? "justify-center" : preset === "left" ? "justify-start" : "justify-end"} px-[8vw] md:px-20 overflow-x-hidden`}
    >
      {/* <Shapes color={shapeColor} /> */}
      {/* <span className="z-20 relative min-h-screen"> */}
      {children}
      {/* </span> */}
    </section>
  );
};

export default Section;
