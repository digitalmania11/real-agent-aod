import React from 'react';

const MapEmbed = ({url}) => {
  const mapSrc = "https://www.google.com/maps/embed?pb=!1m24!1m12!1m3!1d90536.87841469946!2d73.83915157271265!3d18.78651603226897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m9!3e0!4m3!3m2!1d19.912696099999998!2d75.3513723!4m3!3m2!1d18.6959336!2d73.9002679!5e0!3m2!1sen!2sin!4v1732570208159!5m2!1sen!2sin";

  return (
    <div style={{ width: '100%', height: '500px', border: '1px solid #ccc', borderRadius:'10px' }}>
      <iframe
        src={mapSrc}
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
