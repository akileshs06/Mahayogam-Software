import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import AdminHomeImage from '../assets/images/AdminHomeImage.png';

const AdminCities = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [cities, setCities] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newPlace, setNewPlace] = useState('');

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get(
        'https://mahayogam-software-f2og.onrender.com/api/places/',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCities(response.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleCityClick = (id, place) => {
    navigate(`/admin/batches/${id}`, { state: { place } });
  };

  const handleAddPlace = async () => {
    if (!newPlace.trim()) return;
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.post(
        'https://mahayogam-software-f2og.onrender.com/api/places/',
        { place: newPlace },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewPlace('');
      setShowPopup(false);
      fetchCities();
    } catch (error) {
      console.error('Error adding place:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center px-4 py-8 md:hidden">
      <img src={AdminHomeImage} alt="Logo" className="w-80 h-auto mb-6" />
      <div className="relative w-full max-w-md mb-6">
        <input
          type="text"
          placeholder="Search city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 pl-12 pr-12 text-black border border-gray-300 bg-white rounded-full shadow-md focus:outline-none text-lg"
        />
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">
          🔍
        </span>
      </div>
      <div className="w-full max-w-md flex flex-col gap-5">
        {cities
          .filter((city) =>
            city.place.toLowerCase().includes(search.toLowerCase())
          )
          .map((city) => (
            <button
              key={city._id}
              onClick={() => handleCityClick(city._id, city.place)}
              className="w-full py-4 bg-yellow-950 text-white rounded-lg shadow-md text-lg font-semibold hover:bg-gray-100 transition"
            >
              {city.place}
            </button>
          ))}
      </div>
      <button
        className="m-8 flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-blue-700 transition"
        onClick={() => {
          setNewPlace('');
          setShowPopup(true);
        }}
      >
        <FaPlus /> Add New
      </button>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-gray-900 bg-opacity-30">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold">Add New Place</h2>
            <input
              type="text"
              placeholder="Enter place name"
              value={newPlace}
              onChange={(e) => setNewPlace(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-4"
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={() => {
                  setNewPlace('');
                  setShowPopup(false);
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPlace}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCities;
