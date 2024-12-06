import PropTypes from "prop-types";
import { FiMapPin } from "react-icons/fi";
import { MdPriceChange } from "react-icons/md";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useAuth from "../../hooks/useAuth"

const AllPropertiesCard = ({ property }) => {
  const {user} = useAuth();
  const {
    _id,
    propertyImages,
    propertyLocation,
    priceRange,
    propertyTitle,
    agentName,
    agentImage,
    status,
    add_address
  } = property;

  const handleCopy = () => {
    navigator.clipboard.writeText(propertyLocation).then(() => {
      alert("Location copied to clipboard!");
    });
  };

  return (
    <motion.article
      className="bg-white shadow-lg rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      <div className="relative">
        <img
          src={propertyImages[0]}
          alt="property image"
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-lg font-semibold">
          {status}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{propertyTitle}</h3>
        <div className="flex items-center mb-4">
          <FiMapPin className="text-blue-500 mr-2" />
          {add_address?.trim().length > 40 
      ? `${add_address.trim().substring(0, 40)}...` 
      : add_address?.trim()}
        </div>
        {/* <div className="flex items-center mb-4">
          <FiMapPin className="text-blue-500 mr-2" />
          <motion.button
            onClick={handleCopy}
            className="text-sm text-gray-600 hover:text-blue-600 focus:outline-none"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Copy Location
          </motion.button>
        </div> */}

        <div className="flex items-center mb-4">
          <MdPriceChange className="text-green-500 mr-2 text-xl" />
          <span className="text-lg font-semibold text-gray-800">{priceRange}</span>
        </div>

        <div className="flex items-center mb-6">
          <img
            src={agentImage}
            alt="agent"
            className="w-10 h-10 rounded-full mr-3 object-cover"
          />
          <div>
            <p className="text-sm text-gray-600">Agent</p>
            <p className="font-semibold text-gray-800">{agentName}</p>
          </div>
        </div>

        {
          user != null ?
        <Link to={`/properties/${_id}`}>
          <motion.button
            className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Details
          </motion.button>
        </Link>
        :
        <Link to={`/properties/test/${_id}`}>
          <motion.button
            className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Details
          </motion.button>
        </Link>
        }  
      </div>
    </motion.article>
  );
};

AllPropertiesCard.propTypes = {
  property: PropTypes.object.isRequired,
};

export default AllPropertiesCard;

