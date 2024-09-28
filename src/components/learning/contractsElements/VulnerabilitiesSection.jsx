import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  AlertTriangle,
  Book,
  Shield,
  Activity,
  Eye,
  EyeOff,
  Play,
  Info,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Save,
  RefreshCw,
} from "lucide-react";
import { solc } from "solc-js";

const vulnerabilities = [
  {
    name: "Reentrancy",
    description:
      "A vulnerability where a function can be repeatedly called before the first invocation is finished, potentially draining funds or manipulating state.",
    example: `function withdraw(uint amount) public {
    require(balances[msg.sender] >= amount);
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success);
    balances[msg.sender] -= amount;
}`,
    fix: `function withdraw(uint amount) public {
    require(balances[msg.sender] >= amount);
    balances[msg.sender] -= amount;
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success);
}`,
    explanation:
      "The fix applies the 'checks-effects-interactions' pattern. It updates the balance before making the external call, preventing recursive calls from draining the contract.",
    realWorldExample:
      "The DAO hack in 2016, which resulted in the loss of 3.6 million ETH, exploited a reentrancy vulnerability.",
    preventionTips: [
      "Use the checks-effects-interactions pattern",
      "Implement reentrancy guards using a mutex",
      "Use transfer() or send() instead of call() when possible",
      "Be cautious with external calls, especially when handling Ether",
      "Consider using the 'pull payment' design pattern instead of 'push payment'",
    ],
  },
  {
    name: "Integer Overflow/Underflow",
    description:
      "A vulnerability where arithmetic operations can wrap around due to fixed-size integer types, leading to unexpected behavior.",
    example: `function transfer(address to, uint256 amount) public {
    require(balances[msg.sender] >= amount);
    balances[msg.sender] -= amount;
    balances[to] += amount;
}`,
    fix: `import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract SafeContract {
    using SafeMath for uint256;

    function transfer(address to, uint256 amount) public {
        require(balances[msg.sender] >= amount);
        balances[msg.sender] = balances[msg.sender].sub(amount);
        balances[to] = balances[to].add(amount);
    }
}`,
    explanation:
      "The fix uses OpenZeppelin's SafeMath library to prevent integer overflow and underflow, ensuring arithmetic operations are safe.",
    realWorldExample:
      "The BEC token hack in 2018, where attackers exploited an integer overflow to generate a large number of tokens.",
    preventionTips: [
      "Use SafeMath library for arithmetic operations",
      "Consider using Solidity 0.8.0+ which has built-in overflow checks",
      "Be cautious when performing arithmetic operations, especially multiplication",
      "Use require() statements to check for potential overflows",
    ],
  },
  {
    name: "Access Control",
    description:
      "Vulnerabilities arising from improper implementation of access controls, allowing unauthorized actions.",
    example: `function withdrawFunds() public {
    msg.sender.transfer(address(this).balance);
}`,
    fix: `address public owner;

constructor() {
    owner = msg.sender;
}

modifier onlyOwner() {
    require(msg.sender == owner, "Not the owner");
    _;
}

function withdrawFunds() public onlyOwner {
    msg.sender.transfer(address(this).balance);
}`,
    explanation:
      "The fix implements a basic access control mechanism using the 'onlyOwner' modifier, ensuring only the contract owner can withdraw funds.",
    realWorldExample:
      "The Parity multi-sig wallet hack in 2017, where a lack of access control allowed an attacker to take ownership of multiple wallets.",
    preventionTips: [
      "Implement proper access control mechanisms",
      "Use modifiers to restrict function access",
      "Follow the principle of least privilege",
      "Thoroughly test access control implementations",
      "Consider using OpenZeppelin's Ownable contract for basic ownership control",
    ],
  },
  {
    name: "Signature Malleability",
    description:
      "A rare vulnerability where an attacker can modify a valid signature to create another valid signature for the same message, potentially leading to double-spending or other exploits.",
    example: `function claimReward(uint256 amount, bytes memory signature) public {
    bytes32 message = keccak256(abi.encodePacked(msg.sender, amount));
    address signer = recoverSigner(message, signature);
    require(signer == trustedSigner, "Invalid signature");
    
    // Process the reward
    balances[msg.sender] += amount;
}`,
    fix: `function claimReward(uint256 amount, bytes32 r, bytes32 s, uint8 v) public {
    bytes32 message = keccak256(abi.encodePacked(msg.sender, amount));
    address signer = ecrecover(message, v, r, s);
    require(signer == trustedSigner, "Invalid signature");
    
    // Process the reward
    balances[msg.sender] += amount;
}`,
    explanation:
      "The fix separates the signature components (r, s, v) and uses ecrecover directly, which is not susceptible to signature malleability. This prevents an attacker from modifying a valid signature to create another valid signature for the same message.",
    realWorldExample:
      "While not a direct smart contract example, the Bitcoin transaction malleability issue that affected Mt. Gox in 2014 is a well-known case of signature malleability in the blockchain space.",
    preventionTips: [
      "Use EIP-191 or EIP-712 for structured data signing",
      "Implement replay protection by including nonces in signed messages",
      "Use ecrecover() instead of a custom signature verification function",
      "Consider using OpenZeppelin's ECDSA library for signature operations",
      "Always verify the length of signature components to ensure they're valid",
    ],
  },
];

