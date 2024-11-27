import React from 'react';
import { FaDollarSign, FaMapMarkerAlt, FaLandmark, FaCouch, FaKey, FaYoutube } from 'react-icons/fa';
import { BsCurrencyDollar, BsHouseDoor } from 'react-icons/bs';
import { MdVideoLibrary } from 'react-icons/md';
import { IoMdOptions } from 'react-icons/io';
import { VideoThumbnail } from './YoutubeThumbnail';

export const PropertyAdditionalDetails = ({
  minPrice,
  maxPrice,
  price_total_price,
  price_registeration_chrages,
  add_address,
  Landmarks_add,
  propertyVideoes,
  furnishing,
  ownership,
  options,
  Youtube,
}) => {
  const DetailItem = ({ icon, title, value, className = "" }) => (
    <div className={`bg-white rounded-lg shadow-md p-4 flex items-start ${className}`}>
      <div className="text-blue-600 mr-4 mt-1">{icon}</div>
      <div>
        <dt className="font-semibold text-gray-700 mb-1">{title}</dt>
        <dd className="text-gray-600">{value}</dd>
      </div>
    </div>
  );

  return (
    <div className="mt-8 bg-gray-50 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Additional Details</h2>
      <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DetailItem icon={<FaDollarSign />} title="Minimum Price" value={`${minPrice} USD`} />
        <DetailItem icon={<FaDollarSign />} title="Maximum Price" value={`${maxPrice} USD`} />
        <DetailItem icon={<BsCurrencyDollar />} title="Total Price" value={`${price_total_price} USD`} />
        <DetailItem icon={<BsCurrencyDollar />} title="Registration Charges" value={`${price_registeration_chrages} USD`} />
        <DetailItem icon={<FaMapMarkerAlt />} title="Address" value={add_address} className="md:col-span-2" />
        <DetailItem icon={<FaLandmark />} title="Nearby Landmarks" value={Landmarks_add} className="md:col-span-2" />
        <DetailItem icon={<FaCouch />} title="Furnishing" value={furnishing.label} />
        <DetailItem icon={<FaKey />} title="Ownership" value={ownership.label} />
        <DetailItem icon={<IoMdOptions />} title="Flooring Options" value={options.join(', ')} className="md:col-span-2" />
        
        <div className="md:col-span-2 bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center mb-2">
            <MdVideoLibrary className="text-blue-600 mr-2" />
            <dt className="font-semibold text-gray-700">Property Videos</dt>
          </div>
          <dd>
            {propertyVideoes?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {propertyVideoes.map((video, index) => (
                  <a
                    key={index}
                    href={video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 transition-colors duration-200 flex items-center"
                  >
                    <BsHouseDoor className="mr-2" /> Video {index + 1}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No videos available</p>
            )}
          </dd>
        </div>
        
        <div className="md:col-span-2 bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center mb-2">
            <FaYoutube className="text-red-600 mr-2" />
            <dt className="font-semibold text-gray-700">YouTube Link</dt>
          </div>
          <dd>
            {Youtube ? (
             <VideoThumbnail
             youtubeLink={Youtube}
             title="Luxurious Beachfront Villa Tour"
           />
            ) : (
              <p className="text-gray-600">No YouTube link available</p>
            )}
          </dd>
        </div>
      </dl>
    </div>
  );
};

