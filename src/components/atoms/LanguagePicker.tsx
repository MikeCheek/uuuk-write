// import { Link, useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';

const LanguagePicker = ({ white = false, cursor = false }: { white?: boolean, cursor?: boolean }) => {
  // const { languages, language, originalPath } = useI18next();

  return (
    <div className="flex flex-row md:flex-col gap-x-4 gap-y-2">
      {/* {languages.sort().map((lng, _) => (
        // @ts-ignore
        <Link
          className={`${white ? 'text-white' : 'text-black'} flex flex-col-reverse md:flex-row ${cursor ? 'cursor-pointer' : 'cursor-none'} items-center gap-2 justify-end hover:scale-110 transition-scale duration-200 ${language === lng ? "" : "opacity-70"}`}
          key={lng}
          to={originalPath}
          language={lng}
        // placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
        >
          {lng.toUpperCase()}
          <span className={`${white ? 'bg-white' : 'bg-black'} w-[1px] md:h-[1px] ${language === lng ? "h-16 md:w-16" : "h-4 md:w-4"}`}></span>
        </Link>
      ))} */}
    </div>
  );
};

export default LanguagePicker;
