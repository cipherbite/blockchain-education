import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Book,
  Code,
  Shield,
  AlertTriangle,
  Zap,
  Terminal,
  BarChart2,
} from "lucide-react";

import IntroSection from "./contractsElements/IntroSection";
import StructureSection from "./contractsElements/StructureSection";
import SecuritySection from "./contractsElements/SecuritySection";
import VulnerabilitiesSection from "./contractsElements/VulnerabilitiesSection";
import OptimizationSection from "./contractsElements/OptimizationSection";
import SimulationSection from "./contractsElements/SimulationSection";
import TrendsSection from "./contractsElements/TrendsSection";

const sections = [
  { id: "intro", title: "Introduction", icon: Book },
  { id: "structure", title: "Structure", icon: Code },
  { id: "security", title: "Security", icon: Shield },
  { id: "vulnerabilities", title: "Vulnerabilities", icon: AlertTriangle },
  { id: "optimization", title: "Optimization", icon: Zap },
  { id: "simulation", title: "Simulation", icon: Terminal },
  { id: "trends", title: "Trends", icon: BarChart2 },
];

const SmartContracts = () => {
  const [activeSection, setActiveSection] = useState("intro");
  const [userProgress, setUserProgress] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    const completedSections =
      sections.findIndex((section) => section.id === activeSection) + 1;
    setUserProgress((completedSections / sections.length) * 100);
  }, [activeSection]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const renderSection = useCallback(() => {
    switch (activeSection) {
      case "intro":
        return <IntroSection />;
      case "structure":
        return <StructureSection />;
      case "security":
        return <SecuritySection />;
      case "vulnerabilities":
        return <VulnerabilitiesSection />;
      case "optimization":
        return <OptimizationSection />;
      case "simulation":
        return <SimulationSection />;
      case "trends":
        return <TrendsSection />;
      default:
        return null;
    }
  }, [activeSection]);

  const handleSectionClick = useCallback((id) => {
    setActiveSection(id);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="h-screen flex items-center justify-center">
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-indigo-400 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Smart Contracts: Security and Best Practices
        </motion.h1>
      </div>

      <motion.div
        ref={contentRef}
        className="bg-slate-900 rounded-lg shadow-lg p-6 max-w-6xl mx-auto mb-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <nav className="mb-8">
          <ul className="flex flex-wrap justify-center gap-4">
            {sections.map((section) => (
              <motion.li
                key={section.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  className={`px-4 py-2 rounded-full flex items-center ${
                    activeSection === section.id
                      ? "bg-indigo-500 text-white"
                      : "bg-slate-800 text-slate-300 border border-indigo-500"
                  }`}
                  onClick={() => handleSectionClick(section.id)}
                >
                  <section.icon size={18} className="mr-2" />
                  {section.title}
                </button>
              </motion.li>
            ))}
          </ul>
        </nav>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SmartContracts;
