import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Search,
  Code,
  AlertTriangle,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const auditProcessData = [
  { name: "Manual Review", hours: 40 },
  { name: "Automated Testing", hours: 20 },
  { name: "Formal Verification", hours: 30 },
  { name: "Reporting", hours: 10 },
];

const vulnerabilityData = [
  { name: "Critical", value: 5 },
  { name: "High", value: 15 },
  { name: "Medium", value: 30 },
  { name: "Low", value: 50 },
];

const COLORS = ["#FF0000", "#FFA500", "#FFFF00", "#00FF00"];

const auditSteps = [
  {
    icon: <Search className="w-8 h-8" />,
    title: "Preliminary Analysis",
    description:
      "Initial assessment of the smart contract's purpose, architecture, and potential risk areas.",
  },
  {
    icon: <Code className="w-8 h-8" />,
    title: "Manual Code Review",
    description:
      "Line-by-line examination of the smart contract code to identify logical errors, security vulnerabilities, and best practice violations.",
  },
  {
    icon: <AlertTriangle className="w-8 h-8" />,
    title: "Automated Testing",
    description:
      "Use of static and dynamic analysis tools to detect common vulnerabilities and test contract behavior under various scenarios.",
  },
  {
    icon: <CheckCircle className="w-8 h-8" />,
    title: "Formal Verification",
    description:
      "Mathematical approach to prove or disprove the correctness of algorithms underlying a smart contract with respect to certain specifications.",
  },
  {
    icon: <FileText className="w-8 h-8" />,
    title: "Reporting",
    description:
      "Compilation of findings, risk assessment, and recommended fixes in a comprehensive audit report.",
  },
];

const SmartContractAuditing = () => {
  const [activeStep, setActiveStep] = useState(null);

  return (
    <div className="bg-gray-900 text-gray-100 p-8 rounded-xl shadow-2xl max-w-4xl mx-auto">
      <motion.h2
        className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Smart Contract Auditing
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <p className="text-gray-300 mb-4">
          Smart contract auditing involves a comprehensive review of smart
          contract code to identify vulnerabilities, logical errors, and
          potential exploits. It's a critical process in ensuring the security
          and reliability of blockchain applications, helping to prevent
          financial losses and maintain user trust.
        </p>
        <div className="flex justify-center">
          <FileText className="w-16 h-16 text-indigo-400" />
        </div>
      </motion.div>

      <motion.div
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h3 className="text-2xl font-semibold mb-6 text-center text-indigo-300">
          The Audit Process
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {auditSteps.map((step, index) => (
            <motion.div
              key={step.title}
              className="bg-gray-800 p-6 rounded-lg text-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => setActiveStep(index)}
            >
              <div className="flex justify-center mb-4 text-indigo-400">
                {step.icon}
              </div>
              <h4 className="text-xl font-semibold mb-2 text-indigo-300">
                {step.title}
              </h4>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {activeStep !== null && (
          <motion.div
            className="bg-gray-800 p-6 rounded-lg mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h4 className="text-2xl font-semibold mb-4 text-indigo-300">
              {auditSteps[activeStep].title}
            </h4>
            <p className="text-gray-300 mb-4">
              {auditSteps[activeStep].description}
            </p>
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
              onClick={() => setActiveStep(null)}
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h3 className="text-2xl font-semibold mb-6 text-center text-indigo-300">
          Time Allocation in Audit Process
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={auditProcessData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip
              contentStyle={{ backgroundColor: "#333", color: "#ccc" }}
            />
            <Bar dataKey="hours" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <h3 className="text-2xl font-semibold mb-6 text-center text-indigo-300">
          Typical Vulnerability Distribution
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={vulnerabilityData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {vulnerabilityData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        className="bg-gradient-to-r from-indigo-900 to-purple-900 p-6 rounded-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <h3 className="text-2xl font-semibold mb-4 text-center text-indigo-300">
          The Importance of Auditing
        </h3>
        <p className="text-gray-300 mb-6">
          Smart contract audits are crucial for ensuring the security and
          reliability of blockchain applications. They help identify potential
          vulnerabilities before deployment, reducing the risk of exploits and
          financial losses. Regular audits and following best practices in smart
          contract development are essential for maintaining the integrity and
          trustworthiness of decentralized systems.
        </p>
        <div className="flex justify-center space-x-4">
          <div className="flex items-center">
            <CheckCircle className="w-6 h-6 text-green-400 mr-2" />
            <span>Enhances Security</span>
          </div>
          <div className="flex items-center">
            <AlertCircle className="w-6 h-6 text-yellow-400 mr-2" />
            <span>Mitigates Risks</span>
          </div>
          <div className="flex items-center">
            <XCircle className="w-6 h-6 text-red-400 mr-2" />
            <span>Prevents Losses</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SmartContractAuditing;
