import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Zap,
  ArrowRight,
  Check,
  AlertTriangle,
  Info,
  Code,
  BookOpen,
  TrendingDown,
  Shield,
  Eye,
  Target,
  Play,
  Save,
  RefreshCw,
} from "lucide-react";
import { solc } from "solc-js";

const optimizationExamples = [
  {
    title: "Loop Optimization",
    unoptimized: `function sumArray(uint256[] memory array) public pure returns (uint256) {
  uint256 sum = 0;
  for (uint256 i = 0; i < array.length; i++) {
    sum += array[i];
  }
  return sum;
}`,
    optimized: `function sumArray(uint256[] memory array) public pure returns (uint256) {
  uint256 sum = 0;
  uint256 length = array.length;
  for (uint256 i = 0; i < length; i++) {
    sum += array[i];
  }
  return sum;
}`,
    explanation:
      "By caching the array length in a local variable, we avoid repeatedly accessing the array length property, which saves gas.",
    gasImpact: "Moderate",
    difficulty: "Easy",
    bestPractices: [
      "Cache array length in a local variable",
      "Avoid unnecessary state changes",
    ],
    realWorldExample:
      "This technique is commonly used in many Solidity contracts to optimize loops.",
    deepDive:
      "Caching the array length in a local variable reduces the number of SLOAD operations, which are expensive in terms of gas.",
  },
  // Dodaj więcej przykładów optymalizacji tutaj
];

const gasExploits = [
  {
    title: "Gas Limit DoS",
    description:
      "An attacker can cause a denial of service by making a function use more gas than the block gas limit.",
    example: `function expensiveLoop(uint256[] memory data) public {
  for (uint256 i = 0; i < data.length; i++) {
    // Expensive operation
  }
}`,
    explanation:
      "If an attacker passes a very large array, the function might exceed the block gas limit, preventing it from being executed.",
    prevention: [
      "Implement gas limits for loops",
      "Use pull payment patterns instead of push",
      "Paginate operations that might grow unbounded",
    ],
    realWorldExample:
      "The 'King of the Ether' contract was vulnerable to this type of attack, where a malicious contract could become king and prevent others from claiming the throne.",
  },
  // Dodaj więcej przykładów exploitów tutaj
];

const CodeEditor = React.memo(
  ({ code, onChange, highlightedLines, onLineClick }) => (
    <textarea
      className="w-full px-3 py-2 bg-slate-900 text-slate-200 rounded-lg font-mono resize-y overflow-auto"
      style={{ minHeight: "200px", maxHeight: "400px" }}
      value={code}
      onChange={(e) => onChange(e.target.value)}
      spellCheck="false"
    />
  )
);

