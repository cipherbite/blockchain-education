import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Key, Lock, Unlock } from "lucide-react";

const AsymmetricEncryption = () => {
  const [message, setMessage] = useState("Hello, World!");
  const [publicKey, setPublicKey] = useState({ e: 65537, n: 3233 });
  const [privateKey, setPrivateKey] = useState({ d: 2753, n: 3233 });
  const [encryptedMessage, setEncryptedMessage] = useState("");
  const [decryptedMessage, setDecryptedMessage] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Simple modular exponentiation for RSA
    const modPow = (base, exponent, modulus) => {
      if (modulus === 1) return 0;
      let result = 1;
      base = base % modulus;
      while (exponent > 0) {
        if (exponent % 2 === 1) {
          result = (result * base) % modulus;
        }
        exponent = Math.floor(exponent / 2);
        base = (base * base) % modulus;
      }
      return result;
    };

    // Encrypt
    const encrypted = message
      .split("")
      .map((char) => modPow(char.charCodeAt(0), publicKey.e, publicKey.n));
    setEncryptedMessage(encrypted.join(","));

    // Decrypt
    const decrypted = encrypted.map((code) =>
      String.fromCharCode(modPow(code, privateKey.d, privateKey.n))
    );
    setDecryptedMessage(decrypted.join(""));
  }, [message, publicKey, privateKey]);

  const commonAlgorithms = [
    { name: "RSA", description: "Widely used for secure data transmission" },
    {
      name: "ECC",
      description: "Elliptic Curve Cryptography, offers smaller key sizes",
    },
    {
      name: "Diffie-Hellman",
      description: "Used for secure key exchange over public channels",
    },
    {
      name: "ElGamal",
      description: "Based on the difficulty of computing discrete logarithms",
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
        Asymmetric Encryption
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <p className="text-gray-300 mb-4">
          Asymmetric encryption uses a pair of keys: public and private. It's
          more computationally intensive but solves the key distribution
          problem. The public key can be freely shared, while the private key
          must be kept secret. This allows for secure communication without
          prior key exchange.
        </p>

        <div className="bg-gray-800 p-6 rounded-lg shadow-inner mb-6">
          <h3 className="text-2xl font-semibold mb-4 text-indigo-300">
            Interactive RSA Demo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Message
              </label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Public Key (e, n)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={publicKey.e}
                  onChange={(e) =>
                    setPublicKey({ ...publicKey, e: parseInt(e.target.value) })
                  }
                  className="w-1/2 bg-gray-700 text-white px-3 py-2 rounded-md"
                />
                <input
                  type="number"
                  value={publicKey.n}
                  onChange={(e) =>
                    setPublicKey({ ...publicKey, n: parseInt(e.target.value) })
                  }
                  className="w-1/2 bg-gray-700 text-white px-3 py-2 rounded-md"
                />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Encrypted Message
            </label>
            <div className="bg-gray-700 text-white px-3 py-2 rounded-md break-all">
              {encryptedMessage}
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Decrypted Message
            </label>
            <div className="bg-gray-700 text-white px-3 py-2 rounded-md break-all">
              {decryptedMessage}
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
                  Asymmetric Encryption Process
                </h4>
                <div className="flex flex-col items-center mb-4">
                  <div className="text-center mb-4">
                    <div className="text-gray-400 mb-2">Original Message</div>
                    <div className="bg-gray-700 px-3 py-2 rounded-md">
                      {message}
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotateY: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Key className="w-8 h-8 text-indigo-400" />
                  </motion.div>
                  <div className="text-center mt-4">
                    <div className="text-gray-400 mb-2">Encrypted Message</div>
                    <div className="bg-gray-700 px-3 py-2 rounded-md overflow-hidden text-ellipsis">
                      {encryptedMessage}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <div className="text-gray-400 mb-2">Public Key</div>
                    <div className="bg-gray-700 px-3 py-2 rounded-md">
                      <Unlock className="inline-block mr-2 text-green-400" />(
                      {publicKey.e}, {publicKey.n})
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400 mb-2">Private Key</div>
                    <div className="bg-gray-700 px-3 py-2 rounded-md">
                      <Lock className="inline-block mr-2 text-red-400" />(
                      {privateKey.d}, {privateKey.n})
                    </div>
                  </div>
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
          Common Asymmetric Encryption Algorithms
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
          Advantages and Challenges of Asymmetric Encryption
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-indigo-200 mb-2">Advantages</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>Solves the key distribution problem</li>
              <li>Provides digital signatures and non-repudiation</li>
              <li>Enables secure communication without prior shared secrets</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-indigo-200 mb-2">Challenges</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>
                Computationally intensive, slower than symmetric encryption
              </li>
              <li>Key sizes are generally larger</li>
              <li>Requires a robust public key infrastructure (PKI)</li>
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
          This simplified RSA demo illustrates the basic principle of asymmetric
          encryption. In practice, much larger prime numbers are used for
          security, and asymmetric encryption is often combined with symmetric
          encryption for optimal performance and security.
        </p>
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-indigo-700 transition-colors duration-200">
          Explore Advanced Cryptography Concepts
        </button>
      </motion.div>
    </div>
  );
};

export default AsymmetricEncryption;
