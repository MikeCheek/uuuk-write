import React, { ReactNode } from "react";
import Shapes from "../atoms/Shapes";

const Section = ({
  id,
  bgColor = "bg-black",
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
      className={`${bgColor} min-h-screen flex items-center ${preset === "center" ? "justify-center" : preset === "left" ? "justify-start" : "justify-end"} px-20 relative overflow-x-hidden`}
    >
      {/* <Shapes color={shapeColor} /> */}
      <span className="z-20">
        {children}
      </span>
    </section>
  );
};

export default Section;
