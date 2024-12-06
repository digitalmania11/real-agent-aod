
import { MdPriceChange } from "react-icons/md";
import { Link } from "react-router-dom";
import { FiMapPin } from "react-icons/fi";
import { MdContentCopy } from "react-icons/md";

import PropTypes from "prop-types";

const MiniCard = ({ property }) => {
  const {
    _id,
    propertyTitle,
    status,
    priceRange,
    propertyLocation,
    propertyImages,
    add_address
  } = property;


  const handleCopy = () => {
    navigator.clipboard.writeText(propertyLocation).then(() => {
      alert("Location copied to clipboard!");
    });
  };

  return (
    <div className="h-full max-w-xl mx-auto">
      <div className="overflow-hidden  shadow flex transition hover:shadow-lg p-6 hover:border-primary hover:scale-105   bg-base-200 border rounded-xl items-start h-full text-neutral glass gap-4">
        <div className="flex-1 h-full">
          <img
            alt="property image"
            src={propertyImages[0]}
            className="rounded-xl h-full object-cover "
          />
        </div>

        <div className="flex-1">
          <div>
            <h3 className="mt-0.5 md:text-xl font-semibold  ">{propertyTitle}</h3>

            <div>
              <p className="mt-2 line-clamp-3 font-semibold text-lg  ">
                <FiMapPin className="inline mr-3 text-primary" />
                {add_address?.trim().length > 30 
      ? `${add_address.trim().substring(0, 40)}...` 
      : add_address?.trim()}
              </p>
            </div>

            {/* <div className="mt-2 flex items-center gap-2">
              <FiMapPin className="text-blue-500" />
              <button
                onClick={handleCopy}
                className="text-black text-xs  focus:outline-none ring-2 ring-blue-400 rounded-full p-2 transition"
                title="Copy to clipboard"
              >
                 Copy Location
              </button>
            </div> */}

            <p className="mt-2 line-clamp-3 text-sm lg:text-base ">
              <MdPriceChange className="inline mr-3 " />
              {priceRange}
            </p>
          </div>
          <div className="flex flex-col items-start lg:flex-row lg:justify-between lg:items-center lg:mt-4 gap-3">
            <p className="mt-2  line-clamp-3 text-md/relaxed ">
              <span className="font-bold text-secondary">Status: </span>
              {status}
            </p>

            <Link to={`/properties/test/${_id}`}>
              <button className="btn btn-primary btn-sm lg:px-10 text-white ">
                Details
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
MiniCard.propTypes = {
  property: PropTypes.object.isRequired,
};
export default MiniCard;