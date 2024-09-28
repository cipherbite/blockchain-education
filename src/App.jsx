import React, { Suspense, lazy, useCallback } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";

// Lazy load components for code splitting
const Header = lazy(() => import("./components/Header"));
const Footer = lazy(() => import("./components/Footer"));
const AnimatedSphere = lazy(() => import("./components/AnimatedSphere"));
const BlockchainBasics = lazy(() =>
  import("./components/learning/BlockchainBasics")
);
const Cryptography = lazy(() => import("./components/learning/Cryptography"));
const SmartContracts = lazy(() =>
  import("./components/learning/SmartContracts")
);
const PentestIntro = lazy(() => import("./components/learning/PentestIntro"));
const Home = lazy(() => import("./components/learning/Home"));

// Loading spinner component
const LoadingSpinner = () => <div>Loading...</div>;

// Animated routes component
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/blockchain-basics" element={<BlockchainBasics />} />
            <Route path="/cryptography" element={<Cryptography />} />
            <Route path="/smart-contracts" element={<SmartContracts />} />
            <Route path="/pentest-intro" element={<PentestIntro />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

// Main App component
function App() {
  // Memoize OrbitControls to avoid unnecessary re-renders
  const memoizedOrbitControls = useCallback(
    () => (
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
    ),
    []
  );

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-pine-green">
        <Suspense fallback={<LoadingSpinner />}>
          <Header />
        </Suspense>

        <div className="h-96 w-full relative overflow-hidden mt-20">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.2} />
            <pointLight args={[[10, 10, 10], 0.8]} />
            <Suspense fallback={null}>
              <AnimatedSphere />
            </Suspense>
            {memoizedOrbitControls()}
          </Canvas>
        </div>

        <main className="container mx-auto px-6 py-12 mt-12 flex-grow">
          <AnimatedRoutes />
        </main>

        <Suspense fallback={<LoadingSpinner />}>
          <Footer />
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
