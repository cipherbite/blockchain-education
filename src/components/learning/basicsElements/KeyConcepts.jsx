import React, { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Network,
  Key,
  Cpu,
  Code,
  Database,
  UserCheck,
  RefreshCw,
  LockIcon,
  ChevronRight,
  X,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  Zap,
  Layers,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Rozszerzony zestaw danych koncepcji blockchain
const conceptsData = [
  {
    title: "Decentralization",
    description:
      "Distributed control and decision-making across network participants.",
    icon: Network,
    color: "from-purple-500 to-indigo-600",
    details: [
      "Eliminates single points of failure",
      "Reduces intermediaries",
      "Enhances data redundancy",
      "Improves censorship resistance",
      "Increases network resilience",
    ],
    example:
      "Bitcoin's peer-to-peer network enables direct transactions without central authority.",
    explanation:
      "Imagine a traditional bank as a single tree. If it falls, the whole system fails. Decentralization is like a forest - even if some trees fall, the forest survives. In blockchain, this means no single entity controls the network, making it more resilient and democratic.",
    interactiveDemo: "decentralizationDemo",
    quiz: [
      {
        question:
          "What is the main advantage of decentralization in blockchain?",
        options: [
          "Faster transaction processing",
          "Lower energy consumption",
          "Elimination of single points of failure",
          "Easier regulation",
        ],
        correctAnswer: 2,
      },
      {
        question:
          "How does decentralization contribute to censorship resistance?",
        options: [
          "By encrypting all transactions",
          "By distributing control across many participants",
          "By increasing transaction fees",
          "By slowing down the network",
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    title: "Immutability",
    description: "Prevents alteration of recorded data once confirmed.",
    icon: LockIcon,
    color: "from-indigo-500 to-blue-600",
    details: [
      "Ensures data integrity",
      "Creates auditable transaction trail",
      "Builds system trust",
      "Prevents retroactive changes",
      "Enhances security of historical records",
    ],
    example: "Confirmed Bitcoin transactions cannot be reversed or modified.",
    explanation:
      "Think of immutability like carving into stone. Once data is 'carved' into the blockchain, it can't be erased or changed. This property ensures that the history of transactions remains intact and trustworthy, crucial for financial systems and record-keeping.",
    interactiveDemo: "immutabilityDemo",
    quiz: [
      {
        question: "What does immutability mean in the context of blockchain?",
        options: [
          "Data can be easily changed",
          "Data cannot be altered once recorded",
          "Data is always encrypted",
          "Data is stored off-chain",
        ],
        correctAnswer: 1,
      },
      {
        question:
          "How does immutability contribute to building trust in blockchain systems?",
        options: [
          "By making transactions faster",
          "By allowing easy data modification",
          "By ensuring the integrity of historical records",
          "By centralizing control",
        ],
        correctAnswer: 2,
      },
    ],
  },
  // ... (pozostałe koncepcje z poprzedniej wersji, rozszerzone o quiz i interactiveDemo)
  {
    title: "Scalability",
    description:
      "The ability of a blockchain network to handle an increasing amount of transactions.",
    icon: TrendingUp,
    color: "from-green-500 to-teal-600",
    details: [
      "Enables widespread adoption",
      "Reduces transaction costs",
      "Improves network efficiency",
      "Addresses the blockchain trilemma",
      "Enables enterprise-level applications",
    ],
    example:
      "Layer 2 solutions like Bitcoin's Lightning Network or Ethereum's Optimistic Rollups.",
    explanation:
      "Scalability in blockchain is like expanding a highway system. As more cars (transactions) join, we need wider roads and better traffic management to keep things moving smoothly. Solutions like sharding, sidechains, and layer 2 protocols are attempts to solve this challenge.",
    interactiveDemo: "scalabilityDemo",
    quiz: [
      {
        question: "What is the blockchain trilemma?",
        options: [
          "Choosing between security, decentralization, and scalability",
          "Balancing mining rewards, transaction fees, and network speed",
          "Deciding between public, private, and consortium blockchains",
          "Managing memory, CPU, and bandwidth resources",
        ],
        correctAnswer: 0,
      },
      {
        question:
          "Which of the following is NOT a scalability solution for blockchain?",
        options: [
          "Sharding",
          "Sidechains",
          "Increasing block size",
          "Centralization",
        ],
        correctAnswer: 3,
      },
    ],
  },
  {
    title: "Consensus Mechanisms",
    description:
      "Protocols ensuring agreement on the state of the blockchain across all nodes.",
    icon: UserCheck,
    color: "from-cyan-500 to-teal-600",
    details: [
      "Maintains network integrity",
      "Prevents double-spending",
      "Secures the network against attacks",
      "Enables decentralized decision-making",
      "Balances security and efficiency",
    ],
    example:
      "Proof of Work in Bitcoin, Proof of Stake in Ethereum 2.0, Delegated Proof of Stake in EOS.",
    explanation:
      "Consensus mechanisms are like the voting system of the blockchain world. Before any new information is added to the blockchain, the majority of the network must agree it's valid. This prevents any single entity from manipulating the blockchain and ensures everyone has the same version of the truth.",
    interactiveDemo: "consensusDemo",
    quiz: [
      {
        question:
          "What is the main purpose of a consensus mechanism in blockchain?",
        options: [
          "To encrypt transactions",
          "To speed up block creation",
          "To ensure agreement on the state of the blockchain",
          "To reduce transaction fees",
        ],
        correctAnswer: 2,
      },
      {
        question:
          "Which consensus mechanism is known for its high energy consumption?",
        options: [
          "Proof of Stake",
          "Proof of Work",
          "Delegated Proof of Stake",
          "Proof of Authority",
        ],
        correctAnswer: 1,
      },
    ],
  },
];

const ConceptCard = React.memo(
  ({ title, description, icon: Icon, color, onClick }) => (
    <motion.div
      className={`bg-gray-800 p-6 rounded-lg shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl border-l-4 border-transparent hover:border-l-4 hover:border-indigo-500`}
      onClick={onClick}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <div
        className={`flex items-center mb-4 bg-gradient-to-br ${color} p-3 rounded-full w-12 h-12`}
      >
        <Icon className="w-6 h-6 text-white" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
      <div className="mt-4 flex items-center text-indigo-400 hover:text-indigo-300">
        <span className="mr-2">Learn more</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </motion.div>
  )
);

const QuizComponent = ({ quiz, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (selectedAnswer) => {
    if (selectedAnswer === quiz[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < quiz.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
  };

  useEffect(() => {
    if (showResults) {
      onComplete(score);
    }
  }, [showResults, score, onComplete]);

  if (showResults) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-2xl font-bold mb-4">Quiz Results</h3>
        <p className="text-xl mb-4">
          You scored {score} out of {quiz.length}
        </p>
        <button
          onClick={resetQuiz}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  const question = quiz[currentQuestion];

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h3 className="text-2xl font-bold mb-4">
        Question {currentQuestion + 1}
      </h3>
      <p className="text-xl mb-4">{question.question}</p>
      <div className="space-y-2">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            className="w-full text-left bg-gray-700 p-3 rounded hover:bg-gray-600 transition-colors"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

const InteractiveDemo = ({ demoType }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [demoData, setDemoData] = useState([]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setDemoData((prevData) => {
          const newData = [
            ...prevData,
            generateDataPoint(demoType, prevData.length),
          ];
          return newData.slice(-20); // Keep only the last 20 data points
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, demoType]);

  const generateDataPoint = (type, index) => {
    switch (type) {
      case "decentralizationDemo":
        return {
          time: index,
          centralizedFailure: Math.random() * 100,
          decentralizedResilience: 100 - Math.random() * 20,
        };
      case "immutabilityDemo":
        return {
          time: index,
          attemptedChanges: Math.floor(Math.random() * 10),
          successfulChanges: 0,
        };
      case "scalabilityDemo":
        return {
          time: index,
          transactions: Math.floor(Math.random() * 1000) + 500,
          blockSize: Math.floor(Math.random() * 2) + 1,
        };
      case "consensusDemo":
        return {
          time: index,
          nodes: Math.floor(Math.random() * 100) + 50,
          agreement: Math.random() * 20 + 80,
        };
      default:
        return { time: index, value: Math.random() * 100 };
    }
  };

  const renderChart = () => {
    switch (demoType) {
      case "decentralizationDemo":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={demoData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="centralizedFailure"
                stroke="#8884d8"
                name="Centralized Failure Rate"
              />
              <Line
                type="monotone"
                dataKey="decentralizedResilience"
                stroke="#82ca9d"
                name="Decentralized Resilience"
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case "immutabilityDemo":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={demoData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="attemptedChanges"
                stroke="#8884d8"
                name="Attempted Changes"
              />
              <Line
                type="monotone"
                dataKey="successfulChanges"
                stroke="#82ca9d"
                name="Successful Changes"
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case "scalabilityDemo":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={demoData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="transactions"
                stroke="#8884d8"
                name="Transactions per Second"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="blockSize"
                stroke="#82ca9d"
                name="Block Size (MB)"
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case "consensusDemo":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={demoData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="nodes"
                stroke="#8884d8"
                name="Active Nodes"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="agreement"
                stroke="#82ca9d"
                name="Consensus Agreement %"
              />
            </LineChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold">
          Interactive Demo: {demoType.replace("Demo", "")}
        </h3>
        <div className="space-x-2">
          {isRunning ? (
            <button
              onClick={() => setIsRunning(false)}
              className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-colors"
            >
              <Pause className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setIsRunning(true)}
              className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition-colors"
            >
              <Play className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => setDemoData([])}
            className="bg-gray-600 text-white p-2 rounded hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
      {renderChart()}
      <div className="mt-4 text-sm text-gray-400">
        This interactive demo simulates key aspects of{" "}
        {demoType.replace("Demo", "")} in blockchain technology. Start/stop the
        simulation to see how different factors interact over time.
      </div>
    </div>
  );
};

const ConceptModal = React.memo(({ concept, onClose }) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleQuizComplete = (score) => {
    setQuizCompleted(true);
    // Here you could add logic to save the score or unlock new content
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-900 p-8 rounded-lg max-w-4xl w-full text-white my-8"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div
              className={`bg-gradient-to-br ${concept.color} p-3 rounded-full mr-4`}
            >
              <concept.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold">{concept.title}</h3>
          </div>
          <button
            className="bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600 transition-colors duration-200"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <p className="mb-6 text-lg text-gray-300">{concept.description}</p>
        <div className="mb-6">
          <h4 className="text-xl font-semibold mb-3 text-indigo-300">
            Key Points:
          </h4>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            {concept.details.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
        </div>
        <div className="bg-gray-800 p-4 rounded-md mb-6">
          <h4 className="text-xl font-semibold mb-2 text-indigo-300">
            Example:
          </h4>
          <p className="text-gray-300">{concept.example}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-md mb-6">
          <h4 className="text-xl font-semibold mb-2 text-indigo-300">
            Explanation:
          </h4>
          <p className="text-gray-300">{concept.explanation}</p>
        </div>
        <div className="mb-6">
          <h4 className="text-xl font-semibold mb-3 text-indigo-300">
            Interactive Demonstration:
          </h4>
          <InteractiveDemo demoType={concept.interactiveDemo} />
        </div>
        {!showQuiz && !quizCompleted && (
          <button
            onClick={() => setShowQuiz(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
          >
            Take Quiz
          </button>
        )}
        {showQuiz && !quizCompleted && (
          <QuizComponent quiz={concept.quiz} onComplete={handleQuizComplete} />
        )}
        {quizCompleted && (
          <div className="bg-green-600 text-white p-4 rounded-md">
            Congratulations! You've completed the quiz. Explore more concepts to
            deepen your understanding of blockchain technology.
          </div>
        )}
      </motion.div>
    </motion.div>
  );
});

const KeyConcepts = () => {
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [completedConcepts, setCompletedConcepts] = useState([]);

  const conceptCards = useMemo(
    () =>
      conceptsData.map((concept) => (
        <ConceptCard
          key={concept.title}
          {...concept}
          onClick={() => setSelectedConcept(concept)}
        />
      )),
    []
  );

  const closeModal = useCallback(() => {
    setSelectedConcept(null);
    // You could add logic here to mark the concept as viewed/completed
    setCompletedConcepts((prev) =>
      prev.includes(selectedConcept?.title)
        ? prev
        : [...prev, selectedConcept?.title]
    );
  }, [selectedConcept]);

  const progressPercentage =
    (completedConcepts.length / conceptsData.length) * 100;

  return (
    <div className="bg-gray-900 text-white p-8 rounded-xl shadow-2xl max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text">
        Mastering Blockchain: Interactive Learning Platform
      </h2>

      <div className="mb-8 bg-gray-800 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Your Learning Progress</h3>
        <div className="w-full bg-gray-700 rounded-full h-4 dark:bg-gray-700">
          <div
            className="bg-indigo-600 h-4 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="mt-2 text-gray-400">
          {completedConcepts.length} out of {conceptsData.length} concepts
          explored
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {conceptCards}
      </motion.div>

      <AnimatePresence>
        {selectedConcept && (
          <ConceptModal concept={selectedConcept} onClose={closeModal} />
        )}
      </AnimatePresence>

      <div className="mt-12 bg-gray-800 p-6 rounded-lg">
        <h3 className="text-2xl font-semibold mb-4 text-indigo-300">
          Why Learn Blockchain?
        </h3>
        <p className="text-gray-300 mb-4">
          Blockchain technology is revolutionizing industries beyond just
          cryptocurrency. By understanding these key concepts, you're preparing
          yourself for the future of:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-300">
          <li>Decentralized Finance (DeFi)</li>
          <li>Supply Chain Management</li>
          <li>Digital Identity and Privacy</li>
          <li>Voting Systems</li>
          <li>Intellectual Property and Copyright Protection</li>
        </ul>
      </div>
    </div>
  );
};

export default React.memo(KeyConcepts);
