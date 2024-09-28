import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  Lock,
  ChevronRight,
  Server,
  Users,
  BookOpen,
  AlertCircle,
  Clock,
  Hash,
  Key,
  Shield,
} from "lucide-react";

const InfoSection = React.memo(
  ({ icon: Icon, title, content, explanation }) => (
    <div className="mb-8">
      <div className="flex items-start mb-2">
        <Icon className="w-8 h-8 mr-4 text-indigo-400 flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-xl font-semibold mb-2 text-indigo-300">
            {title}
          </h3>
          <p className="text-gray-300">{content}</p>
        </div>
      </div>
      {explanation && (
        <div className="ml-12 mt-2 bg-gray-800 p-4 rounded-lg">
          <p className="text-sm text-gray-400">{explanation}</p>
        </div>
      )}
    </div>
  )
);

const infoSections = [
  {
    icon: Database,
    title: "What is Blockchain?",
    content:
      "A distributed, immutable ledger for secure, peer-to-peer transactions without central authority.",
    explanation:
      "Think of blockchain as a digital ledger book that's copied across many computers. Each 'page' (block) contains a list of transactions. Once a page is filled and added to the book, it can't be changed or removed. This ensures that all transactions are permanent and can be verified by anyone.",
  },
  {
    icon: Lock,
    title: "How Does It Work?",
    content:
      "Chain of cryptographically linked blocks containing transactions, resistant to tampering.",
    explanation:
      "Each block contains a unique code (hash) of the previous block, creating a chain. If someone tries to alter a block, it changes this code, breaking the chain. This makes it nearly impossible to tamper with the history of transactions without being detected.",
  },
  {
    icon: Server,
    title: "Decentralization",
    content:
      "Distributes data across network nodes, enhancing security and reducing single points of failure.",
    explanation:
      "Instead of having one central server (like a bank), blockchain spreads information across many computers. This means there's no single point that can be hacked or shut down, making the system more resilient and harder to attack.",
  },
  {
    icon: Users,
    title: "Consensus Mechanisms",
    content:
      "Algorithms ensuring network-wide agreement on the ledger state, preventing fraud.",
    explanation:
      "Before a new block is added, computers in the network must agree it's valid. It's like a voting system where the majority must approve any change. This prevents any single entity from manipulating the blockchain.",
  },
  {
    icon: BookOpen,
    title: "Smart Contracts",
    content:
      "Self-executing contracts automating processes and enabling complex, condition-based transactions.",
    explanation:
      "Imagine a vending machine that not only dispenses snacks but can handle complex deals. Smart contracts are like that - they automatically execute actions when certain conditions are met, without needing a middleman.",
  },
  {
    icon: AlertCircle,
    title: "Challenges",
    content:
      "Includes scalability, energy consumption, regulatory uncertainties, and adoption barriers.",
    explanation:
      "As more people use blockchain, it can slow down (scalability issue). Some blockchains use a lot of energy. There's also confusion about how to regulate this new technology, and many people still don't understand or trust it.",
  },
  {
    icon: Key,
    title: "Cryptography in Blockchain",
    content:
      "Uses advanced mathematical techniques to secure transactions and control the creation of new units.",
    explanation:
      "Cryptography in blockchain is like a super-secure lock system. It ensures that only the rightful owner can access their assets, verifies the authenticity of transactions, and helps create new 'coins' in a controlled manner.",
  },
  {
    icon: Shield,
    title: "Blockchain Security",
    content:
      "Combines cryptography, decentralization, and consensus to create a highly secure system.",
    explanation:
      "Blockchain security is like a fortress with multiple defense layers. Cryptography acts as unbreakable locks, decentralization spreads the treasure so there's no single point to attack, and consensus ensures that any change needs approval from the majority.",
  },
];

