import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hash, Lock, Shield, Info } from "lucide-react";
import debounce from "lodash.debounce";

const algorithms = [
  { name: "SHA-256", value: "SHA-256" },
  { name: "SHA-512", value: "SHA-512" },
  { name: "SHA-3-256", value: "SHA3-256" },
  { name: "SHA-3-512", value: "SHA3-512" },
];

const hashInfo = {
  "SHA-256":
    "SHA-256 is widely used in blockchain, producing a 256-bit (32-byte) hash value.",
  "SHA-512":
    "SHA-512 creates a 512-bit (64-byte) hash, offering even greater security.",
  "SHA3-256":
    "SHA3-256 is part of the newer SHA-3 family, also producing a 256-bit hash.",
  "SHA3-512":
    "SHA3-512 is the 512-bit version of SHA-3, offering high security for critical applications.",
};

const InteractiveDemo = () => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hash, setHash] = useState("");
  const [algorithm, setAlgorithm] = useState("SHA-256");
  const [showInfo, setShowInfo] = useState(false);

  const hashMessage = useCallback(async (msg, algo) => {
    if (!msg) {
      setHash("");
      return;
    }
    setIsLoading(true);
    const encoder = new TextEncoder();
    const data = encoder.encode(msg);
    const hashBuffer = await crypto.subtle.digest(algo, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    setHash(hashHex);
    setIsLoading(false);
  }, []);

  const debouncedHashMessage = useMemo(
    () => debounce((msg, algo) => hashMessage(msg, algo), 300),
    [hashMessage]
  );

  const handleChange = (e) => {
    const msg = e.target.value;
    setMessage(msg);
    debouncedHashMessage(msg, algorithm);
  };

  const handleAlgorithmChange = (e) => {
    const algo = e.target.value;
    setAlgorithm(algo);
    hashMessage(message, algo);
  };

  const visualHash = useMemo(() => {
    if (!hash) return null;
    const colors = [];
    for (let i = 0; i < hash.length; i += 6) {
      colors.push("#" + hash.substr(i, 6));
    }
    return colors;
  }, [hash]);

  return (
    <div className="bg-gray-900 text-white p-8 rounded-xl shadow-2xl max-w-4xl mx-auto">
      <motion.h2
        className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Interactive Hashing Demonstration
      </motion.h2>

      <motion.div
        className="mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Select Hashing Algorithm
        </label>
        <div className="flex items-center space-x-4">
          <select
            value={algorithm}
            onChange={handleAlgorithmChange}
            className="bg-gray-800 border border-gray-700 p-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {algorithms.map((algo) => (
              <option key={algo.value} value={algo.value}>
                {algo.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-2 rounded transition duration-300"
          >
            <Info size={20} />
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showInfo && (
          <motion.div
            className="bg-gray-800 p-4 rounded mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <p className="text-sm text-gray-300">{hashInfo[algorithm]}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Enter a message to hash
        </label>
        <input
          type="text"
          value={message}
          onChange={handleChange}
          className="bg-gray-800 border border-gray-700 p-3 text-white w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Type your message here..."
        />
        <button
          onClick={() => hashMessage(message, algorithm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center transition duration-300 w-full"
          disabled={isLoading}
        >
          <Hash className="mr-2" size={18} />
          {isLoading ? "Hashing..." : "Generate Hash"}
        </button>
      </motion.div>

      <AnimatePresence>
        {hash && (
          <motion.div
            className="bg-gray-800 p-6 rounded"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-indigo-400 flex items-center">
              <Lock className="mr-2" size={20} />
              {algorithm} Hash Result:
            </h3>
            <p className="font-mono text-sm break-all mb-4">{hash}</p>
            <div className="flex flex-wrap gap-1 mb-4">
              {visualHash &&
                visualHash.map((color, index) => (
                  <div
                    key={index}
                    style={{ backgroundColor: color }}
                    className="w-6 h-6 rounded"
                    title={`Byte ${index + 1}`}
                  ></div>
                ))}
            </div>
            <p className="text-sm text-gray-400">
              This visual representation shows how small changes in the input
              can result in drastically different hash outputs, demonstrating
              the "avalanche effect" in cryptographic hash functions.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="mt-8 bg-gray-800 p-6 rounded"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h3 className="text-xl font-semibold mb-4 text-indigo-400 flex items-center">
          <Shield className="mr-2" size={20} />
          Why Hashing Matters in Blockchain
        </h3>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Ensures data integrity by detecting any changes to the input</li>
          <li>
            Creates unique, fixed-size representations of data, regardless of
            input size
          </li>
          <li>
            Used in creating block hashes and in the Proof of Work consensus
            mechanism
          </li>
          <li>
            Crucial for securing transactions and maintaining the blockchain's
            immutability
          </li>
        </ul>
      </motion.div>
    </div>
  );
};

export default React.memo(InteractiveDemo);
