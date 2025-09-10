import React from 'react';

const VideoSection = ({ title, description, videoUrl }) => {
  return (
    <section className="relative z-20 mb-20 max-w-5xl w-full animate-fade-in">
      <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg shadow-2xl rounded-3xl p-10 border border-gray-100 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
          {title}
        </h2>
        <p className="text-xl text-gray-700 mb-10 max-w-3xl mx-auto">
          {description}
        </p>
        <div className="relative w-full h-0 pb-[56.25%] rounded-2xl overflow-hidden shadow-xl mx-auto">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={videoUrl}
            title="Explainer Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
