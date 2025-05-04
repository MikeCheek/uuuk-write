import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface ShowOnViewProps {
  children: React.ReactNode;
  triggerOnce?: boolean;
  className?: string;
  setInView?: (inView: boolean) => void;
  align?: 'left' | 'center' | 'right';
  fadeIn?: 'topDown' | 'bottomUp' | 'leftRight' | 'rightLeft'
}

const ShowOnView = ({ children, triggerOnce = false, className, setInView, align = "center", fadeIn = 'leftRight' }: ShowOnViewProps) => {
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
      className={`${inView ? 'opacity-100 transform-none' : ''} will-change-[opacity,transform] opacity-0 
      ${fadeIn === 'topDown' ? '-translate-y-[50px]' : fadeIn === 'bottomUp' ? 'translate-y-[50px]' : fadeIn === 'leftRight' ? '-translate-x-[50px]' : fadeIn === 'rightLeft' ? 'translate-x-[50px]' : ''}
      ${align === 'left' ? 'items-start text-left' : align === 'right' ? 'items-end text-right' : 'items-center text-center'}
       justify-center flex flex-col ${className ?? ''}`}
      style={{ transition: 'opacity 400ms ease-out, transform 400ms ease-out' }}
      ref={ref}>
      {children}
    </div>
  );
};

export default ShowOnView;