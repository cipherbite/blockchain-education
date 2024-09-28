import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SymmetricEncryption = () => {
  const [plaintext, setPlaintext] = useState("Hello, World!");
  const [key, setKey] = useState("SECRET");
  const [ciphertext, setCiphertext] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Simple XOR encryption for demonstration
    const encrypt = (text, key) => {
      return text
        .split("")
        .map((char, index) =>
          String.fromCharCode(
            char.charCodeAt(0) ^ key.charCodeAt(index % key.length)
          )
        )
        .join("");
    };

    setCiphertext(encrypt(plaintext, key));
  }, [plaintext, key]);

  const commonAlgorithms = [
    {
      name: "AES",
      description:
        "Advanced Encryption Standard, widely used for secure communication",
    },
    {
      name: "DES",
      description:
        "Data Encryption Standard, older algorithm superseded by AES",
    },
    {
      name: "Twofish",
      description:
        "Highly secure algorithm, finalist in the AES selection process",
    },
    {
      name: "Blowfish",
      description: "Fast block cipher, except for changing keys",
    },
  ];

  return (
    <div className="bg-gray-900 text-gray-100 p-8 rounded-xl shadow-2xl max-w-4xl mx-auto">
      <motion.h2
        className="text-4xl font-bold mb-8 text-center text-indigo-400"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Symmetric Encryption
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <p className="text-gray-300 mb-4">
          Symmetric encryption uses the same key for both encryption and
          decryption. It's fast and efficient for large amounts of data, but key
          distribution can be challenging. In symmetric encryption, the security
          of the system relies on keeping the key secret.
        </p>

        <div className="bg-gray-800 p-6 rounded-lg shadow-inner mb-6">
          <h3 className="text-2xl font-semibold mb-4 text-indigo-300">
            Interactive Encryption Demo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Plaintext
              </label>
              <input
                type="text"
                value={plaintext}
                onChange={(e) => setPlaintext(e.target.value)}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Encryption Key
              </label>
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-md"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Ciphertext
            </label>
            <div className="bg-gray-700 text-white px-3 py-2 rounded-md break-all">
              {ciphertext}
            </div>
          </div>
          <button
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
            onClick={() => setShowAnimation(true)}
          >
            Show Encryption Process
          </button>
        </div>

        <AnimatePresence>
          {showAnimation && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-gray-800 p-6 rounded-lg max-w-lg w-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <h4 className="text-xl font-semibold mb-4 text-indigo-300">
                  Encryption Process
                </h4>
                <div className="flex justify-between items-center mb-4">
                  <div className="text-center">
                    <div className="text-gray-400 mb-2">Plaintext</div>
                    <div className="bg-gray-700 px-3 py-2 rounded-md">
                      {plaintext}
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <svg
                      className="w-8 h-8 text-indigo-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                      />
                    </svg>
                  </motion.div>
                  <div className="text-center">
                    <div className="text-gray-400 mb-2">Ciphertext</div>
                    <div className="bg-gray-700 px-3 py-2 rounded-md">
                      {ciphertext}
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400 mb-2">Encryption Key</div>
                  <div className="bg-gray-700 px-3 py-2 rounded-md">{key}</div>
                </div>
                <button
                  className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200 w-full"
                  onClick={() => setShowAnimation(false)}
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h3 className="text-2xl font-semibold mb-4 text-indigo-300">
          Common Symmetric Encryption Algorithms
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {commonAlgorithms.map((algo, index) => (
            <motion.div
              key={algo.name}
              className="bg-gray-800 p-4 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <h4 className="text-lg font-semibold mb-2 text-indigo-300">
                {algo.name}
              </h4>
              <p className="text-gray-400">{algo.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="bg-indigo-900 bg-opacity-30 p-6 rounded-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h3 className="text-xl font-semibold text-indigo-300 mb-4">
          Advantages and Challenges of Symmetric Encryption
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-indigo-200 mb-2">Advantages</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>Fast and efficient for large data sets</li>
              <li>Requires minimal computational resources</li>
              <li>Simpler to implement compared to asymmetric encryption</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-indigo-200 mb-2">Challenges</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>Secure key exchange can be difficult</li>
              <li>Key management becomes complex with many participants</li>
              <li>Doesn't provide non-repudiation</li>
            </ul>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <p className="text-gray-400 mb-4">
          While the example above uses a simple XOR cipher for demonstration,
          modern symmetric encryption algorithms like AES are much more complex
          and secure, forming the backbone of many secure communication systems.
        </p>
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-indigo-700 transition-colors duration-200">
          Learn More About Cryptography
        </button>
      </motion.div>
    </div>
  );
};

export default SymmetricEncryption;
