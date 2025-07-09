import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Settings } from 'lucide-react';

const QuantumSimulation = () => {
  const [activeTab, setActiveTab] = useState('superposition');
  const [isAnimating, setIsAnimating] = useState(false);
  const [qubitState, setQubitState] = useState([1, 0]); // |0⟩ state
  const [measurementResult, setMeasurementResult] = useState(null);
  const [interferencePhase, setInterferencePhase] = useState(0);

  // User input controls
  const [customAngle, setCustomAngle] = useState(0);
  const [waveFrequency, setWaveFrequency] = useState(1);
  const [waveAmplitude, setWaveAmplitude] = useState(1);
  const [phaseShift, setPhaseShift] = useState(0);
  const [measurementCount, setMeasurementCount] = useState(0);
  const [measurementHistory, setMeasurementHistory] = useState([]);

  // Matrix operations for quantum gates
  const matrices = {
    I: [[1, 0], [0, 1]], // Identity
    X: [[0, 1], [1, 0]], // Pauli-X (NOT gate)
    Y: [[0, -1], [1, 0]], // Pauli-Y
    Z: [[1, 0], [0, -1]], // Pauli-Z
    H: [[0.707, 0.707], [0.707, -0.707]], // Hadamard
    // Custom rotation gate
    R: (angle) => [[Math.cos(angle/2), -Math.sin(angle/2)], [Math.sin(angle/2), Math.cos(angle/2)]]
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
    const matrix = gate === 'R' ? matrices.R(customAngle * Math.PI / 180) : matrices[gate];
    const newState = matrixMultiply(matrix, qubitState);
    setQubitState(newState);
    setMeasurementResult(null);
  };

  // Quantum measurement simulation
  const measureQubit = () => {
    const prob0 = Math.pow(Math.abs(qubitState[0]), 2);
    const result = Math.random() < prob0 ? 0 : 1;
    setMeasurementResult(result);
    setMeasurementCount(prev => prev + 1);
    setMeasurementHistory(prev => [...prev.slice(-9), result]);
    setQubitState(result === 0 ? [1, 0] : [0, 1]);
  };

  // Reset to |0⟩ state
  const resetQubit = () => {
    setQubitState([1, 0]);
    setMeasurementResult(null);
    setMeasurementCount(0);
    setMeasurementHistory([]);
  };

  // Animation for wave interference
  useEffect(() => {
    let interval;
    if (activeTab === 'interference' && isAnimating) {
      interval = setInterval(() => {
        setInterferencePhase(prev => (prev + 0.1) % (2 * Math.PI));
      }, 50);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTab, isAnimating]);

  // Bloch sphere visualization component
  const BlochSphere = ({ state }) => {
    const [alpha, beta] = state;
    const theta = 2 * Math.acos(Math.abs(alpha));
    const phi = Math.arg ? Math.arg(beta/alpha) : 0;

    const x = Math.sin(theta) * Math.cos(phi);
    const y = Math.sin(theta) * Math.sin(phi);
    const z = Math.cos(theta);

    const sphereRadius = 60;
    const centerX = 80;
    const centerY = 80;

    return (
      <div className="text-center w-full max-w-xs mx-auto"> {/* Added w-full max-w-xs mx-auto */}
        <h4 className="text-sm font-medium mb-2">Bloch Sphere</h4>
        <svg width="160" height="160" className="border rounded mx-auto"> {/* Added mx-auto */}
          {/* Sphere outline */}
          <circle cx={centerX} cy={centerY} r={sphereRadius} fill="none" stroke="#e5e7eb" strokeWidth="2" />

          {/* Axes */}
          <line x1={centerX - sphereRadius} y1={centerY} x2={centerX + sphereRadius} y2={centerY} stroke="#9ca3af" strokeWidth="1" />
          <line x1={centerX} y1={centerY - sphereRadius} x2={centerX} y2={centerY + sphereRadius} stroke="#9ca3af" strokeWidth="1" />

          {/* Equator */}
          <ellipse cx={centerX} cy={centerY} rx={sphereRadius} ry={sphereRadius * 0.3} fill="none" stroke="#d1d5db" strokeWidth="1" />

          {/* State vector */}
          <line
            x1={centerX}
            y1={centerY}
            x2={centerX + x * sphereRadius}
            y2={centerY - z * sphereRadius}
            stroke="#3b82f6"
            strokeWidth="3"
            markerEnd="url(#arrowhead)"
          />

          {/* Arrow marker */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
            </marker>
          </defs>

          {/* Labels */}
          <text x={centerX + sphereRadius + 5} y={centerY + 5} className="text-xs fill-gray-600">|+⟩</text>
          <text x={centerX - sphereRadius - 15} y={centerY + 5} className="text-xs fill-gray-600">|-⟩</text>
          <text x={centerX - 5} y={centerY - sphereRadius - 5} className="text-xs fill-gray-600">|0⟩</text>
          <text x={centerX - 5} y={centerY + sphereRadius + 15} className="text-xs fill-gray-600">|1⟩</text>
        </svg>
      </div>
    );
  };

  const SuperpositionDemo = () => {
    const prob0 = Math.pow(Math.abs(qubitState[0]), 2);
    const prob1 = Math.pow(Math.abs(qubitState[1]), 2);

    return (
      <div className="space-y-4 p-2 sm:p-4 md:p-6"> {/* Added responsive padding */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center"> {/* Changed to col-1 and md:col-2 for mobile stacking */}
          <div className="order-2 md:order-1"> {/* Reordered for better mobile layout */}
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Qubit State: |ψ⟩</h3>
              <div className="bg-gray-100 p-3 rounded font-mono text-sm break-words"> {/* Added break-words */}
                {qubitState[0].toFixed(3)}|0⟩ + {qubitState[1] >= 0 ? '' : '-'}{Math.abs(qubitState[1]).toFixed(3)}|1⟩
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="text-center">
                <div className="text-sm text-gray-600">|0⟩ Probability</div>
                <div className="bg-gray-200 rounded-full h-4 relative">
                  <div
                    className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${prob0 * 100}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-bold">
                    {(prob0 * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">|1⟩ Probability</div>
                <div className="bg-gray-200 rounded-full h-4 relative">
                  <div
                    className="bg-red-500 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${prob1 * 100}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-bold">
                    {(prob1 * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <BlochSphere state={qubitState} className="order-1 md:order-2" /> {/* Reordered for better mobile layout */}
        </div>

        {/* Custom rotation control */}
        <div className="bg-blue-50 p-4 rounded">
          <h4 className="font-medium mb-2">Custom Rotation Gate</h4>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2"> {/* Responsive flex */}
            <label className="text-sm min-w-[50px]">Angle:</label> {/* Added min-w */}
            <input
              type="range"
              min="0"
              max="360"
              value={customAngle}
              onChange={(e) => setCustomAngle(parseInt(e.target.value))}
              className="w-full sm:flex-1" // Full width on small, flex-1 on sm+
            />
            <span className="text-sm w-16 text-right sm:w-12">{customAngle}°</span> {/* Adjusted width and text-align */}
            <button
              onClick={() => applyGate('R')}
              className="px-3 py-1 bg-indigo-500 text-white cursor-pointer rounded text-sm w-full sm:w-auto" // Full width on small, auto on sm+
            >
              Apply
            </button>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap justify-center sm:justify-start"> {/* Centered buttons on small screens */}
          <button onClick={() => applyGate('H')} className="px-3 cursor-pointer py-1 bg-purple-500 text-white rounded text-sm min-w-[80px]"> {/* Added min-width */}
            H Gate
          </button>
          <button onClick={() => applyGate('X')} className="px-3 cursor-pointer py-1 bg-blue-500 text-white rounded text-sm min-w-[80px]">
            X Gate
          </button>
          <button onClick={() => applyGate('Y')} className="px-3 py-1 cursor-pointer bg-green-500 text-white rounded text-sm min-w-[80px]">
            Y Gate
          </button>
          <button onClick={() => applyGate('Z')} className="px-3 py-1 cursor-pointer bg-yellow-500 text-white rounded text-sm min-w-[80px]">
            Z Gate
          </button>
        </div>

        <div className="flex gap-2 justify-center sm:justify-start"> {/* Centered buttons on small screens */}
          <button onClick={measureQubit} className="px-4 py-2 bg-red-600 cursor-pointer text-white rounded w-full sm:w-auto"> {/* Full width on small, auto on sm+ */}
            Measure
          </button>
          <button onClick={resetQubit} className="px-4 py-2 bg-gray-500 cursor-pointer text-white rounded w-full sm:w-auto">
            <RotateCcw className="w-4 h-4 inline mr-1" />
            Reset
          </button>
        </div>

        {/* Measurement results */}
        <div className="bg-gray-50 p-4 rounded">
          <h4 className="font-medium mb-2">Measurement Results (Total: {measurementCount})</h4>
          <div className="flex gap-1 flex-wrap justify-center sm:justify-start"> {/* Centered results on small screens */}
            {measurementHistory.map((result, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded text-sm ${
                  result === 0 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                }`}
              >
                |{result}⟩
              </span>
            ))}
          </div>
        </div>

        {measurementResult !== null && (
          <div className="text-center p-3 bg-yellow-100 rounded">
            <div className="text-lg font-semibold">Measured: |{measurementResult}⟩</div>
          </div>
        )}
      </div>
    );
  };

  const InterferenceDemo = () => {
    const generateWavePoints = (waveFunc) => {
      const points = [];
      for (let i = 0; i < 120; i++) {
        const x = i * 2.5;
        const y = 100 + waveAmplitude * 30 * waveFunc(i * 0.15 * waveFrequency, interferencePhase);
        points.push({ x, y });
      }
      return points;
    };

    const wave1 = (x, t) => Math.sin(x - t);
    const wave2 = (x, t) => Math.sin(x - t + phaseShift);
    const interference = (x, t) => (wave1(x, t) + wave2(x, t)) * 0.5;

    const wave1Points = generateWavePoints(wave1);
    const wave2Points = generateWavePoints(wave2);
    const interferencePoints = generateWavePoints(interference);

    const createPath = (points) => {
      if (points.length === 0) return '';
      return `M ${points[0].x} ${points[0].y} ` +
                  points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
    };

    const interferenceIntensity = Math.abs(Math.cos(phaseShift / 2));

    return (
      <div className="space-y-4 p-2 sm:p-4 md:p-6"> {/* Added responsive padding */}
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Wave Interference</h3>
        </div>

        {/* Wave controls */}
        <div className="bg-blue-50 p-4 rounded space-y-3">
          <h4 className="font-medium">Wave Parameters</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Changed to col-1 and sm:col-2 for mobile stacking */}
            <div>
              <label className="block text-sm mb-1">Frequency: {waveFrequency.toFixed(1)}</label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={waveFrequency}
                onChange={(e) => setWaveFrequency(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Amplitude: {waveAmplitude.toFixed(1)}</label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={waveAmplitude}
                onChange={(e) => setWaveAmplitude(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="sm:col-span-2"> {/* Make phase shift take full width on sm+ */}
              <label className="block text-sm mb-1">Phase Shift: {(phaseShift * 180 / Math.PI).toFixed(0)}°</label>
              <input
                type="range"
                min="0"
                max={2 * Math.PI}
                step="0.1"
                value={phaseShift}
                onChange={(e) => setPhaseShift(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="sm:col-span-2 flex justify-center"> {/* Centered button on sm+ */}
              <button
                onClick={() => setIsAnimating(!isAnimating)}
                className="px-4 py-2 bg-blue-500 text-white cursor-pointer rounded w-full sm:w-auto"
              >
                <Play className="w-4 h-4 inline mr-1" />
                {isAnimating ? 'Pause' : 'Start'}
              </button>
            </div>
          </div>
        </div>

        {/* Interference intensity indicator */}
        <div className="bg-purple-50 p-3 rounded">
          <div className="text-sm font-medium mb-1">Interference Intensity</div>
          <div className="bg-gray-200 rounded-full h-6 relative">
            <div
              className="bg-purple-500 h-6 rounded-full transition-all duration-300"
              style={{ width: `${interferenceIntensity * 100}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-bold">
              {(interferenceIntensity * 100).toFixed(1)}%
            </span>
          </div>
          <div className="text-xs text-gray-600 mt-1 text-center"> {/* Centered text */}
            {interferenceIntensity > 0.8 ? 'Constructive' : interferenceIntensity < 0.2 ? 'Destructive' : 'Partial'} Interference
          </div>
        </div>

        <svg width="100%" height="200" viewBox="0 0 300 200" preserveAspectRatio="xMidYMid meet" className="border rounded mx-auto block"> {/* Added width="100%" and viewBox */}
          <path
            d={createPath(wave1Points)}
            stroke="blue"
            strokeWidth="2"
            fill="none"
            opacity="0.7"
          />
          <path
            d={createPath(wave2Points)}
            stroke="red"
            strokeWidth="2"
            fill="none"
            opacity="0.7"
          />
          <path
            d={createPath(interferencePoints)}
            stroke="purple"
            strokeWidth="4"
            fill="none"
          />
          {/* Center line */}
          <line x1="0" y1="100" x2="300" y2="100" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="5,5" />
        </svg>

        <div className="text-center text-sm space-y-1">
          <div><span className="text-blue-500">■</span> Wave 1</div>
          <div><span className="text-red-500">■</span> Wave 2</div>
          <div><span className="text-purple-500">■</span> Interference Pattern</div>
        </div>
      </div>
    );
  };

  const EntanglementDemo = () => {
    const [entangled, setEntangled] = useState(false);
    const [particle1, setParticle1] = useState('?');
    const [particle2, setParticle2] = useState('?');
    const [entanglementStrength, setEntanglementStrength] = useState(1);
    const [measurementDistance, setMeasurementDistance] = useState(1000);
    const [correlationCount, setCorrelationCount] = useState({ total: 0, correlated: 0 });

    const createEntanglement = () => {
      setEntangled(true);
      setParticle1('?');
      setParticle2('?');
      setCorrelationCount({ total: 0, correlated: 0 });
    };

    const measureParticle = (particleNum) => {
      if (!entangled) return;

      const isCorrelated = Math.random() < entanglementStrength;
      const result = Math.random() < 0.5 ? '↑' : '↓';
      const opposite = result === '↑' ? '↓' : '↑';
      const secondResult = isCorrelated ? opposite : result;

      if (particleNum === 1) {
        setParticle1(result);
        setParticle2(secondResult);
      } else {
        setParticle2(result);
        setParticle1(secondResult);
      }

      setCorrelationCount(prev => ({
        total: prev.total + 1,
        correlated: prev.correlated + (isCorrelated ? 1 : 0)
      }));
    };

    return (
      <div className="space-y-4 p-2 sm:p-4 md:p-6"> {/* Added responsive padding */}
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Quantum Entanglement</h3>
        </div>

        {/* Entanglement controls */}
        <div className="bg-purple-50 p-4 rounded space-y-3">
          <h4 className="font-medium">Entanglement Parameters</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Changed to col-1 and sm:col-2 for mobile stacking */}
            <div>
              <label className="block text-sm mb-1">Entanglement Strength: {(entanglementStrength * 100).toFixed(0)}%</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={entanglementStrength}
                onChange={(e) => setEntanglementStrength(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Distance: {measurementDistance} km</label>
              <input
                type="range"
                min="1"
                max="10000"
                value={measurementDistance}
                onChange={(e) => setMeasurementDistance(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex justify-center"> {/* Centered button */}
            <button
              onClick={createEntanglement}
              className="px-4 py-2 bg-purple-500 cursor-pointer text-white rounded w-full sm:w-auto"
            >
              Create Entangled Pair
            </button>
          </div>
        </div>

        {/* Correlation statistics */}
        {correlationCount.total > 0 && (
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium mb-2">Correlation Statistics</h4>
            <div className="text-sm space-y-1 text-center sm:text-left"> {/* Centered text on small screens */}
              <div>Total Measurements: {correlationCount.total}</div>
              <div>Correlated Results: {correlationCount.correlated}</div>
              <div>Correlation Rate: {((correlationCount.correlated / correlationCount.total) * 100).toFixed(1)}%</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Changed to col-1 and sm:col-2 for mobile stacking */}
          <div className="text-center p-4 sm:p-6 border-2 border-dashed border-blue-300 rounded-lg"> {/* Adjusted padding */}
            <div className="text-lg font-semibold mb-2">Particle A</div>
            <div className="text-5xl sm:text-6xl mb-4">{particle1}</div> {/* Responsive font size */}
            <button
              onClick={() => measureParticle(1)}
              disabled={!entangled || particle1 !== '?'}
              className="px-4 py-2 bg-blue-500 text-white cursor-pointer rounded disabled:bg-gray-300 w-full sm:w-auto"
            >
              Measure
            </button>
            <div className="text-xs text-gray-500 mt-2">Lab A</div>
          </div>

          <div className="text-center p-4 sm:p-6 border-2 border-dashed border-red-300 rounded-lg"> {/* Adjusted padding */}
            <div className="text-lg font-semibold mb-2">Particle B</div>
            <div className="text-5xl sm:text-6xl mb-4">{particle2}</div> {/* Responsive font size */}
            <button
              onClick={() => measureParticle(2)}
              disabled={!entangled || particle2 !== '?'}
              className="px-4 py-2 bg-red-500 text-white rounded cursor-pointer disabled:bg-gray-300 w-full sm:w-auto"
            >
              Measure
            </button>
            <div className="text-xs text-gray-500 mt-2">Lab B ({measurementDistance} km away)</div>
          </div>
        </div>

        {entangled && (
          <div className="text-center p-3 bg-yellow-100 rounded text-sm sm:text-base"> {/* Responsive font size */}
            {particle1 === '?' ?
              `Particles are entangled with ${(entanglementStrength * 100).toFixed(0)}% strength. Measuring one instantly affects the other!` :
              `Measurement complete. ${particle1 === (particle2 === '↑' ? '↓' : '↑') ? 'Anti-correlated' : 'Same'} result observed.`
            }
          </div>
        )}
      </div>
    );
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'superposition':
        return <SuperpositionDemo />;
      case 'interference':
        return <InterferenceDemo />;
      case 'entanglement':
        return <EntanglementDemo />;
      default:
        return <SuperpositionDemo />;
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-lg rounded-lg my-6"> {/* Wider max-width, more responsive padding, added shadow/rounded/margin */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800"> {/* Responsive font size */}
        Interactive Quantum Physics Simulation
      </h1>

      <div className="flex flex-col sm:flex-row border-b mb-6 text-sm sm:text-base"> {/* Responsive flex, smaller text on small */}
        <button
          onClick={() => setActiveTab('superposition')}
          className={`flex-1 px-3 py-2 sm:px-6 sm:py-3 font-medium cursor-pointer transition-colors border-b-2 sm:border-b-0 sm:border-r-2 last:border-r-0 ${ /* Responsive borders */
            activeTab === 'superposition'
              ? 'border-blue-500 text-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Superposition
        </button>
        <button
          onClick={() => setActiveTab('interference')}
          className={`flex-1 px-3 py-2 sm:px-6 sm:py-3 cursor-pointer font-medium transition-colors border-b-2 sm:border-b-0 sm:border-r-2 last:border-r-0 ${
            activeTab === 'interference'
              ? 'border-blue-500 text-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Interference
        </button>
        <button
          onClick={() => setActiveTab('entanglement')}
          className={`flex-1 px-3 py-2 sm:px-6 sm:py-3 font-medium cursor-pointer transition-colors border-b-2 sm:border-b-0 ${
            activeTab === 'entanglement'
              ? 'border-blue-500 text-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Entanglement
        </button>
      </div>

      <div className="min-h-96">
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default QuantumSimulation;