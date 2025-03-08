import { useI18next, Link } from 'gatsby-plugin-react-i18next';
import React from 'react';

const LanguagePicker = () => {
  const { languages, language, originalPath } = useI18next();

  return (
    <div className="">
      <div className="flex flex-row md:flex-col gap-x-4 gap-y-2">
        {languages.sort().map((lng, _) => (
          <Link
            className={`flex flex-col-reverse md:flex-row items-center gap-2 justify-end hover:scale-105 transition-scale duration-200 ${language === lng ? "" : "opacity-70"}`}
            key={lng}
            to={originalPath}
            language={lng}
            placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
          >
            {lng.toUpperCase()}
            <span className={`bg-black w-[1px] md:h-[1px] ${language === lng ? "h-16 md:w-16" : "h-4 md:w-4"}`}></span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LanguagePicker;
