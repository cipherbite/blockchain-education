import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, UserCheck, Code, AlertTriangle } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const vulnerabilityData = [
  { name: "Reentrancy", value: 30 },
  { name: "Access Control", value: 25 },
  { name: "Integer Overflow", value: 20 },
  { name: "Logic Errors", value: 15 },
  { name: "Other", value: 10 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const securityBestPractices = [
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Use Secure Coding Patterns",
    description:
      "Follow established secure coding patterns and use audited libraries.",
  },
  {
    icon: <UserCheck className="w-6 h-6" />,
    title: "Implement Access Controls",
    description:
      "Use proper access controls and role-based permissions in smart contracts.",
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: "Conduct Regular Audits",
    description:
      "Perform regular security audits and use automated analysis tools.",
  },
  {
    icon: <AlertTriangle className="w-6 h-6" />,
    title: "Implement Emergency Stops",
    description:
      "Include emergency stop mechanisms in smart contracts for critical situations.",
  },
];

const BlockchainSecurity = () => {
  const [showVulnerabilityDetails, setShowVulnerabilityDetails] =
    useState(false);
  const [selectedVulnerability, setSelectedVulnerability] = useState(null);

  const handlePieClick = (data) => {
    setSelectedVulnerability(data);
    setShowVulnerabilityDetails(true);
  };

  const vulnerabilityDetails = {
    Reentrancy:
      "Occurs when external contract calls are allowed to make new calls to the calling contract before the first call is finished.",
    "Access Control":
      "Improper implementation of access controls, allowing unauthorized actions.",
    "Integer Overflow":
      "Arithmetic operations reaching the maximum or minimum size of the type, causing unintended behavior.",
    "Logic Errors":
      "Flaws in the business logic of the smart contract leading to unintended states or actions.",
    Other:
      "Various other vulnerabilities including timestamp dependence, front-running, denial of service, etc.",
  };

  return (
    <div className="bg-gray-900 text-gray-100 p-8 rounded-xl shadow-2xl max-w-4xl mx-auto">
      <motion.h2
        className="text-4xl font-bold mb-8 text-center text-indigo-400"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Blockchain Security
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex items-center mb-4">
          <Shield className="w-8 h-8 text-indigo-400 mr-4" />
          <h3 className="text-2xl font-semibold text-indigo-300">Overview</h3>
        </div>
        <p className="text-gray-300 mb-4">
          Blockchain security relies on cryptographic principles, consensus
          mechanisms, and network effects. However, vulnerabilities can still
          exist in smart contract code and wallet implementations. Understanding
          these vulnerabilities and implementing best practices is crucial for
          developing secure blockchain applications.
        </p>
      </motion.div>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h3 className="text-2xl font-semibold mb-4 text-indigo-300">
          Common Smart Contract Vulnerabilities
        </h3>
        <div className="bg-gray-800 p-6 rounded-lg shadow-inner mb-6">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={vulnerabilityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                onClick={handlePieClick}
              >
                {vulnerabilityData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    style={{ cursor: "pointer" }}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-center text-gray-400 mt-4">
            Click on a section to learn more about each vulnerability
          </p>
        </div>
      </motion.div>

      <AnimatePresence>
        {showVulnerabilityDetails && selectedVulnerability && (
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
                {selectedVulnerability.name}
              </h4>
              <p className="text-gray-300 mb-4">
                {vulnerabilityDetails[selectedVulnerability.name]}
              </p>
              <div className="flex justify-between items-center">
                <div className="text-indigo-400 font-semibold">
                  Prevalence: {selectedVulnerability.value}%
                </div>
                <div
                  className="w-16 h-16 rounded-full"
                  style={{
                    backgroundColor:
                      COLORS[
                        vulnerabilityData.findIndex(
                          (v) => v.name === selectedVulnerability.name
                        )
                      ],
                  }}
                ></div>
              </div>
              <button
                className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200 w-full"
                onClick={() => setShowVulnerabilityDetails(false)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h3 className="text-2xl font-semibold mb-4 text-indigo-300">
          Security Best Practices
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {securityBestPractices.map((practice, index) => (
            <motion.div
              key={practice.title}
              className="bg-gray-800 p-4 rounded-lg flex items-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="text-indigo-400 mr-4">{practice.icon}</div>
              <div>
                <h4 className="text-lg font-semibold mb-2 text-indigo-300">
                  {practice.title}
                </h4>
                <p className="text-gray-400">{practice.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="bg-indigo-900 bg-opacity-30 p-6 rounded-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <h3 className="text-xl font-semibold text-indigo-300 mb-4">
          Blockchain Security Layers
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-indigo-200 mb-2">
              1. Network Layer
            </h4>
            <p className="text-gray-300">
              Focuses on securing the peer-to-peer network, preventing Sybil
              attacks, and ensuring proper node communication.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-indigo-200 mb-2">
              2. Consensus Layer
            </h4>
            <p className="text-gray-300">
              Implements mechanisms like Proof of Work or Proof of Stake to
              achieve agreement on the state of the blockchain.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-indigo-200 mb-2">
              3. Data Layer
            </h4>
            <p className="text-gray-300">
              Ensures the integrity and immutability of the blockchain data
              through cryptographic linking of blocks.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-indigo-200 mb-2">
              4. Execution Layer
            </h4>
            <p className="text-gray-300">
              Handles the security of smart contract execution and interaction
              with the blockchain state.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <p className="text-gray-400 mb-4">
          Blockchain security is a complex and evolving field. Staying informed
          about the latest vulnerabilities, attack vectors, and security
          practices is crucial for anyone involved in blockchain development or
          usage.
        </p>
      </motion.div>
    </div>
  );
};

export default BlockchainSecurity;