const BlockchainSimulator = () => {
  const [showMore, setShowMore] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const [isMining, setIsMining] = useState(false);
  const [nonce, setNonce] = useState(0);

  const addBlock = useCallback(() => {
    setIsMining(true);
    setNonce(0);
  }, []);

  useEffect(() => {
    if (isMining) {
      const interval = setInterval(() => {
        setNonce((prevNonce) => prevNonce + 1);
        if (Math.random() < 0.1) {
          // 10% chance of finding a valid block
          setIsMining(false);
          setBlocks((prevBlocks) => [
            ...prevBlocks,
            {
              index: prevBlocks.length,
              nonce: nonce,
              hash: Math.random().toString(36).substring(2, 15),
              timestamp: new Date().toISOString(),
            },
          ]);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isMining, nonce]);

  const visibleInfoSections = useMemo(
    () => (showMore ? infoSections : infoSections.slice(0, 3)),
    [showMore]
  );

  const BlockComponent = React.memo(({ block, isLast }) => (
    <motion.div
      className={`bg-gray-800 p-4 rounded-lg ${
        isLast ? "border-2 border-indigo-500" : ""
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Database className="w-6 h-6 mr-2 text-indigo-400" />
          <span className="font-semibold">Block {block.index}</span>
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1 text-gray-400" />
          <span className="text-sm text-gray-400">
            {new Date(block.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>
      <div className="mt-2 flex items-center">
        <Hash className="w-4 h-4 mr-1 text-purple-400" />
        <span className="text-sm text-purple-400">{block.hash}</span>
      </div>
      <div className="mt-1 text-sm text-gray-400">Nonce: {block.nonce}</div>
      {!isLast && <div className="mt-2 text-center text-indigo-400">↓</div>}
    </motion.div>
  ));

  return (
    <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text">
        Interactive Blockchain Simulator
      </h2>

      {visibleInfoSections.map((section) => (
        <InfoSection key={section.title} {...section} />
      ))}

      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {infoSections.slice(3).map((section) => (
              <InfoSection key={section.title} {...section} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mt-6">
        <motion.button
          className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-full font-bold transition-all flex items-center"
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 0px 8px rgb(124, 58, 237)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={addBlock}
          disabled={isMining}
        >
          {isMining ? "Mining..." : "Mine New Block"}
          <ChevronRight className="ml-2 w-5 h-5" />
        </motion.button>

        <motion.button
          className="text-indigo-400 underline"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? "Show Less" : "Learn More"}
        </motion.button>
      </div>

      {isMining && (
        <div className="mt-4 text-yellow-400">
          Mining in progress... Nonce: {nonce}
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4">
          Blockchain Visualization
        </h3>
        <div className="space-y-4">
          {blocks.map((block, index) => (
            <BlockComponent
              key={block.index}
              block={block}
              isLast={index === blocks.length - 1}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 bg-gray-800 p-6 rounded-lg">
        <h4 className="text-xl font-semibold mb-4 text-indigo-300">
          How This Simulator Works
        </h4>
        <p className="text-gray-300 mb-4">
          This simulator demonstrates the basic process of creating new blocks
          in a blockchain:
        </p>
        <ol className="list-decimal list-inside text-gray-300 space-y-2">
          <li>Click "Mine New Block" to start the mining process.</li>
          <li>
            The system will try different "nonce" values (you'll see this number
            increasing rapidly).
          </li>
          <li>
            When a valid "nonce" is found (simulated here with a 10% chance each
            try), a new block is created.
          </li>
          <li>
            The new block contains a unique hash, timestamp, and the successful
            nonce value.
          </li>
          <li>
            Blocks are added to the chain, with each new block pointing to the
            previous one (shown by the arrows).
          </li>
        </ol>
        <p className="text-gray-300 mt-4">
          In a real blockchain, mining involves solving complex mathematical
          problems. This process ensures that adding new blocks requires
          computational work, making it difficult to tamper with the
          blockchain's history.
        </p>
      </div>

      <p className="text-sm text-gray-400 italic mt-4">
        Click 'Mine New Block' to simulate adding a new block to the blockchain.
      </p>
    </div>
  );
};

export default React.memo(BlockchainSimulator);
