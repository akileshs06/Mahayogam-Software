import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaPlus, FaTimes } from 'react-icons/fa';
import AdminHomeImage from '../assets/images/AdminHomeImage.png';

const AdminBatches = () => {
  const { city: cityId } = useParams(); // Get city ID from URL
  const location = useLocation();
  const navigate = useNavigate();

  const [batches, setBatches] = useState([]); // Store fetched batches
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [batchName, setBatchName] = useState(''); // New batch name

  // Retrieve the city name from state (passed from AdminCities)
  const cityName = location.state?.place || 'Unknown City';

  // Fetch batches from API
  const fetchBatches = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(
        `https://mahayogam-software-f2og.onrender.com/api/batches/${cityId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch batches');

      const data = await response.json();
      setBatches(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, [cityId]);

  // Function to create a new batch
  const handleCreateBatch = async () => {
    if (!batchName.trim()) return;

    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(
        'https://mahayogam-software-f2og.onrender.com/api/batches',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ placeId: cityId, name: batchName }),
        }
      );

      if (!response.ok) throw new Error('Failed to create batch');

      setBatchName(''); // Clear input
      setShowModal(false); // Close modal
      fetchBatches(); // Reload batches
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center px-4 py-8 md:hidden relative">
      <img src={AdminHomeImage} alt="Logo" className="w-80 h-auto mb-6" />

      {/* Display city name */}
      <h2 className="text-3xl font-extrabold text-gray-800 bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text mb-8">
        Batches in {cityName}
      </h2>

      {/* Search Bar */}
      <div className="relative w-full max-w-md mb-6">
        <input
          type="text"
          placeholder="Search batch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 pl-12 pr-12 text-black border border-gray-300 bg-white rounded-full shadow-md focus:outline-none text-lg"
        />
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">
          🔍
        </span>
      </div>

      {/* Batch List */}
      <div className="w-full max-w-md flex flex-col gap-4">
        {batches
          .filter((batch) =>
            batch.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((batch) => (
            <button
              key={batch._id}
              onClick={() =>
                navigate(`/admin-attendance/${batch._id}`, {
                  state: { batchName: batch.name },
                })
              }
              className="w-full py-3 bg-yellow-950 text-white rounded-lg shadow-md text-lg font-semibold hover:bg-gray-100 transition"
            >
              {batch.name}
            </button>
          ))}
      </div>

      {/* Add New Batch Button */}
      <button
        onClick={() => setShowModal(true)}
        className="mt-6 flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-blue-700 transition"
      >
        <FaPlus /> Add New Batch
      </button>

      {/* Add Batch Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-md">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Create New Batch</h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setBatchName(''); // Clear input on cancel
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <input
              type="text"
              placeholder="Enter batch name"
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex justify-between mt-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  setBatchName(''); // Clear input on cancel
                }}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBatch}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
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

export default AdminBatches;
