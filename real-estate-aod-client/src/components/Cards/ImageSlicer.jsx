import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

const ImageSlider = ({ propertyImages }) => {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      navigation
      pagination={{ clickable: true }}
      className="w-full max-h-[400px] rounded-md"
    >
      {propertyImages.map((image, index) => (
        <SwiperSlide key={index}>
          <img
            src={image}
            alt={`Property ${index + 1}`}
            className="w-full max-h-[400px] rounded-md object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ImageSlider;