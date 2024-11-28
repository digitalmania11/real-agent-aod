
import * as React from "react"
import { ChevronDown, Check } from 'lucide-react'

const cities = {
  popularCities: [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad",
    "Chennai", "Kolkata", "Pune", "Ahmedabad",
  ],
  otherCities: [
    "Agra", "Allahabad", "Amritsar", "Bhopal",
    "Chandigarh", "Coimbatore", "Dehradun", "Ernakulam",
    "Goa", "Gurugram", "Guwahati", "Indore",
    "Jaipur", "Kanpur", "Kochi", "Lucknow",
    "Ludhiana", "Mangalore", "Mysore", "Nagpur",
    "Nashik", "Patna", "Raipur", "Rajkot",
    "Ranchi", "Surat", "Trivandrum", "Vadodara",
    "Varanasi", "Visakhapatnam",
  ],
}

export function CityDropdown() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedCity, setSelectedCity] = React.useState("")
  const [searchTerm, setSearchTerm] = React.useState("")

  const filteredCities = React.useMemo(() => {
    const allCities = [...cities.popularCities, ...cities.otherCities]
    return allCities.filter(city => 
      city.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-full border border-blue-400 shadow-sm px-4 py-2 bg-blue-400 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-900 focus:ring-white"
          id="city-menu"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedCity || "Select City"}
          <ChevronDown className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {isOpen && (
        <div 
          className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="city-menu"
        >
          <div className="py-1" role="none">
            <input
              type="text"
              className="block w-full px-4 py-2 text-sm text-blue-900 border-b border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-900"
              placeholder="Search city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="max-h-60 overflow-y-auto">
              {filteredCities.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 p-2">
                  {filteredCities.map((city) => (
                    <button
                      key={city}
                      className={`text-sm text-left px-4 py-2 hover:bg-blue-100 ${selectedCity === city ? 'bg-blue-200' : ''}`}
                      role="menuitem"
                      onClick={() => {
                        setSelectedCity(city)
                        setIsOpen(false)
                      }}
                    >
                      <span className="flex items-center">
                        {selectedCity === city && (
                          <Check className="mr-2 h-4 w-4 text-blue-900" />
                        )}
                        {city}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 text-center py-2">
                  No cities found
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

