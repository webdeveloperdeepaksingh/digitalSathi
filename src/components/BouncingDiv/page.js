"use client";
import { useEffect, useRef } from 'react';

function BouncingDiv({ children }) {

  const divRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        divRef.current.classList.add('bounce-once');
        observer.unobserve(divRef.current); // Unobserve after triggering animation
      }
    });

    observer.observe(divRef.current);

    return () => observer.disconnect(); // Cleanup on unmount
  }, []);

  return <div ref={divRef}>{children}</div>;
}

export default BouncingDiv;
