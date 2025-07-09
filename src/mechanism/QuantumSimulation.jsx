import React, { useState, useEffect } from 'react';
import { Play, RotateCcw } from 'lucide-react';

const QuantumSimulation = () => {
  const [activeTab, setActiveTab] = useState('superposition');
  const [isAnimating, setIsAnimating] = useState(false);
  const [qubitState, setQubitState] = useState([1, 0]); // |0⟩ state
  const [measurementResult, setMeasurementResult] = useState(null);
  const [interferencePhase, setInterferencePhase] = useState(0);

  // Matrix operations for quantum gates
  const matrices = {
    I: [[1, 0], [0, 1]], // Identity
    X: [[0, 1], [1, 0]], // Pauli-X (NOT gate)
    Y: [[0, -1], [1, 0]], // Pauli-Y
    Z: [[1, 0], [0, -1]], // Pauli-Z
    H: [[1/Math.sqrt(2), 1/Math.sqrt(2)], [1/Math.sqrt(2), -1/Math.sqrt(2)]] // Hadamard
  };

  // Matrix multiplication for 2x2 * 2x1
  const matrixMultiply = (matrix, vector) => {
    return [
      matrix[0][0] * vector[0] + matrix[0][1] * vector[1],
      matrix[1][0] * vector[0] + matrix[1][1] * vector[1]
    ];
  };

  // Apply quantum gate
  const applyGate = (gate) => {
    const newState = matrixMultiply(matrices[gate], qubitState);
    setQubitState(newState);
    setMeasurementResult(null);
  };

  // Quantum measurement simulation
  const measureQubit = () => {
    const prob0 = Math.pow(Math.abs(qubitState[0]), 2);
    // const prob1 = Math.pow(Math.abs(qubitState[1]), 2);
    const result = Math.random() < prob0 ? 0 : 1;
    setMeasurementResult(result);
    setQubitState(result === 0 ? [1, 0] : [0, 1]);
  };

  // Reset to |0⟩ state
  const resetQubit = () => {
    setQubitState([1, 0]);
    setMeasurementResult(null);
  };

  // Animation for wave interference
  useEffect(() => {
    if (activeTab === 'interference' && isAnimating) {
      const interval = setInterval(() => {
        setInterferencePhase(prev => (prev + 0.1) % (2 * Math.PI));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [activeTab, isAnimating]);

  const SuperpositionDemo = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Qubit State: |ψ⟩</h3>
        <div className="bg-gray-100 p-3 rounded font-mono">
          {qubitState[0].toFixed(3)}|0⟩ + {qubitState[1].toFixed(3)}|1⟩
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="text-center">
          <div className="text-sm text-gray-600">|0⟩ Probability</div>
          <div 
            className="bg-blue-500 text-white text-sm py-1 rounded"
            style={{ width: `${Math.pow(Math.abs(qubitState[0]), 2) * 100}%` }}
          >
            {(Math.pow(Math.abs(qubitState[0]), 2) * 100).toFixed(1)}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">|1⟩ Probability</div>
          <div 
            className="bg-red-500 text-white text-sm py-1 rounded"
            style={{ width: `${Math.pow(Math.abs(qubitState[1]), 2) * 100}%` }}
          >
            {(Math.pow(Math.abs(qubitState[1]), 2) * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => applyGate('H')} className="px-3 py-1 bg-purple-500 text-white rounded text-sm">
          H Gate
        </button>
        <button onClick={() => applyGate('X')} className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
          X Gate
        </button>
        <button onClick={() => applyGate('Y')} className="px-3 py-1 bg-green-500 text-white rounded text-sm">
          Y Gate
        </button>
        <button onClick={() => applyGate('Z')} className="px-3 py-1 bg-yellow-500 text-white rounded text-sm">
          Z Gate
        </button>
      </div>

      <div className="flex gap-2">
        <button onClick={measureQubit} className="px-4 py-2 bg-red-600 text-white rounded">
          Measure
        </button>
        <button onClick={resetQubit} className="px-4 py-2 bg-gray-500 text-white rounded">
          <RotateCcw className="w-4 h-4 inline mr-1" />
          Reset
        </button>
      </div>

      {measurementResult !== null && (
        <div className="text-center p-3 bg-yellow-100 rounded">
          Measured: |{measurementResult}⟩
        </div>
      )}
    </div>
  );

  const InterferenceDemo = () => {
    const wave1 = (x, t) => Math.sin(x - t);
    const wave2 = (x, t) => Math.sin(x - t + Math.PI/2);
    const interference = (x, t) => wave1(x, t) + wave2(x, t);
    
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Wave Interference</h3>
          <button 
            onClick={() => setIsAnimating(!isAnimating)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            <Play className="w-4 h-4 inline mr-1" />
            {isAnimating ? 'Pause' : 'Start'} Animation
          </button>
        </div>
        
        <svg width="300" height="200" className="border rounded mx-auto block">
          {/* Wave 1 */}
          <path
            d={`M 0 ${100 + 30 * wave1(0, interferencePhase)} ${Array.from({length: 60}, (_, i) => 
              `L ${i * 5} ${100 + 30 * wave1(i * 0.3, interferencePhase)}`
            ).join(' ')}`}
            stroke="blue"
            strokeWidth="2"
            fill="none"
          />
          
          {/* Wave 2 */}
          <path
            d={`M 0 ${100 + 30 * wave2(0, interferencePhase)} ${Array.from({length: 60}, (_, i) => 
              `L ${i * 5} ${100 + 30 * wave2(i * 0.3, interferencePhase)}`
            ).join(' ')}`}
            stroke="red"
            strokeWidth="2"
            fill="none"
          />
          
          {/* Interference pattern */}
          <path
            d={`M 0 ${100 + 20 * interference(0, interferencePhase)} ${Array.from({length: 60}, (_, i) => 
              `L ${i * 5} ${100 + 20 * interference(i * 0.3, interferencePhase)}`
            ).join(' ')}`}
            stroke="purple"
            strokeWidth="3"
            fill="none"
          />
        </svg>
        
        <div className="text-center text-sm">
          <div><span className="text-blue-500">■</span> Wave 1</div>
          <div><span className="text-red-500">■</span> Wave 2</div>
          <div><span className="text-purple-500">■</span> Interference</div>
        </div>
      </div>
    );
  };

  const EntanglementDemo = () => {
    const [entangled, setEntangled] = useState(false);
    const [particle1, setParticle1] = useState('?');
    const [particle2, setParticle2] = useState('?');
    
    const createEntanglement = () => {
      setEntangled(true);
      setParticle1('?');
      setParticle2('?');
    };
    
    const measureParticle = (particleNum) => {
      if (!entangled) return;
      
      const result = Math.random() < 0.5 ? '↑' : '↓';
      const opposite = result === '↑' ? '↓' : '↑';
      
      if (particleNum === 1) {
        setParticle1(result);
        setParticle2(opposite);
      } else {
        setParticle2(result);
        setParticle1(opposite);
      }
    };
    
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Quantum Entanglement</h3>
          <button 
            onClick={createEntanglement}
            className="px-4 py-2 bg-purple-500 text-white rounded"
          >
            Create Entangled Pair
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 border rounded">
            <div className="text-lg font-semibold mb-2">Particle A</div>
            <div className="text-4xl mb-2">{particle1}</div>
            <button 
              onClick={() => measureParticle(1)}
              disabled={!entangled || particle1 !== '?'}
              className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Measure
            </button>
          </div>
          
          <div className="text-center p-4 border rounded">
            <div className="text-lg font-semibold mb-2">Particle B</div>
            <div className="text-4xl mb-2">{particle2}</div>
            <button 
              onClick={() => measureParticle(2)}
              disabled={!entangled || particle2 !== '?'}
              className="px-3 py-1 bg-red-500 text-white rounded disabled:bg-gray-300"
            >
              Measure
            </button>
          </div>
        </div>
        
        {entangled && (
          <div className="text-center text-sm text-gray-600">
            {particle1 === '?' ? 'Particles are entangled. Measuring one instantly affects the other!' : 
             'Measurement complete. Entanglement broken.'}
          </div>
        )}
      </div>
    );
  };

  const tabs = [
    { id: 'superposition', label: 'Superposition', component: SuperpositionDemo },
    { id: 'interference', label: 'Interference', component: InterferenceDemo },
    { id: 'entanglement', label: 'Entanglement', component: EntanglementDemo }
  ];

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white">
      <h1 className="text-2xl font-bold text-center mb-6">Quantum Physics Simulation</h1>
      
      <div className="flex border-b mb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium ${
              activeTab === tab.id 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="min-h-96">
        {tabs.find(tab => tab.id === activeTab)?.component()}
      </div>
    </div>
  );
};

export default QuantumSimulation;