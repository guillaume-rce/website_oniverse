import { useEffect, useState, useRef } from 'react';
import './Info.css';

const Info = ({ title, num, type, icon }) => {
  const [number, setNumber] = useState(0);
  const ref = useRef();
  const [isAnimated, setIsAnimated] = useState(false);

  const animateValue = (start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setNumber(Math.floor(progress * (end - start) + start));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isAnimated) {
          animateValue(0, num, 1000);
          setIsAnimated(true);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [num, isAnimated]);

  return (
    <div ref={ref} className="info-card">
      <div className="info-icon-container">
        <img src={icon} alt="icon" className="info-icon" />
      </div>
      <div className="info-details">
        <label className="title">{title}</label>
        <span className="info-content">{number} {type}</span>
      </div>
    </div>
  );
}

export default Info;
