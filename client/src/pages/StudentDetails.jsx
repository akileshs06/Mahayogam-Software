import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import Logo from '../assets/images/AdminHomeImage.png';

const StudentDetails = () => {
  const { studentId } = useParams();
  const [studentData, setStudentData] = useState({
    attendanceSummary: [],
    feeRecords: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(
          `https://mahayogam-software-f2og.onrender.com/api/students/${studentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const { attendanceSummary = [], feeRecords = [] } = response.data;

        // Process attendance by month and year
        const attendanceByMonth = {};
        attendanceSummary.forEach(({ date, status }) => {
          const [year, month] = date.split('-');
          const key = `${month}/${year}`;
          if (!attendanceByMonth[key]) {
            attendanceByMonth[key] = 0;
          }
          if (status === 'Present') {
            attendanceByMonth[key]++;
          }
        });

        // Create a map of fee records for quick lookup
        const feeRecordsMap = {};
        feeRecords.forEach(({ month, year, status }) => {
          const key = `${month}/${year}`;
          feeRecordsMap[key] = status; // Store the existing status
        });

        setStudentData({ ...response.data, attendanceByMonth, feeRecordsMap });
      } catch (error) {
        console.error('❌ Error fetching student details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [studentId]);

  const toggleFeeStatus = async (month, year) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const key = `${month}/${year}`;
      const currentStatus = studentData.feeRecordsMap[key] || 'Unpaid';
      const newStatus = currentStatus === 'Paid' ? 'Unpaid' : 'Paid';

      // ✅ Send only the required data in the PUT request
      await axios.patch(
        `https://mahayogam-software-f2og.onrender.com/api/students/feeStatus/${studentId}`,
        { month, year, status: newStatus }, // ✅ Sending only necessary data
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Keep the rest of the function unchanged (state updates)
      setStudentData((prevData) => ({
        ...prevData,
        feeRecordsMap: {
          ...prevData.feeRecordsMap,
          [key]: newStatus,
        },
      }));
    } catch (error) {
      console.error('Error updating fee status:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-yellow-300 flex flex-col items-center px-6 py-8">
      <img src={Logo} alt="Mahayogam" className="w-80 h-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {studentData.name}
      </h2>

      <div className="w-full max-w-md bg-red-700 text-white shadow-lg rounded-lg overflow-hidden">
        <div className="grid grid-cols-[1fr_1.5fr_1fr] text-lg font-bold bg-gray-900 py-3 px-4">
          <span className="text-center">Month</span>
          <span className="text-center">Fee Status</span>
          <span className="text-center">Attendance</span>
        </div>
        {Object.keys(studentData.attendanceByMonth).map((key, index) => {
          const attendanceCount = studentData.attendanceByMonth[key] || 0;
          let [month, year] = key.split('/');
          month = Number(month);
          year = Number(year);
          key = '' + month + '/' + year;
          const feeStatus = studentData.feeRecordsMap?.[key] || 'Unpaid';

          return (
            <div
              key={index}
              className="grid grid-cols-[1fr_1.5fr_1fr] items-center text-lg border-b border-gray-300 py-3 px-4"
            >
              <span className="text-center">{key}</span>
              <span className="flex justify-center items-center space-x-3">
                <span
                  className={`text-sm font-bold py-1 px-3 rounded-lg min-w-[70px] text-center ${
                    feeStatus === 'Paid'
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {feeStatus}
                </span>
                <button onClick={() => toggleFeeStatus(month, year)}>
                  {feeStatus === 'Unpaid' ? (
                    <CheckCircle
                      size={20}
                      className="text-white cursor-pointer"
                    />
                  ) : (
                    <XCircle size={20} className="text-white cursor-pointer" />
                  )}
                </button>
              </span>
              <span className="text-center font-semibold">
                {attendanceCount}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentDetails;