const CodeEditor = React.memo(({ code, onChange }) => (
  <textarea
    className="w-full px-3 py-2 bg-slate-900 text-slate-200 rounded-lg font-mono resize-y overflow-auto"
    style={{ minHeight: "200px", maxHeight: "400px" }}
    value={code}
    onChange={(e) => onChange(e.target.value)}
    spellCheck="false"
  />
));

const VulnerabilityExplorer = () => {
  const [selectedVulnerability, setSelectedVulnerability] = useState(0);
  const [showVulnerable, setShowVulnerable] = useState(true);
  const [editableCode, setEditableCode] = useState(vulnerabilities[0].example);
  const [compileResult, setCompileResult] = useState(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [showExplanations, setShowExplanations] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [userModifiedCode, setUserModifiedCode] = useState({});

  const currentVulnerability = useMemo(
    () => vulnerabilities[selectedVulnerability],
    [selectedVulnerability]
  );

  const handleVulnerabilityChange = useCallback(
    (index) => {
      setSelectedVulnerability(index);
      setShowVulnerable(true);
      setEditableCode(
        userModifiedCode[index] || vulnerabilities[index].example
      );
      setCompileResult(null);
      setShowDiff(false);
    },
    [userModifiedCode]
  );

  const toggleVulnerable = useCallback(() => {
    setShowVulnerable((prev) => !prev);
    setEditableCode((prev) =>
      prev === currentVulnerability.example
        ? userModifiedCode[selectedVulnerability] || currentVulnerability.fix
        : currentVulnerability.example
    );
    setCompileResult(null);
  }, [currentVulnerability, selectedVulnerability, userModifiedCode]);

  const handleCompile = useCallback(() => {
    setIsCompiling(true);
    setCompileResult({ status: "Compiling...", success: true });

    const input = {
      language: "Solidity",
      sources: {
        "contract.sol": {
          content: `
            pragma solidity ^0.8.9;
            contract VulnerableContract {
              ${editableCode}
            }
          `,
        },
      },
      settings: {
        outputSelection: {
          "*": {
            "*": ["*"],
          },
        },
      },
    };

    solc.compile(JSON.stringify(input), (compiled) => {
      const output = JSON.parse(compiled);
      if (output.errors?.some((error) => error.severity === "error")) {
        const errorMessages = output.errors
          .filter((error) => error.severity === "error")
          .map((error) => error.formattedMessage)
          .join("\n");
        setCompileResult({
          status: `Compilation failed. Errors:\n${errorMessages}`,
          success: false,
        });
      } else {
        const contract = output.contracts["contract.sol"].VulnerableContract;
        setCompileResult({
          status: "Compilation successful!",
          bytecode: contract.evm.bytecode.object,
          abi: JSON.stringify(contract.abi, null, 2),
          success: true,
        });
      }
      setIsCompiling(false);
    });
  }, [editableCode]);

  const saveUserModifications = useCallback(() => {
    setUserModifiedCode((prev) => ({
      ...prev,
      [selectedVulnerability]: editableCode,
    }));
  }, [selectedVulnerability, editableCode]);

  const resetCode = useCallback(() => {
    setEditableCode(currentVulnerability.example);
    setUserModifiedCode((prev) => ({
      ...prev,
      [selectedVulnerability]: undefined,
    }));
  }, [currentVulnerability, selectedVulnerability]);

  const CompilationResult = useMemo(() => {
    if (!compileResult) return null;
    return (
      <div
        className={`mt-4 p-3 rounded-lg ${
          compileResult.success ? "bg-emerald-700" : "bg-red-700"
        }`}
      >
        <pre className="whitespace-pre-wrap">{compileResult.status}</pre>
        {compileResult.success && (
          <>
            <h4 className="text-md font-semibold mt-2 mb-1">Bytecode:</h4>
            <pre className="whitespace-pre-wrap text-xs overflow-x-auto">
              {compileResult.bytecode}
            </pre>
            <h4 className="text-md font-semibold mt-2 mb-1">ABI:</h4>
            <pre className="whitespace-pre-wrap text-xs overflow-x-auto">
              {compileResult.abi}
            </pre>
          </>
        )}
      </div>
    );
  }, [compileResult]);

  const renderDiff = useCallback(() => {
    const vulnLines = currentVulnerability.example.split("\n");
    const fixLines = currentVulnerability.fix.split("\n");

    return (
      <div className="grid grid-cols-2 gap-4 mt-4 bg-slate-900 p-4 rounded-lg">
        <div>
          <h4 className="text-md font-semibold mb-2 text-red-400">
            Vulnerable Code
          </h4>
          <pre className="text-sm">
            {vulnLines.map((line, index) => (
              <div
                key={index}
                className={
                  line !== fixLines[index] ? "bg-red-900 bg-opacity-50" : ""
                }
              >
                {line}
              </div>
            ))}
          </pre>
        </div>
        <div>
          <h4 className="text-md font-semibold mb-2 text-green-400">
            Fixed Code
          </h4>
          <pre className="text-sm">
            {fixLines.map((line, index) => (
              <div
                key={index}
                className={
                  line !== vulnLines[index] ? "bg-green-900 bg-opacity-50" : ""
                }
              >
                {line}
              </div>
            ))}
          </pre>
        </div>
      </div>
    );
  }, [currentVulnerability]);

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-indigo-500 text-slate-200">
      <h2 className="text-2xl font-semibold mb-4 text-indigo-400 flex items-center">
        <Shield className="mr-2" /> Interactive Vulnerability Explorer
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold mb-2 text-indigo-300 flex items-center">
            <AlertTriangle className="mr-2" /> Common Vulnerabilities
          </h3>
          <ul className="space-y-2">
            {vulnerabilities.map((vuln, index) => (
              <li key={vuln.name}>
                <button
                  className={`px-3 py-2 rounded-full text-sm w-full text-left transition-colors ${
                    selectedVulnerability === index
                      ? "bg-indigo-500 text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                  onClick={() => handleVulnerabilityChange(index)}
                >
                  {vuln.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-2 text-indigo-200 flex items-center">
            <Book className="mr-2" /> {currentVulnerability.name}
          </h3>
          <p className="mb-4">{currentVulnerability.description}</p>
          <div className="mb-4">
            <h4 className="text-md font-semibold mb-1 text-indigo-300">
              Real World Example
            </h4>
            <p>{currentVulnerability.realWorldExample}</p>
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 transition-colors flex items-center"
              onClick={toggleVulnerable}
            >
              {showVulnerable ? (
                <>
                  <Eye className="mr-2" /> Show Fix
                </>
              ) : (
                <>
                  <EyeOff className="mr-2" /> Show Vulnerable Code
                </>
              )}
            </button>
            <button
              className="px-4 py-2 bg-emerald-700 text-white rounded-lg shadow-md hover:bg-emerald-800 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleCompile}
              disabled={isCompiling}
            >
              <Play className="mr-2" />
              {isCompiling ? "Compiling..." : "Compile Code"}
            </button>
            <button
              className="px-4 py-2 bg-slate-600 text-white rounded-lg shadow-md hover:bg-slate-700 transition-colors flex items-center"
              onClick={() => setShowExplanations(!showExplanations)}
            >
              <Info className="mr-2" />
              {showExplanations ? "Hide" : "Show"} Explanations
            </button>
            <button
              className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-colors flex items-center"
              onClick={() => setShowDiff(!showDiff)}
            >
              <ArrowLeft className="mr-2" />
              {showDiff ? "Hide" : "Show"} Diff
              <ArrowRight className="ml-2" />
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center"
              onClick={saveUserModifications}
            >
              <Save className="mr-2" />
              Save Modifications
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors flex items-center"
              onClick={resetCode}
            >
              <RefreshCw className="mr-2" />
              Reset Code
            </button>
          </div>
          <CodeEditor code={editableCode} onChange={setEditableCode} />
          {showExplanations && (
            <div className="mt-4 p-4 bg-slate-700 rounded-lg">
              <h4 className="text-md font-semibold mb-2 text-indigo-300">
                Code Explanation
              </h4>
              <p>{currentVulnerability.explanation}</p>
            </div>
          )}
          {showDiff && renderDiff()}
          {CompilationResult}
          <h4 className="text-lg font-semibold mb-2 mt-4 text-indigo-200 flex items-center">
            <Activity className="mr-2" /> Prevention Tips
          </h4>
          <ul className="list-disc ml-6">
            {currentVulnerability.preventionTips.map((tip, index) => (
              <li key={index} className="flex items-center">
                <CheckCircle className="mr-2 text-green-500" size={16} />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VulnerabilityExplorer;
