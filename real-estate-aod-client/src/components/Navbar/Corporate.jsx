import { RiShieldStarFill } from 'react-icons/ri'
import { MdMail } from 'react-icons/md'
import LogOutButton from "../Buttons/LogOutButton";

export default function CorporateDropdown({ isLoading, data, user }) {
  return (
    <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
      <div className="py-2">
        {isLoading ? (
          <p className="px-4 py-2 text-sm text-gray-700">Loading...</p>
        ) : (
          data[0]?.role !== "user" && (
            <div className="px-4 py-3 bg-blue-900 text-white">
              <p className="text-sm font-medium flex items-center justify-center">
                <RiShieldStarFill className="mr-2 text-blue-300" />
                Role: <span className="ml-1 px-2 py-0.5 text-xs font-semibold bg-blue-700 rounded-full">{data[0]?.role}</span>
              </p>
            </div>
          )
        )}

        {user?.displayName && (
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900 text-center">{user.displayName}</p>
          </div>
        )}

        <div className="px-4 py-3">
          <p className="text-sm text-gray-700 flex items-center">
            <MdMail className="mr-2 text-blue-700" />
            <span className="truncate">{user?.email}</span>
          </p>
        </div>

        <div className="px-4 py-2">
          <LogOutButton className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" />
        </div>
      </div>
    </div>
  )
}

