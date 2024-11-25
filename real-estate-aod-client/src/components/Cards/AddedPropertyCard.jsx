
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { FiMapPin } from "react-icons/fi";

import { Link } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import Swal from "sweetalert2";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBinFill } from "react-icons/ri";
const AddedPropertyCard = ({ property,refetch }) => {
  const axiosPublic = useAxiosPublic()
  const {
    _id,
    // propertyID,
    propertyImages,
    propertyLocation,
    priceRange,
    propertyTitle,
    // agentEmail,
    agentName,
    agentImage,
    status,
  } = property;

  console.log("property",propertyImages);


  const handleRemove = async()=>{
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to get the property details!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove property"
    }).then((result) => {
      if (result.isConfirmed) {
    axiosPublic.delete(`/api/v1/properties/${_id}`)
    .then(res=>{
        console.log(res.data)
     
        Swal.fire({
          position: "top-end",
       
          text: `${propertyTitle} - has been removed !`,
          showConfirmButton: false,
          timer: 2500,
          icon: 'success'

        })
        refetch()
    })
    .then(err=>{
        toast.error(`${err.message}`)
    })
  }
})
   
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(propertyLocation).then(() => {
      alert("Location copied to clipboard!");
    });
  };
  return (
    <article className="overflow-hidden rounded-lg shadow transition hover:shadow-lg max-w-sm mx-auto h-full bg-base-200">
      <img
        alt="property image"
        src={propertyImages[0]}
        className="aspect-video object-cover"
      />

      <div className="  p-4 sm:p-6">
        <h3 className="mt-0.5 text-lg min-h-[60px] ">{propertyTitle}</h3>
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

        <p className="mt-2 line-clamp-3 text-sm/relaxed font-semibold">
       Agent Info
        </p>
        <hr />
        <div className="flex gap-2 py-2 no-animation  items-center ">
            <img src={agentImage} alt="agent image" className="w-12 border rounded-full aspect-square object-cover" />
            <p>{agentName}</p>
        </div>
        <hr />
        <button className={`${status}nobg  p-1 my-4`}>Status : {status}</button>

        <p className="text-success font-semibold">Price Range : {priceRange}</p>
        <div className="flex flex-col justify-end mt-4 gap-4">
           {
            status === "rejected"? '': <Link to={`/dashboard/update-property/${_id}`}>
            <button className="btn btn-primary text-white w-full">
               <FaEdit className="text-2xl"/>  Update
            </button>
            
            </Link>
           }
            <button onClick={handleRemove} className="btn btn-error text-white">
               <RiDeleteBinFill className="text-2xl"/> Remove
            </button>
        </div>
      </div>
    </article>
  );
};
AddedPropertyCard.propTypes = {
    property: PropTypes.object.isRequired,
    refetch: PropTypes.func,
  };
export default AddedPropertyCard;
