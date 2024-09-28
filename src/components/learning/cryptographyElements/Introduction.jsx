import React from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Key, Hash, GitBranch, Database } from "lucide-react";

const Section = ({ icon: Icon, title, content }) => (
  <motion.div
    className="mb-8"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex items-center mb-4">
      <Icon className="w-8 h-8 mr-4 text-indigo-400" />
      <h2 className="text-2xl font-semibold text-indigo-300">{title}</h2>
    </div>
    <p className="text-gray-300">{content}</p>
  </motion.div>
);

const BlockchainFeature = ({ icon: Icon, title, description }) => (
  <div className="flex items-start mb-4">
    <Icon className="w-6 h-6 mr-3 text-indigo-400 flex-shrink-0 mt-1" />
    <div>
      <h4 className="text-lg font-semibold mb-1 text-indigo-300">{title}</h4>
      <p className="text-gray-400">{description}</p>
    </div>
  </div>
);

const CryptographyBlockchainIntroduction = () => {
  const sections = [
    {
      icon: Shield,
      title: "What is Cryptography?",
      content:
        "Cryptography is the practice and science of secure communication techniques in the presence of adversaries. In the context of blockchain, it is crucial for ensuring confidentiality, integrity, and authenticity of data. Cryptography enables encryption, digital signatures, and key generation, all of which are fundamental to blockchain systems.",
    },
    {
      icon: Lock,
      title: "Importance of Cryptography in Blockchain",
      content:
        "Cryptography forms the foundation of blockchain technology, enabling secure transactions, wallet management, and consensus mechanisms. It ensures that data on the blockchain remains tamper-resistant and verifiable. Thanks to cryptography, blockchain guarantees immutability of recorded data, which is essential for building trust in decentralized systems.",
    },
    {
      icon: Key,
      title: "Key Cryptographic Concepts",
      content:
        "Key concepts include public-key cryptography, digital signatures, hash functions, and zero-knowledge proofs. Public-key cryptography allows secure communication without exchanging secret keys. Digital signatures ensure authenticity and non-repudiation of transactions. Hash functions create unique 'fingerprints' for data, which is essential for creating blocks in the chain. Zero-knowledge proofs allow verifying information without revealing its content.",
    },
    {
      icon: Database,
      title: "What is Blockchain?",
      content:
        "Blockchain is a distributed, immutable ledger used for secure peer-to-peer transactions without a central authority. It is a chain of blocks containing transactions, cryptographically linked and tamper-resistant. Each block contains the hash of the previous block, creating an unbreakable chain that ensures the integrity of the entire transaction history.",
    },
  ];

  const blockchainFeatures = [
    {
      icon: Hash,
      title: "Immutability",
      description:
        "Once data is recorded on the blockchain, it cannot be altered. This feature ensures the integrity and reliability of the stored information.",
    },
    {
      icon: GitBranch,
      title: "Decentralization",
      description:
        "There is no single point of control or failure. The blockchain network is distributed among many participants, increasing its resilience and security.",
    },
    {
      icon: Database,
      title: "Transparency",
      description:
        "All transactions are visible to network participants, ensuring transparency and auditability.",
    },
  ];

  return (
    <div className="bg-gray-900 text-gray-100 p-8 rounded-xl shadow-2xl max-w-4xl mx-auto">
      <motion.h1
        className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Cryptography and Blockchain: The Foundation of Trust in the Digital
        World
      </motion.h1>

      {sections.map((section, index) => (
        <Section key={index} {...section} />
      ))}

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h3 className="text-2xl font-semibold mb-6 text-indigo-300">
          Key Features of Blockchain Technology
        </h3>
        {blockchainFeatures.map((feature, index) => (
          <BlockchainFeature key={index} {...feature} />
        ))}
      </motion.div>

      <motion.div
        className="bg-gradient-to-r from-indigo-900 to-purple-900 p-6 rounded-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h3 className="text-2xl font-semibold mb-4 text-indigo-300">
          Why Cryptography Matters
        </h3>
        <p className="text-gray-300">
          In the era of digital transformation, cryptography provides the
          essential layer of trust for secure online interactions. It enables
          privacy, secure communication, and verifiable transactions – the
          cornerstones of blockchain technology. Cryptography is key to
          protecting personal data, financial transactions, and online
          communication. In the context of blockchain, cryptography enables the
          creation of decentralized systems resistant to tampering and
          censorship, opening the door to new models of governance and
          collaboration in the digital space.
        </p>
      </motion.div>

      <motion.div
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <h3 className="text-2xl font-semibold mb-4 text-indigo-300">
          The Future of Cryptography and Blockchain
        </h3>
        <p className="text-gray-300">
          The future of cryptography and blockchain is full of promising
          innovations. The development of quantum cryptography aims to secure
          systems against threats posed by quantum computers. Meanwhile,
          blockchain is evolving towards greater scalability and energy
          efficiency, which may lead to broader adoption across various economic
          sectors. The integration of artificial intelligence with blockchain
          could open new possibilities for automation and process optimization.
          These advancements have the potential to revolutionize not only
          finance but also identity management, supply chains, and many other
          fields, shaping a more secure and transparent digital future.
        </p>
      </motion.div>
    </div>
  );
};

export default React.memo(CryptographyBlockchainIntroduction);
