import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Book,
  Globe,
  Code,
  Zap,
  Shield,
  ChevronRight,
  Check,
  AlertTriangle,
  TrendingUp,
  FileQuestion,
  Cpu,
  GitBranch,
  Eye,
  Brain,
  BookOpen,
  Lock,
} from "lucide-react";

const TABS = {
  BENEFITS: "benefits",
  CHALLENGES: "challenges",
};

const MOTION_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const IntroSection = () => {
  const [activeExample, setActiveExample] = useState(0);
  const [activeTab, setActiveTab] = useState(TABS.BENEFITS);
  const [hoveredBenefit, setHoveredBenefit] = useState(null);

  const examples = useMemo(
    () => [
      {
        title: "Decentralized Finance (DeFi)",
        description:
          "Smart contracts power lending protocols, decentralized exchanges, and yield farming platforms, enabling financial services without traditional intermediaries.",
        code: `pragma solidity ^0.8.0;

contract SimpleLending {
    // Security: Use of access control
    <span className="bg-purple-500 bg-opacity-20">mapping(address => uint) private balances;
    mapping(address => uint) private borrowedAmount;</span>

    // Security: Proper use of msg.value
    <span className="bg-indigo-500 bg-opacity-20">function deposit() public payable {
        balances[msg.sender] += msg.value;
    }</span>

    // Security: Check-Effects-Interactions pattern
    <span className="bg-purple-500 bg-opacity-20">function borrow(uint amount) public {
        require(balances[msg.sender] >= amount * 2, "Insufficient collateral");
        borrowedAmount[msg.sender] += amount;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
    }</span>

    // Security: Checks for reentrancy and arithmetic overflow
    <span className="bg-indigo-500 bg-opacity-20">function repay() public payable {
        uint debt = borrowedAmount[msg.sender];
        require(debt > 0, "No outstanding loan");
        require(msg.value >= debt, "Insufficient repayment");
        
        borrowedAmount[msg.sender] = 0;
        uint excess = msg.value - debt;
        
        if (excess > 0) {
            (bool success, ) = payable(msg.sender).call{value: excess}("");
            require(success, "Excess transfer failed");
        }
    }</span>
}`,
      },
      {
        title: "Supply Chain Management",
        description:
          "Smart contracts can automate and secure supply chain processes, ensuring transparency and traceability of goods from manufacturer to consumer.",
        code: `pragma solidity ^0.8.0;

contract SupplyChain {
    // Security: Use of enums for state management
    <span className="bg-indigo-500 bg-opacity-20">enum State { Created, InTransit, Delivered }

    struct Product {
        uint id;
        string name;
        State state;
        address manufacturer;
        address currentHolder;
    }

    // Security: Private state variables
    mapping(uint => Product) private products;
    uint private productCount;</span>

    // Security: Access control
    <span className="bg-purple-500 bg-opacity-20">function createProduct(string memory _name) public {
        productCount++;
        products[productCount] = Product(productCount, _name, State.Created, msg.sender, msg.sender);
    }</span>

    // Security: State checks and access control
    <span className="bg-indigo-500 bg-opacity-20">function shipProduct(uint _id, address _to) public {
        require(products[_id].currentHolder == msg.sender, "Not the current holder");
        require(products[_id].state == State.Created, "Product not in correct state");
        products[_id].state = State.InTransit;
        products[_id].currentHolder = _to;
    }</span>

    // Security: Multiple state checks
    <span className="bg-purple-500 bg-opacity-20">function receiveProduct(uint _id) public {
        require(products[_id].currentHolder == msg.sender, "Not the intended receiver");
        require(products[_id].state == State.InTransit, "Product not in transit");
        products[_id].state = State.Delivered;
    }</span>
}`,
      },
      {
        title: "Decentralized Autonomous Organizations (DAOs)",
        description:
          "Smart contracts form the basis of DAOs, enabling decentralized governance and decision-making in organizations.",
        code: `pragma solidity ^0.8.0;

contract SimpleDAO {
    // Security: Proper struct and mapping usage
    <span className="bg-indigo-500 bg-opacity-20">struct Proposal {
        string description;
        uint voteCount;
        bool executed;
        mapping(address => bool) hasVoted;
    }

    mapping(address => bool) public members;
    Proposal[] public proposals;</span>

    // Security: Access control in constructor
    <span className="bg-purple-500 bg-opacity-20">constructor() {
        members[msg.sender] = true;
    }

    // Security: Only members can add new members
    function addMember(address _member) public {
        require(members[msg.sender], "Not a member");
        members[_member] = true;
    }</span>

    // Security: Access control and input validation
    <span className="bg-indigo-500 bg-opacity-20">function createProposal(string memory _description) public {
        require(members[msg.sender], "Not a member");
        require(bytes(_description).length > 0, "Empty description");
        proposals.push(Proposal(_description, 0, false));
    }

    // Security: Prevent double voting
    function vote(uint _proposalId) public {
        require(members[msg.sender], "Not a member");
        require(_proposalId < proposals.length, "Invalid proposal");
        require(!proposals[_proposalId].executed, "Proposal already executed");
        require(!proposals[_proposalId].hasVoted[msg.sender], "Already voted");
        
        proposals[_proposalId].hasVoted[msg.sender] = true;
        proposals[_proposalId].voteCount++;
    }</span>

    // Security: Proper checks before execution
    <span className="bg-purple-500 bg-opacity-20">function executeProposal(uint _proposalId) public {
        require(members[msg.sender], "Not a member");
        require(_proposalId < proposals.length, "Invalid proposal");
        require(!proposals[_proposalId].executed, "Proposal already executed");
        require(proposals[_proposalId].voteCount > (getMemberCount() / 2), "Majority not reached");
        
        proposals[_proposalId].executed = true;
        // Execution logic would go here
    }</span>

    // Security: Accurately count members
    function getMemberCount() private view returns (uint) {
        uint count = 0;
        for (uint i = 0; i < proposals.length; i++) {
            if (members[address(uint160(i))]) {
                count++;
            }
        }
        return count;
    }
}`,
      },
    ],
    []
  );

  const handleExampleChange = useCallback((e) => {
    setActiveExample(Number(e.target.value));
  }, []);

  const renderMotionDiv = useCallback(
    (children, delay = 0) => (
      <motion.div
        className="bg-gray-900 p-6 rounded-lg shadow-lg border border-indigo-500"
        variants={MOTION_VARIANTS}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay }}
      >
        {children}
      </motion.div>
    ),
    []
  );

  const renderIcon = useCallback(
    (Icon, text) => (
      <div className="flex items-center mb-4">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-full mr-4">
          <Icon className="text-white" size={24} />
        </div>
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
          {text}
        </h3>
      </div>
    ),
    []
  );

  const benefits = useMemo(
    () => [
      { icon: Zap, text: "Automation and efficiency" },
      { icon: Globe, text: "Transparency and trust" },
      { icon: Check, text: "Cost reduction" },
      { icon: Code, text: "Accuracy and speed" },
      { icon: Shield, text: "Decentralization and security" },
    ],
    []
  );

  const challenges = useMemo(
    () => [
      { icon: Lock, text: "Immutability (can be both a pro and a con)" },
      { icon: Code, text: "Complexity in development and auditing" },
      { icon: AlertTriangle, text: "Potential for bugs and vulnerabilities" },
      { icon: TrendingUp, text: "Scalability issues on some blockchains" },
      { icon: FileQuestion, text: "Regulatory uncertainties" },
    ],
    []
  );

  const renderListItems = useCallback(
    (items) => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <motion.div
            key={index}
            className="flex items-center bg-gray-700 p-3 rounded-lg cursor-pointer"
            whileHover={{ scale: 1.05, backgroundColor: "#4B5563" }}
            onHoverStart={() => setHoveredBenefit(index)}
            onHoverEnd={() => setHoveredBenefit(null)}
          >
            <item.icon className="text-indigo-400 mr-3" size={20} />
            <span className="text-gray-200">{item.text}</span>
          </motion.div>
        ))}
      </div>
    ),
    [setHoveredBenefit]
  );

  return (
    <div className="space-y-8">
      {renderMotionDiv(
        <>
          {renderIcon(Book, "What are Smart Contracts?")}
          <p className="text-gray-300 mb-4 text-lg leading-relaxed">
            Smart contracts are self-executing contracts with the terms of the
            agreement directly written into code. They run on blockchain
            networks, automatically enforcing and executing the terms when
            predefined conditions are met.
          </p>
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-white font-semibold">
              "Smart contracts are like digital vending machines: input the
              right conditions, and the predefined outcome is automatically
              delivered."
            </p>
          </motion.div>
        </>
      )}

      {renderMotionDiv(
        <>
          {renderIcon(Globe, "Why are Smart Contracts Important?")}
          <p className="text-gray-300 mb-6 text-lg leading-relaxed">
            Smart contracts enable trustless, transparent, and efficient
            transactions without intermediaries. They're the backbone of
            decentralized applications (DApps) and are revolutionizing
            industries from finance to supply chain management.
          </p>
          <div className="mb-6">
            <div className="flex mb-4">
              {Object.entries(TABS).map(([key, value]) => (
                <button
                  key={key}
                  className={`flex-1 py-3 px-6 ${
                    activeTab === value
                      ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
                      : "bg-gray-800 text-gray-300"
                  } ${
                    key === "BENEFITS" ? "rounded-l-lg" : "rounded-r-lg"
                  } transition-all duration-300 font-semibold`}
                  onClick={() => setActiveTab(value)}
                >
                  {key.charAt(0) + key.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              {renderListItems(
                activeTab === TABS.BENEFITS ? benefits : challenges
              )}
            </div>
          </div>
        </>,
        0.2
      )}

      {renderMotionDiv(
        <>
          <h4 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center">
            <Shield className="mr-2 text-indigo-400" /> Security-Focused Smart
            Contract Examples
          </h4>
          <div className="mb-6">
            <select
              value={activeExample}
              onChange={handleExampleChange}
              className="w-full bg-gray-800 text-gray-300 p-3 rounded-lg mb-4 border border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {examples.map((example, index) => (
                <option key={index} value={index}>
                  {example.title}
                </option>
              ))}
            </select>
            <p className="text-gray-300 mb-4 text-lg leading-relaxed">
              {examples[activeExample].description}
            </p>
            <div className="bg-gray-900 p-4 rounded-lg overflow-hidden">
              <pre className="overflow-x-auto">
                <code
                  className="text-sm font-mono text-gray-300"
                  dangerouslySetInnerHTML={{
                    __html: examples[activeExample].code,
                  }}
                />
              </pre>
            </div>
          </div>
        </>,
        0.4
      )}

      {renderMotionDiv(
        <>
          {renderIcon(Zap, "The Future of Smart Contracts")}
          <p className="text-gray-300 mb-6 text-lg leading-relaxed">
            As blockchain technology evolves, smart contracts are expected to
            become more sophisticated and widely adopted. Future developments
            may include:
          </p>
          {renderListItems([
            {
              icon: Cpu,
              text: "Integration with IoT devices for real-world data inputs",
            },
            { icon: GitBranch, text: "Cross-chain interoperability" },
            {
              icon: Eye,
              text: "Advanced privacy features (e.g., zero-knowledge proofs)",
            },
            {
              icon: Brain,
              text: "AI-assisted smart contract creation and auditing",
            },
            {
              icon: BookOpen,
              text: "Standardization and regulatory frameworks",
            },
          ])}
        </>,
        0.6
      )}
    </div>
  );
};

export default IntroSection;
