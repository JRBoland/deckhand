import { useState, useEffect, useRef } from 'react';

export const useDetectOutsideClick = (initialState) => {
  const [isActive, setIsActive] = useState(initialState);
  const ref = useRef(null);

  const handleClick = (e) => {
    // If the click is outside the referenced element, close it
    if (ref.current && !ref.current.contains(e.target)) {
      setIsActive(false);
    }
  };

  useEffect(() => {
    // Add event listener when the component mounts
    document.addEventListener('mousedown', handleClick);
    // Clean up the event listener when it unmounts
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  return [ref, isActive, setIsActive];
};