const EnhancedGasOptimizer = () => {
  const [selectedExample, setSelectedExample] = useState(0);
  const [gasUsage, setGasUsage] = useState({ before: 50000, after: 45000 });
  const [complexity, setComplexity] = useState(1);
  const [showDiff, setShowDiff] = useState(false);
  const [activeView, setActiveView] = useState("code");
  const [selectedExploit, setSelectedExploit] = useState(0);
  const [editableCode, setEditableCode] = useState(
    optimizationExamples[0].unoptimized
  );
  const [compileResult, setCompileResult] = useState(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [highlightedLines, setHighlightedLines] = useState([]);
  const [userModifiedCode, setUserModifiedCode] = useState({});

  const currentExample = useMemo(
    () => optimizationExamples[selectedExample],
    [selectedExample]
  );

  const calculateGasUsage = useCallback(() => {
    const baseGas = 40000 + complexity * 10000;
    const randomFactor = Math.floor(Math.random() * 5000);
    const beforeGas = baseGas + randomFactor;
    const afterGas = beforeGas - baseGas * (0.1 + Math.random() * 0.2);
    setGasUsage({ before: Math.round(beforeGas), after: Math.round(afterGas) });
  }, [complexity]);

  const gasSaved = useMemo(() => {
    return gasUsage.before - gasUsage.after;
  }, [gasUsage]);

  const gasSavedPercentage = useMemo(() => {
    return ((gasSaved / gasUsage.before) * 100).toFixed(2);
  }, [gasSaved, gasUsage.before]);

  const renderCodeWithDiff = (code, isOptimized) => {
    if (!showDiff) return code;

    return code.split("\n").map((line, index) => {
      const trimmedLine = line.trim();
      if (isOptimized && !currentExample.unoptimized.includes(trimmedLine)) {
        return (
          <span key={index} className="text-green-400">
            {line}
          </span>
        );
      } else if (
        !isOptimized &&
        !currentExample.optimized.includes(trimmedLine)
      ) {
        return (
          <span key={index} className="text-red-400">
            {line}
          </span>
        );
      }
      return <span key={index}>{line}</span>;
    });
  };

  const handleCodeChange = (newCode) => {
    setEditableCode(newCode);
  };

  const handleCompile = useCallback(() => {
    setIsCompiling(true);
    setCompileResult({ status: "Compiling...", success: true });

    const input = {
      language: "Solidity",
      sources: {
        "contract.sol": {
          content: `
            pragma solidity ^0.8.9;
            contract TestContract {
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

    try {
      solc.compile(JSON.stringify(input), (compiled) => {
        const output = JSON.parse(compiled);
        if (
          output.errors &&
          output.errors.some((error) => error.severity === "error")
        ) {
          const errorMessages = output.errors
            .filter((error) => error.severity === "error")
            .map((error) => error.formattedMessage)
            .join("\n");
          setCompileResult({
            status: `Compilation failed. Errors:\n${errorMessages}`,
            success: false,
          });
        } else {
          const contract = output.contracts["contract.sol"].TestContract;
          setCompileResult({
            status: "Compilation successful!",
            bytecode: contract.evm.bytecode.object,
            abi: JSON.stringify(contract.abi, null, 2),
            success: true,
          });
        }
        setIsCompiling(false);
      });
    } catch (error) {
      setCompileResult({
        status: `Compilation failed. Error: ${error.message}`,
        success: false,
      });
      setIsCompiling(false);
    }
  }, [editableCode]);

  const handleLineClick = useCallback((lineNumber) => {
    setHighlightedLines((prev) =>
      prev.includes(lineNumber)
        ? prev.filter((n) => n !== lineNumber)
        : [...prev, lineNumber]
    );
  }, []);

  const saveUserModifications = useCallback(() => {
    setUserModifiedCode((prev) => ({
      ...prev,
      [selectedExample]: editableCode,
    }));
  }, [selectedExample, editableCode]);

  const resetCode = useCallback(() => {
    setEditableCode(currentExample.unoptimized);
    setUserModifiedCode((prev) => ({
      ...prev,
      [selectedExample]: undefined,
    }));
  }, [currentExample, selectedExample]);

  useEffect(() => {
    setEditableCode(
      userModifiedCode[selectedExample] || currentExample.unoptimized
    );
  }, [selectedExample, currentExample, userModifiedCode]);

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-6 border border-indigo-500">
      <h2 className="text-3xl font-bold mb-6 text-indigo-400 flex items-center">
        <Zap className="mr-2" /> Advanced Gas Optimization & Exploit Analysis
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-indigo-300 flex items-center">
            <Shield className="mr-2" /> Gas Optimization Techniques
          </h3>
          <select
            value={selectedExample}
            onChange={(e) => setSelectedExample(Number(e.target.value))}
            className="w-full bg-slate-700 text-slate-300 p-2 rounded mb-4"
          >
            {optimizationExamples.map((example, index) => (
              <option key={index} value={index}>
                {example.title}
              </option>
            ))}
          </select>

          <div className="flex mb-4">
            <button
              onClick={() => setActiveView("code")}
              className={`flex-1 py-2 px-4 rounded-l ${
                activeView === "code"
                  ? "bg-indigo-500 text-white"
                  : "bg-slate-700 text-slate-300"
              }`}
            >
              <Code className="inline mr-2" /> Code
            </button>
            <button
              onClick={() => setActiveView("explanation")}
              className={`flex-1 py-2 px-4 rounded-r ${
                activeView === "explanation"
                  ? "bg-indigo-500 text-white"
                  : "bg-slate-700 text-slate-300"
              }`}
            >
              <BookOpen className="inline mr-2" /> Explanation
            </button>
          </div>

          {activeView === "code" ? (
            <>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-semibold text-indigo-300">
                  Code Comparison
                </h4>
                <button
                  onClick={() => setShowDiff(!showDiff)}
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  {showDiff ? "Hide Diff" : "Show Diff"}
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h5 className="text-md font-semibold mb-1 text-indigo-200">
                    Editable Code
                  </h5>
                  <CodeEditor
                    code={editableCode}
                    onChange={handleCodeChange}
                    highlightedLines={highlightedLines}
                    onLineClick={handleLineClick}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={saveUserModifications}
                      className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600 transition-colors flex items-center"
                    >
                      <Save className="mr-2" /> Save
                    </button>
                    <button
                      onClick={resetCode}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors flex items-center"
                    >
                      <RefreshCw className="mr-2" /> Reset
                    </button>
                  </div>
                </div>
                <div>
                  <h5 className="text-md font-semibold mb-1 text-indigo-200">
                    Optimized Version
                  </h5>
                  <pre className="bg-slate-900 text-slate-300 p-4 rounded font-mono text-sm overflow-auto h-60">
                    {renderCodeWithDiff(currentExample.optimized, true)}
                  </pre>
                </div>
              </div>
            </>
          ) : (
            <>
              <h4 className="text-lg font-semibold text-indigo-300 mb-2">
                Explanation
              </h4>
              <p className="text-slate-400 mb-4">
                {currentExample.explanation}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h5 className="text-md font-semibold text-indigo-200">
                    Gas Impact
                  </h5>
                  <p className="text-slate-300">{currentExample.gasImpact}</p>
                </div>
                <div>
                  <h5 className="text-md font-semibold text-indigo-200">
                    Difficulty
                  </h5>
                  <p className="text-slate-300">{currentExample.difficulty}</p>
                </div>
              </div>
              <h5 className="text-md font-semibold text-indigo-200 mb-2">
                Best Practices:
              </h5>
              <ul className="list-disc pl-6 text-slate-400 mb-4">
                {currentExample.bestPractices.map((practice, index) => (
                  <li key={index}>{practice}</li>
                ))}
              </ul>
              <h5 className="text-md font-semibold text-indigo-200 mb-2">
                Real-World Example:
              </h5>
              <p className="text-slate-400 mb-4">
                {currentExample.realWorldExample}
              </p>
              <h5 className="text-md font-semibold text-indigo-200 mb-2">
                Deep Dive:
              </h5>
              <p className="text-slate-400">{currentExample.deepDive}</p>
            </>
          )}
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-4 text-indigo-300 flex items-center">
            <AlertTriangle className="mr-2" /> Gas-Related Exploits
          </h3>
          <select
            value={selectedExploit}
            onChange={(e) => setSelectedExploit(Number(e.target.value))}
            className="w-full bg-slate-700 text-slate-300 p-2 rounded mb-4"
          >
            {gasExploits.map((exploit, index) => (
              <option key={index} value={index}>
                {exploit.title}
              </option>
            ))}
          </select>

          <div className="bg-slate-700 p-4 rounded-lg mb-4">
            <h4 className="text-lg font-semibold text-indigo-200 mb-2">
              {gasExploits[selectedExploit].title}
            </h4>
            <p className="text-slate-300 mb-4">
              {gasExploits[selectedExploit].description}
            </p>
            <h5 className="text-md font-semibold text-indigo-200 mb-2">
              Vulnerable Code:
            </h5>
            <pre className="bg-slate-900 text-slate-300 p-4 rounded font-mono text-sm overflow-auto mb-4">
              {gasExploits[selectedExploit].example}
            </pre>
            <h5 className="text-md font-semibold text-indigo-200 mb-2">
              Explanation:
            </h5>
            <p className="text-slate-300 mb-4">
              {gasExploits[selectedExploit].explanation}
            </p>
            <h5 className="text-md font-semibold text-indigo-200 mb-2">
              Prevention:
            </h5>
            <ul className="list-disc pl-6 text-slate-300 mb-4">
              {gasExploits[selectedExploit].prevention.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
            <h5 className="text-md font-semibold text-indigo-200 mb-2">
              Real-World Example:
            </h5>
            <p className="text-slate-300">
              {gasExploits[selectedExploit].realWorldExample}
            </p>
          </div>

          <h4 className="text-lg font-semibold text-indigo-300 mb-2">
            Gas Estimation
          </h4>
          <div className="flex justify-between items-center mb-4">
            <div>
              <label className="text-indigo-300 mr-2">Complexity:</label>
              <input
                type="range"
                min="1"
                max="5"
                value={complexity}
                onChange={(e) => setComplexity(Number(e.target.value))}
                className="bg-slate-700"
              />
            </div>
            <button
              onClick={calculateGasUsage}
              className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
            >
              Calculate Gas
            </button>
          </div>
          <div className="bg-slate-900 p-4 rounded text-slate-300 mb-4">
            <h5 className="font-semibold text-indigo-200 mb-2">
              Before Optimization:
            </h5>
            <p>{gasUsage.before} gas</p>
            <h5 className="font-semibold text-indigo-200 mt-4 mb-2">
              After Optimization:
            </h5>
            <p>{gasUsage.after} gas</p>
            <h5 className="font-semibold text-indigo-200 mt-4 mb-2">
              Gas Saved:
            </h5>
            <p>
              {gasSaved} gas ({gasSavedPercentage}%)
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4 text-indigo-300 flex items-center">
          <Code className="mr-2" /> Code Editor and Compiler
        </h3>
        <div className="bg-slate-700 p-6 rounded-lg">
          <CodeEditor
            code={editableCode}
            onChange={handleCodeChange}
            highlightedLines={highlightedLines}
            onLineClick={handleLineClick}
          />
          <button
            onClick={handleCompile}
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 mt-4 flex items-center"
            disabled={isCompiling}
          >
            <Play className="mr-2" />
            {isCompiling ? "Compiling..." : "Compile Code"}
          </button>
          {compileResult && (
            <div
              className={`mt-4 p-4 rounded ${
                compileResult.success ? "bg-green-700" : "bg-red-700"
              }`}
            >
              <pre className="whitespace-pre-wrap text-white">
                {compileResult.status}
              </pre>
              {compileResult.success && (
                <>
                  <h4 className="text-md font-semibold mt-2 mb-1 text-white">
                    Bytecode:
                  </h4>
                  <pre className="whitespace-pre-wrap text-xs overflow-x-auto text-white">
                    {compileResult.bytecode}
                  </pre>
                  <h4 className="text-md font-semibold mt-2 mb-1 text-white">
                    ABI:
                  </h4>
                  <pre className="whitespace-pre-wrap text-xs overflow-x-auto text-white">
                    {compileResult.abi}
                  </pre>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4 text-indigo-300 flex items-center">
          <Eye className="mr-2" /> Key Takeaways
        </h3>
        <ul className="list-disc pl-6 text-slate-300">
          <li>
            Gas optimization is crucial for efficient and cost-effective smart
            contracts.
          </li>
          <li>
            Common techniques include loop optimization, proper data location
            usage, and bitwise operations.
          </li>
          <li>
            Be aware of potential gas-related exploits and implement proper
            security measures.
          </li>
          <li>
            Always test thoroughly and consider the trade-offs between gas
            efficiency and code readability.
          </li>
          <li>
            Stay updated with the latest Solidity versions and best practices in
            gas optimization.
          </li>
        </ul>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4 text-indigo-300 flex items-center">
          <BookOpen className="mr-2" /> Additional Resources
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="https://docs.soliditylang.org/en/v0.8.9/internals/optimizer.html"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-700 p-4 rounded-lg text-indigo-300 hover:bg-slate-600 transition-colors"
          >
            <h4 className="font-semibold mb-2">
              Solidity Docs - Optimizations
            </h4>
            <p className="text-sm text-slate-400">
              Official documentation on gas optimization techniques.
            </p>
          </a>

          <a
            href="https://ethereum.github.io/yellowpaper/paper.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-700 p-4 rounded-lg text-indigo-300 hover:bg-slate-600 transition-colors"
          >
            <h4 className="font-semibold mb-2">Ethereum Yellow Paper</h4>
            <p className="text-sm text-slate-400">
              Technical specification of Ethereum, including gas costs.
            </p>
          </a>

          <a
            href="https://eips.ethereum.org/EIPS/eip-1884"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-700 p-4 rounded-lg text-indigo-300 hover:bg-slate-600 transition-colors"
          >
            <h4 className="font-semibold mb-2">Gas Costs of EVM Operations</h4>
            <p className="text-sm text-slate-400">
              Detailed breakdown of gas costs for various EVM operations.
            </p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default EnhancedGasOptimizer;
