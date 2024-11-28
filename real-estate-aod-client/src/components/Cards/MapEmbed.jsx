import React from 'react';

const MapEmbed = ({url}) => {
  const iframeHTML = url;

// Function to extract the `src` from the iframe string
const extractSrc = (htmlString) => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const iframeElement = doc.querySelector('iframe');
    return iframeElement ? iframeElement.getAttribute('src') : null;
  } catch (error) {
    console.error('Error parsing iframe HTML:', error);
    return null;
  }
};

const iframeSrc = extractSrc(iframeHTML);

// console.log(iframeSrc);

  const mapSrc = iframeSrc || "https://www.google.com/maps/embed?pb=!1m26!1m12!1m3!1d3776.633333440583!2d74.32553048992851!3d18.814487100000008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m11!3e0!4m3!3m2!1d19.912696099999998!2d75.3513723!4m5!1s0x3bdcd525d8086413%3A0x7f151377f75a4c16!2zU2FyYWR3YWRpIOCkuOCksOCkoeCkteCkvuCkoeClgA!3m2!1d18.8088168!2d74.31475449999999!5e0!3m2!1sen!2sin!4v1732747683501!5m2!1sen!2sin";

  return (
    <div style={{ width: '100%', height: '500px', border: '1px solid #ccc', borderRadius:'10px' }}>
      <iframe
        src={iframeSrc}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Andheri Map"
      ></iframe>
    </div>
  );
};

export default MapEmbed;
