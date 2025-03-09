import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      navigate('/admin-cities');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(
        'https://mahayogam-software-f2og.onrender.com/api/auth/login',
        {
          email,
          password,
        }
      );

      const token = response.data.token;
      localStorage.setItem('jwtToken', token);
      alert('Login successful!');

      navigate('/admin-cities'); // ✅ Redirect after login
    } catch (error) {
      console.log(error);
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center px-4 bg-gradient-to-r from-[#EBC894] to-white md:hidden">
      <div className="absolute inset-0 backdrop-blur-lg"></div>

      <div
        className="relative z-10 shadow-lg rounded-2xl p-6 w-full max-w-sm border border-white/40"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2 className="text-2xl font-bold text-center text-black">Login</h2>
        <p className="text-gray-700 text-center mt-2 text-sm">
          Enter your email and password to log in
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center mt-2">{error}</p>
        )}

        <form className="mt-6" onSubmit={handleLogin}>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 bg-white bg-opacity-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500 text-sm"
            />
          </div>

          <div className="mt-4 relative">
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 bg-white bg-opacity-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500 text-sm"
            />
          </div>

          <div className="flex justify-between items-center mt-4 text-sm text-gray-700">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-blue-500 font-medium">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold text-sm mt-4 hover:bg-blue-700 transition"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
