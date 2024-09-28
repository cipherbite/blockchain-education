import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiLock, FiCode, FiShield, FiSearch } from "react-icons/fi";

const FeatureCard = ({ icon: Icon, title, description, link, color }) => (
  <motion.div
    className={`bg-elegant-dark/80 backdrop-blur-lg rounded-xl p-6 flex flex-col items-start transition-all duration-300 ${color}`}
    whileHover={{ scale: 1.05, y: -10 }}
  >
    <Icon className="text-4xl mb-4" />
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-elegant-light/80 mb-4">{description}</p>
    <Link
      to={link}
      className="mt-auto inline-flex items-center text-elegant-accent hover:underline"
    >
      Learn more
      <span className="ml-2 text-lg">→</span>
    </Link>
  </motion.div>
);

const featureData = [
  {
    icon: FiLock,
    title: "Blockchain Basics",
    description:
      "Master the fundamental concepts and architecture of blockchain technology.",
    link: "/blockchain-basics",
    color: "hover:bg-blue-600/20",
  },
  {
    icon: FiCode,
    title: "Cryptography",
    description:
      "Dive deep into the cryptographic principles ensuring blockchain security.",
    link: "/cryptography",
    color: "hover:bg-green-600/20",
  },
  {
    icon: FiShield,
    title: "Smart Contracts",
    description:
      "Learn to develop and audit secure smart contracts for various platforms.",
    link: "/smart-contracts",
    color: "hover:bg-yellow-600/20",
  },
  {
    icon: FiSearch,
    title: "Penetration Testing",
    description:
      "Acquire advanced techniques to identify and mitigate blockchain vulnerabilities.",
    link: "/pentest-intro",
    color: "hover:bg-red-600/20",
  },
];

const Home = () => {
  const featuresRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (featuresRef.current) {
        featuresRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 1100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-elegant-darker to-elegant-dark">
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-4xl md:text-6xl font-bold text-elegant-light text-center">
          Welcome to Blockchain Security
        </h1>
      </div>

      <motion.div
        ref={featuresRef}
        className="container mx-auto px-4 py-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featureData.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
