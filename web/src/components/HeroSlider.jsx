import React, { useState, useEffect } from 'react';

const HeroSlider = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl mb-16 h-[500px] group">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out
            ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${slide.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white text-center p-8">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg leading-tight animate-fade-in-down">
              {slide.headline}
            </h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto drop-shadow-md animate-fade-in-up">
              {slide.subheadline}
            </p>
            {slide.link && (
              <a
                href={slide.link}
                className="mt-8 px-8 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
              >
                {slide.linkText}
              </a>
            )}
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-30 p-3 rounded-full text-white text-2xl hover:bg-opacity-50 transition-all duration-300 z-30 opacity-0 group-hover:opacity-100"
      >
        ❮
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-30 p-3 rounded-full text-white text-2xl hover:bg-opacity-50 transition-all duration-300 z-30 opacity-0 group-hover:opacity-100"
      >
        ❯
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-3 h-3 rounded-full bg-white opacity-50 hover:opacity-100 transition-opacity duration-300
              ${idx === currentSlide ? 'opacity-100 scale-125' : ''}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
