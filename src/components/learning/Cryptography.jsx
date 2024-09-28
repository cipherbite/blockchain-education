import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Key, FileText } from "lucide-react";
import Introduction from "./cryptographyElements/Introduction";
import SymmetricEncryption from "./cryptographyElements/SymmetricEncryption";
import AsymmetricEncryption from "./cryptographyElements/AsymmetricEncryption";
import Security from "./cryptographyElements/Security";
import Auditing from "./cryptographyElements/Auditing";

const sectionComponents = {
  intro: Introduction,
  symmetric: SymmetricEncryption,
  asymmetric: AsymmetricEncryption,
  security: Security,
  auditing: Auditing,
};

const Cryptography = () => {
  const [activeSection, setActiveSection] = useState("intro");
  const contentRef = useRef(null);

  const sections = useMemo(
    () => [
      { id: "intro", title: "Introduction", icon: Shield },
      { id: "symmetric", title: "Symmetric Encryption", icon: Lock },
      { id: "asymmetric", title: "Asymmetric Encryption", icon: Key },
      { id: "security", title: "Security", icon: Shield },
      { id: "auditing", title: "Auditing", icon: FileText },
    ],
    []
  );

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

  const SectionButton = ({ section }) => (
    <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <button
        className={`px-4 py-2 rounded-full flex items-center transition-colors duration-300 ${
          activeSection === section.id
            ? "bg-elegant-accent text-elegant-dark"
            : "bg-elegant-dark text-elegant-accent border border-elegant-accent hover:bg-elegant-accent hover:text-elegant-dark"
        }`}
        onClick={() => setActiveSection(section.id)}
      >
        <section.icon size={18} className="mr-2" />
        {section.title}
      </button>
    </motion.li>
  );

  const ActiveSection = sectionComponents[activeSection];

  return (
    <div className="min-h-screen bg-gradient-to-b from-elegant-darker to-elegant-dark">
      <div className="h-screen flex items-center justify-center">
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-elegant-accent text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Cryptography and Security in Blockchain
        </motion.h1>
      </div>

      <motion.div
        ref={contentRef}
        className="bg-elegant-dark rounded-lg shadow-lg p-6 max-w-4xl mx-auto mb-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <nav className="mb-8">
          <ul className="flex flex-wrap justify-center gap-4">
            {sections.map((section) => (
              <SectionButton key={section.id} section={section} />
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
            <ActiveSection />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Cryptography;
