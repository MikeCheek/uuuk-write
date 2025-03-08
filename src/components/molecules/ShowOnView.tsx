import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface ShowOnViewProps {
  children: React.ReactNode;
  triggerOnce?: boolean;
  className?: string;
  setInView?: (inView: boolean) => void;
}

const ShowOnView = ({ children, triggerOnce = false, className, setInView }: ShowOnViewProps) => {
  const [ref, inView, _entry] = useInView({
    threshold: 0.5,
    rootMargin: '5% 0px 5% 0px',
    fallbackInView: true,
    triggerOnce: triggerOnce,
    delay: 100
  });

  useEffect(() => {
    if (setInView) setInView(inView);
  }, [inView]);

  return (
    <div
      className={`${className ?? ''} 
                    ${inView ? 'opacity-100 transform-none' : ''} 
                    will-change-[opacity,transform] opacity-0 translate-y-[50px] flex flex-col items-center justify-center`}
      style={{ transition: 'opacity 400ms ease-out, transform 400ms ease-out' }}
      ref={ref}>
      {children}
    </div>
  );
};

export default ShowOnView;