import React, { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Menu } from "lucide-react";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/blockchain-basics", label: "Blockchain Basics" },
  { path: "/cryptography", label: "Cryptography" },
  { path: "/smart-contracts", label: "Smart Contracts" },
  { path: "/pentest-intro", label: "Pentest Intro" },
];

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const headerBackground = useTransform(
    scrollY,
    [0, 100],
    ["rgba(20, 20, 20, 0)", "rgba(20, 20, 20, 0.9)"]
  );

  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);

  const handleNavigation = useCallback(
    (path) => {
      navigate(path);
      setIsOpen(false);
    },
    [navigate]
  );

  const renderNavItem = useCallback(
    (item) => (
      <motion.button
        key={item.path}
        onClick={() => handleNavigation(item.path)}
        className={`nav-link text-lg font-medium hover:text-blue-400 transition-colors ${
          location.pathname === item.path ? "text-blue-400" : "text-white"
        }`}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        {item.label}
      </motion.button>
    ),
    [location.pathname, handleNavigation]
  );

  const renderMobileNavItem = useCallback(
    (item) => (
      <motion.button
        key={item.path}
        onClick={() => handleNavigation(item.path)}
        className={`block w-full text-left px-6 py-3 text-white hover:bg-gray-700 transition-colors ${
          location.pathname === item.path ? "text-blue-400" : ""
        }`}
        whileHover={{ x: 5 }}
      >
        {item.label}
      </motion.button>
    ),
    [location.pathname, handleNavigation]
  );

  return (
    <motion.header
      style={{ background: headerBackground }}
      className="fixed top-0 left-0 right-0 z-50 bg-dark bg-opacity-80 backdrop-blur-md shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
          >
            Blockchain Security
          </motion.div>
          <div className="hidden md:flex space-x-8">
            {navItems.map(renderNavItem)}
          </div>
          <motion.button
            onClick={toggleMenu}
            className="md:hidden p-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Menu size={24} className="text-white" />
          </motion.button>
        </div>
      </nav>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-gray-900 shadow-lg rounded-b-lg overflow-hidden"
        >
          {navItems.map(renderMobileNavItem)}
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;
