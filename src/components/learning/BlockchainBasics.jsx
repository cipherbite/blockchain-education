// BlockchainBasics.jsx
import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Introduction from "./basicsElements/Introduction";
import KeyConcepts from "./basicsElements/KeyConcepts";
import InteractiveDemo from "./basicsElements/InteractiveDemo";
import Mining from "./basicsElements/Mining";

const sections = [
  { id: "intro", title: "Introduction" },
  { id: "concepts", title: "Key Concepts" },
  { id: "demo", title: "Interactive Demo" },
  { id: "mining", title: "Mining" },
];

const BlockchainBasics = () => {
  const initialBlocks = useMemo(
    () => [
      {
        hash: "000abc...",
        prevHash: "000000...",
        nonce: 1234,
        timestamp: Date.now(),
      },
      {
        hash: "000def...",
        prevHash: "000abc...",
        nonce: 5678,
        timestamp: Date.now() + 1000,
      },
      {
        hash: "000ghi...",
        prevHash: "000def...",
        nonce: 9101,
        timestamp: Date.now() + 2000,
      },
    ],
    []
  );

  const [blocks, setBlocks] = useState(initialBlocks);
  const [activeSection, setActiveSection] = useState("intro");

  const addBlock = useCallback(() => {
    setBlocks((prevBlocks) => [
      ...prevBlocks,
      {
        hash: Math.random().toString(36).substring(7),
        prevHash: prevBlocks[prevBlocks.length - 1].hash,
        nonce: Math.floor(Math.random() * 10000),
        timestamp: Date.now(),
      },
    ]);
  }, []);

  const renderSection = useCallback(() => {
    switch (activeSection) {
      case "intro":
        return <Introduction blocks={blocks} addBlock={addBlock} />;
      case "concepts":
        return <KeyConcepts />;
      case "demo":
        return <InteractiveDemo />;
      case "mining":
        return <Mining />;
      default:
        return null;
    }
  }, [activeSection, blocks, addBlock]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Header />
      <Navigation
        sections={sections}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderSection()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const Header = () => (
  <motion.h1
    className="text-4xl font-bold mb-8 text-center text-elegant-accent opacity-90"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 0.9, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    Blockchain Fundamentals
  </motion.h1>
);

const Navigation = ({ sections, activeSection, setActiveSection }) => (
  <nav className="mb-8">
    <ul className="flex justify-center space-x-4 flex-wrap">
      {sections.map((section) => (
        <motion.li
          key={section.id}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <button
            className={`px-4 py-2 rounded ${
              activeSection === section.id
                ? "bg-elegant-accent bg-opacity-80 text-elegant-dark"
                : "bg-elegant-dark bg-opacity-60 text-elegant-accent"
            } transition-colors`}
            onClick={() => setActiveSection(section.id)}
          >
            {section.title}
          </button>
        </motion.li>
      ))}
    </ul>
  </nav>
);

export default BlockchainBasics;
