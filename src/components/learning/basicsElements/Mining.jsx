import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Cpu,
  Zap,
  Clock,
  Database,
  DollarSign,
  StopCircle,
  Send,
  TrendingUp,
  Shield,
  Sliders,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsTimePieChart,
  Pie,
  Cell,
} from "recharts";

// Symulowane dane rynkowe (zaktualizowane do 2025)
const marketData = [
  { date: "2021", price: 29000 },
  { date: "2022", price: 16000 },
  { date: "2023", price: 42000 },
  { date: "2024", price: 65000 },
  { date: "2025", price: 80000 },
];

const difficultyData = [
  { date: "2009", difficulty: 1 },
  { date: "2011", difficulty: 1000 },
  { date: "2013", difficulty: 10000000 },
  { date: "2015", difficulty: 50000000000 },
  { date: "2017", difficulty: 1000000000000 },
  { date: "2019", difficulty: 10000000000000 },
  { date: "2021", difficulty: 20000000000000 },
  { date: "2023", difficulty: 50000000000000 },
  { date: "2025", difficulty: 100000000000000 },
];

const BlockchainMining = () => {
  const [miningStarted, setMiningStarted] = useState(false);
  const [nonce, setNonce] = useState(0);
  const [hash, setHash] = useState("");
  // Removed duplicate declaration
  const [blocks, setBlocks] = useState([]);
  const [reward, setReward] = useState(0);
  const [btcAddress, setBtcAddress] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [hashRate, setHashRate] = useState(0);
  const [energyConsumption, setEnergyConsumption] = useState(0);
  const [miningPoolSize, setMiningPoolSize] = useState(1);
  const [blockchainSize, setBlockchainSize] = useState(0);
  const [miningHistory, setMiningHistory] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(80000); // Cena BTC w 2025
  const [networkHashRate, setNetworkHashRate] = useState(1000000000); // 1 EH/s
  const [miningHardware, setMiningHardware] = useState("CPU");
  // Removed unused transactions state
  const [mempool, setMempool] = useState([]);
  const [blockReward, setBlockReward] = useState(3.125); // Nagroda za blok po halvingu 2024
  const [halving, setHalving] = useState(false);
  const [blockTime, setBlockTime] = useState(10); // Docelowy czas bloku w minutach
  const [difficulty, setDifficulty] = useState(5e13); // Początkowa trudność
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [showAdvancedStats, setShowAdvancedStats] = useState(false);

  const miningInterval = useRef(null);

  const calculateHash = useCallback((nonce) => {
    return (Math.sin(nonce) * 10000).toString(16).substring(2, 10);
  }, []);

  const adjustDifficulty = useCallback(() => {
    const averageBlockTime =
      blocks.length > 0
        ? (Date.now() - blocks[0].timestamp) / (blocks.length * 60000)
        : 10;

    if (averageBlockTime < blockTime * 0.9) {
      setDifficulty((prev) => prev * 1.1);
    } else if (averageBlockTime > blockTime * 1.1) {
      setDifficulty((prev) => prev * 0.9);
    }
  }, [blocks, blockTime]);

  const mine = useCallback(() => {
    setNonce((prevNonce) => prevNonce + 1);
    const newHash = calculateHash(nonce);
    setHash(newHash);

    let newHashRate;
    let newEnergyConsumption;

    switch (miningHardware) {
      case "CPU":
        newHashRate = 1000 * simulationSpeed;
        newEnergyConsumption = 0.1 * simulationSpeed;
        break;
      case "GPU":
        newHashRate = 30000 * simulationSpeed;
        newEnergyConsumption = 0.3 * simulationSpeed;
        break;
      case "ASIC":
        newHashRate = 100000 * simulationSpeed;
        newEnergyConsumption = 0.5 * simulationSpeed;
        break;
      default:
        newHashRate = 1000 * simulationSpeed;
        newEnergyConsumption = 0.1 * simulationSpeed;
    }

    setHashRate(newHashRate);
    setEnergyConsumption(
      (prevConsumption) => prevConsumption + newEnergyConsumption
    );

    if (newHash.startsWith("0".repeat(difficulty))) {
      const blockReward = halving ? 1.5625 : 3.125; // Uwzględnienie halvingu
      const transactionFees = mempool.reduce((sum, tx) => sum + tx.fee, 0);
      const totalReward = (blockReward + transactionFees) / miningPoolSize;

      setReward((prevReward) => prevReward + totalReward);
      const newBlock = {
        nonce,
        hash: newHash,
        reward: totalReward,
        transactions: mempool.slice(0, 10), // Włączenie transakcji do bloku
        timestamp: Date.now(),
      };
      setBlocks((prevBlocks) => [...prevBlocks, newBlock]);
      setBlockchainSize((prevSize) => prevSize + 1);
      setMiningHistory((prevHistory) => [
        ...prevHistory,
        { time: new Date().toLocaleTimeString(), reward: totalReward },
      ]);
      setMempool((prevMempool) => prevMempool.slice(10)); // Usunięcie przetworzonych transakcji z mempoola
      adjustDifficulty();
      alert(`Block mined successfully! Reward: ${totalReward.toFixed(8)} BTC`);
    }
  }, [
    nonce,
    difficulty,
    calculateHash,
    miningPoolSize,
    miningHardware,
    simulationSpeed,
    mempool,
    halving,
    adjustDifficulty,
  ]);

  useEffect(() => {
    if (miningStarted) {
      miningInterval.current = setInterval(mine, 100 / simulationSpeed);
    } else {
      clearInterval(miningInterval.current);
    }
    return () => clearInterval(miningInterval.current);
  }, [miningStarted, mine, simulationSpeed]);

  useEffect(() => {
    // Symulacja transakcji w mempoolu
    const transactionInterval = setInterval(() => {
      if (mempool.length < 100) {
        // Ograniczenie rozmiaru mempoola
        const newTransaction = {
          id: Math.random().toString(36).substr(2, 9),
          amount: Math.random() * 10,
          fee: Math.random() * 0.1,
        };
        setMempool((prevMempool) => [...prevMempool, newTransaction]);
      }
    }, 5000 / simulationSpeed);

    return () => clearInterval(transactionInterval);
  }, [simulationSpeed, mempool.length]);

  const handleStartMining = () => {
    setMiningStarted(true);
    setNonce(0);
    setHash("");
  };

  const handleStopMining = () => {
    setMiningStarted(false);
  };

  const handleWithdraw = () => {
    if (withdrawAmount <= reward && withdrawAmount > 0) {
      alert(`Withdrawn ${withdrawAmount} BTC to address: ${btcAddress}`);
      setReward((prevReward) => prevReward - withdrawAmount);
      setWithdrawAmount(0);
      // Removed unused transactions state update
    } else {
      alert("Invalid withdrawal amount");
    }
  };

  const handleHalving = () => {
    setHalving(true);
    setBlockReward((prevReward) => prevReward / 2);
    alert("Halving event occurred! Block reward has been halved.");
  };

  const renderTooltip = (props) => {
    const { active, payload } = props;
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 p-2 rounded">
          <p>{`Date: ${data.date}`}</p>
          <p>{`Difficulty: ${data.difficulty.toExponential(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="bg-gray-900 text-gray-100 p-8 rounded-xl shadow-2xl max-w-6xl mx-auto">
      <motion.h2
        className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-green-500 text-transparent bg-clip-text"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Advanced Blockchain Mining Simulation 2025
      </motion.h2>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-blue-400">
            Mining Difficulty Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={difficultyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#555" />
              <XAxis dataKey="date" stroke="#ccc" />
              <YAxis
                stroke="#ccc"
                scale="log"
                domain={["auto", "auto"]}
                tickFormatter={(value) => value.toExponential(2)}
              />
              <Tooltip content={renderTooltip} />
              <Line type="monotone" dataKey="difficulty" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-blue-400">
            BTC Price History
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={marketData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#555" />
              <XAxis dataKey="date" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip
                contentStyle={{ backgroundColor: "#333", color: "#ccc" }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        className="mb-8 bg-gray-800 p-6 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h3 className="text-2xl font-semibold mb-4 text-blue-400">
          Mining Control Center
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-gray-400">Current Nonce:</p>
            <p className="text-2xl font-mono">{nonce}</p>
          </div>
          <div>
            <p className="text-gray-400">Current Hash:</p>
            <p className="text-2xl font-mono">{hash || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-400">Difficulty:</p>
            <p className="text-2xl font-mono">{difficulty.toExponential(2)}</p>
          </div>
          <div>
            <p className="text-gray-400">Total Reward:</p>
            <p className="text-2xl font-mono">{reward.toFixed(8)} BTC</p>
          </div>
          <div>
            <p className="text-gray-400">Hash Rate:</p>
            <p className="text-2xl font-mono">{hashRate.toFixed(2)} H/s</p>
          </div>
          <div>
            <p className="text-gray-400">Energy Consumption:</p>
            <p className="text-2xl font-mono">
              {energyConsumption.toFixed(2)} kWh
            </p>
          </div>
          <div>
            <p className="text-gray-400">Mining Pool Size:</p>
            <input
              type="number"
              value={miningPoolSize}
              onChange={(e) =>
                setMiningPoolSize(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="bg-gray-700 text-white px-2 py-1 rounded w-16"
            />
          </div>
          <div>
            <p className="text-gray-400">Blockchain Size:</p>
            <p className="text-2xl font-mono">{blockchainSize} blocks</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-gray-400">Mining Hardware:</p>
            <select
              value={miningHardware}
              onChange={(e) => setMiningHardware(e.target.value)}
              className="bg-gray-700 text-white px-2 py-1 rounded w-full"
            >
              <option value="CPU">CPU</option>
              <option value="GPU">GPU</option>
              <option value="ASIC">ASIC</option>
            </select>
          </div>
          <div>
            <p className="text-gray-400">Simulation Speed:</p>
            <input
              type="range"
              min="1"
              max="10"
              value={simulationSpeed}
              onChange={(e) => setSimulationSpeed(parseInt(e.target.value))}
              className="w-full"
            />
            <p className="text-sm text-center">{simulationSpeed}x</p>
          </div>
          <div>
            <p className="text-gray-400">Block Reward:</p>
            <p className="text-2xl font-mono">{blockReward.toFixed(4)} BTC</p>
          </div>
          <div>
            <p className="text-gray-400">Mempool Size:</p>
            <p className="text-2xl font-mono">{mempool.length} txs</p>
          </div>
        </div>
        <div className="flex space-x-4 mb-4">
          <button
            onClick={handleStartMining}
            disabled={miningStarted}
            className={`${
              miningStarted ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
            } text-white font-bold py-2 px-4 rounded transition duration-300 flex-1`}
          >
            {miningStarted ? "Mining in Progress..." : "Start Mining"}
          </button>
          <button
            onClick={handleStopMining}
            disabled={!miningStarted}
            className={`${
              !miningStarted ? "bg-gray-600" : "bg-red-600 hover:bg-red-700"
            } text-white font-bold py-2 px-4 rounded transition duration-300 flex-1`}
          >
            <StopCircle className="inline-block mr-2" />
            Stop Mining
          </button>
          <button
            onClick={handleHalving}
            disabled={halving}
            className={`${
              halving ? "bg-gray-600" : "bg-yellow-600 hover:bg-yellow-700"
            } text-white font-bold py-2 px-4 rounded transition duration-300 flex-1`}
          >
            Trigger Halving
          </button>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => setShowAdvancedStats(!showAdvancedStats)}
            className="text-blue-400 hover:text-blue-300"
          >
            {showAdvancedStats ? "Hide Advanced Stats" : "Show Advanced Stats"}
          </button>
        </div>
      </motion.div>

      {showAdvancedStats && (
        <motion.div
          className="mb-8 bg-gray-800 p-6 rounded-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <h3 className="text-2xl font-semibold mb-4 text-blue-400">
            Advanced Mining Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-400">Network Hash Rate:</p>
              <p className="text-xl font-mono">
                {(networkHashRate / 1e6).toFixed(2)} EH/s
              </p>
            </div>
            <div>
              <p className="text-gray-400">Your Market Share:</p>
              <p className="text-xl font-mono">
                {((hashRate / networkHashRate) * 100).toFixed(6)}%
              </p>
            </div>
            <div>
              <p className="text-gray-400">Estimated Time to Mine Block:</p>
              <p className="text-xl font-mono">
                {(((networkHashRate / hashRate) * 10) / 60).toFixed(2)} hours
              </p>
            </div>
            <div>
              <p className="text-gray-400">Current BTC Price:</p>
              <p className="text-xl font-mono">
                ${currentPrice.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Mining Revenue (24h):</p>
              <p className="text-xl font-mono">
                ${((reward * currentPrice) / (blockchainSize / 144)).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Energy Cost (24h):</p>
              <p className="text-xl font-mono">
                ${(energyConsumption * 0.1).toFixed(2)}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        className="mb-8 bg-gray-800 p-6 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h3 className="text-2xl font-semibold mb-4 text-blue-400">
          Withdraw Mined BTC
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-400 mb-2">BTC Address:</p>
            <input
              type="text"
              value={btcAddress}
              onChange={(e) => setBtcAddress(e.target.value)}
              placeholder="Enter your BTC address"
              className="bg-gray-700 text-white px-2 py-1 rounded w-full"
            />
          </div>
          <div>
            <p className="text-gray-400 mb-2">Withdraw Amount:</p>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) =>
                setWithdrawAmount(parseFloat(e.target.value) || 0)
              }
              placeholder="Enter amount to withdraw"
              className="bg-gray-700 text-white px-2 py-1 rounded w-full"
            />
          </div>
        </div>
        <button
          onClick={handleWithdraw}
          disabled={
            !btcAddress || withdrawAmount <= 0 || withdrawAmount > reward
          }
          className={`${
            !btcAddress || withdrawAmount <= 0 || withdrawAmount > reward
              ? "bg-gray-600"
              : "bg-green-600 hover:bg-green-700"
          } text-white font-bold py-2 px-4 rounded transition duration-300 w-full`}
        >
          <Send className="inline-block mr-2" />
          Withdraw BTC
        </button>
      </motion.div>

      <AnimatePresence>
        {blocks.length > 0 && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h3 className="text-2xl font-semibold mb-4 text-blue-400">
              Recent Blocks
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {blocks
                .slice(-5)
                .reverse()
                .map((block, index) => (
                  <div key={index} className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-400">
                      Block #{blockchainSize - index}
                    </p>
                    <p className="font-mono">Nonce: {block.nonce}</p>
                    <p className="font-mono">Hash: {block.hash}</p>
                    <p className="font-mono">
                      Reward: {block.reward.toFixed(8)} BTC
                    </p>
                    <p className="font-mono">
                      Transactions: {block.transactions.length}
                    </p>
                  </div>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="mb-8 bg-gray-800 p-6 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <h3 className="text-xl font-semibold mb-4 text-blue-400">
          Advanced Mining Concepts
        </h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <Zap className="mr-2 mt-1 text-yellow-400" />
            <span>
              <strong className="text-blue-300">Hash Rate:</strong> The speed at
              which a miner can complete an operation in the cryptocurrency's
              code. Higher hash rates increase the chance of finding the next
              block.
            </span>
          </li>
          <li className="flex items-start">
            <Clock className="mr-2 mt-1 text-green-400" />
            <span>
              <strong className="text-blue-300">Block Time:</strong> The average
              time it takes to create a new block. Bitcoin aims for 10 minutes,
              while other cryptocurrencies may have different target times.
            </span>
          </li>
          <li className="flex items-start">
            <Database className="mr-2 mt-1 text-purple-400" />
            <span>
              <strong className="text-blue-300">Nonce:</strong> A number used
              once in cryptographic communication, which miners change
              repeatedly to get different hashes until they find one that meets
              the difficulty requirement.
            </span>
          </li>
          <li className="flex items-start">
            <DollarSign className="mr-2 mt-1 text-blue-400" />
            <span>
              <strong className="text-blue-300">Mining Pools:</strong> Groups of
              miners who combine their computational resources to increase their
              chances of finding a block and share the rewards proportionally.
            </span>
          </li>
          <li className="flex items-start">
            <Cpu className="mr-2 mt-1 text-red-400" />
            <span>
              <strong className="text-blue-300">ASIC Miners:</strong>{" "}
              Application-Specific Integrated Circuits designed specifically for
              mining cryptocurrencies, offering superior performance and energy
              efficiency compared to general-purpose hardware.
            </span>
          </li>
          <li className="flex items-start">
            <ArrowRight className="mr-2 mt-1 text-orange-400" />
            <span>
              <strong className="text-blue-300">Difficulty Adjustment:</strong>{" "}
              The automatic mechanism that adjusts the mining difficulty to
              maintain a consistent block time as the network's total hash rate
              changes.
            </span>
          </li>
          <li className="flex items-start">
            <TrendingUp className="mr-2 mt-1 text-pink-400" />
            <span>
              <strong className="text-blue-300">Halving:</strong> An event that
              occurs approximately every four years where the block reward is
              cut in half, reducing the rate at which new bitcoins are created
              and increasing scarcity.
            </span>
          </li>
          <li className="flex items-start">
            <Shield className="mr-2 mt-1 text-indigo-400" />
            <span>
              <strong className="text-blue-300">51% Attack:</strong> A
              theoretical attack on a blockchain network where a single entity
              controls more than 50% of the network's mining hash rate,
              potentially allowing them to manipulate the blockchain.
            </span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
};

export default BlockchainMining;
