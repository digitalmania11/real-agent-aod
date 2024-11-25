import PropTypes from "prop-types";
import { FiMapPin } from "react-icons/fi";
import { MdPriceChange } from "react-icons/md";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
const AllPropertiesCard = ({ property }) => {
  const {
    _id,
    propertyImages,
    propertyLocation,
    priceRange,
    propertyTitle,
    agentName,
    agentImage,
    status,
  } = property;

 console.log("propertyImages",propertyImages);

 const handleCopy = () => {
  navigator.clipboard.writeText(propertyLocation).then(() => {
    alert("Location copied to clipboard!");
  });
};

  return (
 
      <motion.article className="flex bg-base-200 hover:shadow-md   rounded-2xl transition delay-150" initial={{
        x: 0,
        y: 0,
        scale: 1.2,
        rotate: 0,
      }}
      animate={{
        x: 0,
        y: 0,
        scale: 1.0,
        rotate: 0,
      }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 1.0 }}
      >
        <div className="rotate-180 p-1 [writing-mode:_vertical-lr] bg-success rounded-ee-2xl rounded-es-2xl ">
          <p className="text-center text-white text-lg font-semibold">
            {status}
          </p>
        </div>

        <div className="hidden sm:block sm:basis-80 lg:max-w-[30%]">
          <img
            alt="property image"
            src={propertyImages[0]}
            className="md:aspect-video  h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col justify-between  rounded-r-2xl text-neutral glass  relative w-1/2">
          <div className=" p-4 sm:pr-0 sm:pb-0  sm:p-6">
            <h3 className="font-bold text-lg lg:text-2xl  ">{propertyTitle}</h3>

            <div className="mt-2 flex items-center gap-2">
              <FiMapPin className="text-blue-500" />
              <button
                onClick={handleCopy}
                className="text-black text-xs  focus:outline-none ring-2 ring-blue-400 rounded-full p-2 transition"
                title="Copy to clipboard"
              >
                 Copy Location
              </button>
            </div>



            <p className="mt-2 line-clamp-3 md:text-lg text-sm">
              <MdPriceChange className="inline mr-3" />
              Price Range :{" "}
              <span className=" text-success no-animation bg-white p-1 rounded-full">
                {priceRange}
              </span>
            </p>

            <h3 className="font-bold pt-2">Agent:</h3>

            <div className="flex gap-2  w-full sm:w-fit pt-2 items-center">
              <div className="w-fit">
                <img
                  src={agentImage}
                  alt="agent-image"
                  className=" mask w-8 border mask-squircle aspect-square object-cover"
                />
              </div>
              <div className="">
                <p className="text-sm">{agentName}</p>
              </div>
            </div>
            <div className="sm:flex sm:items-end justify-end pt-6 ">
              <Link to={`/properties/${_id}`} className="sm:absolute sm:bottom-0">
                <button className="btn btn-primary  sm:rounded-2xl text-white rounded-full">
                  Details
                </button>
              </Link>
            </div>
          </div>
        </div>
      </motion.article>
  
  );
};
AllPropertiesCard.propTypes = {
  property: PropTypes.object.isRequired,
};
export default AllPropertiesCard;
