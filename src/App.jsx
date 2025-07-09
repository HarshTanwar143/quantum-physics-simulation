import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import QuantumSimulation from './mechanism/QuantumSimulation';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white flex flex-col items-center px-6 py-12 space-y-16">

      {/* Header Section */}
      <motion.div
        className="text-center max-w-3xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-transparent bg-clip-text drop-shadow-lg mb-6"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          Quantum Physics Simulation
        </motion.h1>

        <p className="text-lg text-gray-300 mb-8">
          Dive into the fascinating world of quantum mechanics! Explore superposition, entanglement, and interference through interactive simulations.
        </p>

        <motion.button
          onClick={() => navigate('/simulate')}
          className="px-8 py-3 bg-white text-indigo-700 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition-transform transform hover:scale-105"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Simulation 🚀
        </motion.button>
      </motion.div>

      {/* Info Section */}
      <motion.div
        className="max-w-5xl w-full text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        <h2 className="text-3xl font-bold mb-6">What is Quantum Physics?</h2>
        <p className="text-gray-300 mb-10">
          Quantum physics explains the behavior of matter and energy on the smallest scales. It defies classical logic and introduces strange yet fascinating concepts.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Concept 1 */}
          <motion.div
            className="bg-white/10 p-6 rounded-lg backdrop-blur hover:bg-white/20 transition"
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="text-xl font-semibold mb-2">🌀 Superposition</h3>
            <p className="text-gray-300 text-sm">
              A qubit can exist in both |0⟩ and |1⟩ states at once—until it’s measured.
            </p>
          </motion.div>

          {/* Concept 2 */}
          <motion.div
            className="bg-white/10 p-6 rounded-lg backdrop-blur hover:bg-white/20 transition"
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="text-xl font-semibold mb-2">🔗 Entanglement</h3>
            <p className="text-gray-300 text-sm">
              Entangled particles affect each other’s states instantly, regardless of distance.
            </p>
          </motion.div>

          {/* Concept 3 */}
          <motion.div
            className="bg-white/10 p-6 rounded-lg backdrop-blur hover:bg-white/20 transition"
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="text-xl font-semibold mb-2">🌊 Interference</h3>
            <p className="text-gray-300 text-sm">
              Quantum particles interfere like waves, creating complex patterns.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/simulate" element={<QuantumSimulation />} />
      </Routes>
    </Router>
  );
}

export default App;
