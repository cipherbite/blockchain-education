import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  AlertTriangle,
  Code,
  Book,
  FileText,
  Zap,
  CheckCircle,
  Info,
  Eye,
  EyeOff,
  Award,
  Loader,
  Play,
  RefreshCcw,
} from "lucide-react";
import { ethers } from "ethers";

const InteractiveSmartContractEditor = () => {
  const [code, setCode] = useState(`
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private storedData;
    event DataStored(uint256 newValue);

    function set(uint256 x) public {
        storedData = x;
        emit DataStored(x);
    }

    function get() public view returns (uint256) {
        return storedData;
    }
}
  `);
  const [output, setOutput] = useState("");
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [codeAnalysis, setCodeAnalysis] = useState({});
  const [showExplanations, setShowExplanations] = useState(false);
  const [codeScore, setCodeScore] = useState(0);
  const [isCompiling, setIsCompiling] = useState(false);
  const [feedback, setFeedback] = useState([]);
  const [highlightedLines, setHighlightedLines] = useState([]);

  const [deployedContract, setDeployedContract] = useState(null);
  const [contractAddress, setContractAddress] = useState("");
  const [contractFunctions, setContractFunctions] = useState([]);
  const [functionInputs, setFunctionInputs] = useState({});
  const [functionOutputs, setFunctionOutputs] = useState({});

  const editorRef = useRef(null);
  const workerRef = useRef(null);

  const handleCodeChange = useCallback((event) => {
    setCode(event.target.value);
  }, []);

  const handleWorkerMessage = useCallback((event) => {
    const { type, data } = event.data;
    switch (type) {
      case "COMPILATION_RESULT":
        handleCompilationResult(data);
        break;
      case "COMPILATION_ERROR":
        handleCompilationError(data);
        break;
      default:
        console.error("Unknown message type from worker:", type);
    }
    setIsCompiling(false);
  }, []);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("./CompilerWorker.js", import.meta.url),
      { type: "module" }
    );
    workerRef.current.onmessage = handleWorkerMessage;

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [handleWorkerMessage]);

  const compileCode = useCallback(() => {
    setIsCompiling(true);
    setOutput("Compiling...");
    setErrors([]);
    setWarnings([]);
    setFeedback([]);
    setHighlightedLines([]);

    if (workerRef.current) {
      workerRef.current.postMessage({ type: "COMPILE", code });
    } else {
      setErrors([{ message: "Compiler not initialized" }]);
      setIsCompiling(false);
    }
  }, [code]);

  const handleCompilationResult = useCallback((result) => {
    if (result.errors) {
      const compilationErrors = result.errors.filter(
        (error) => error.severity === "error"
      );
      const compilationWarnings = result.errors.filter(
        (error) => error.severity === "warning"
      );

      setErrors(compilationErrors);
      setWarnings(compilationWarnings);

      const newHighlightedLines = [
        ...compilationErrors,
        ...compilationWarnings,
      ].map((item) => parseInt(item.sourceLocation.start));
      setHighlightedLines(newHighlightedLines);

      if (compilationErrors.length > 0) {
        setOutput("Compilation failed");
        return;
      }
    }

    const contractName = Object.keys(result.contracts["contract.sol"])[0];
    const contract = result.contracts["contract.sol"][contractName];
    setOutput(
      `Compilation successful!\nBytecode: ${
        contract.evm.bytecode.object
      }\nABI: ${JSON.stringify(contract.abi, null, 2)}`
    );
    analyzeCode(contract, result.sources["contract.sol"].ast);
  }, []);

  const handleCompilationError = useCallback((error) => {
    setErrors([{ message: `Compilation error: ${error.message}` }]);
    setOutput("Compilation failed");
  }, []);

  const analyzeCode = useCallback((contract, ast) => {
    const analysis = {
      stateVariables: [],
      functions: [],
      events: [],
      modifiers: [],
    };

    contract.abi.forEach((item) => {
      switch (item.type) {
        case "function":
          analysis.functions.push({
            name: item.name,
            inputs: item.inputs,
            outputs: item.outputs,
            stateMutability: item.stateMutability,
          });
          break;
        case "event":
          analysis.events.push({ name: item.name, inputs: item.inputs });
          break;
      }
    });

    if (ast) {
      ast.nodes.forEach((node) => {
        if (node.nodeType === "ContractDefinition") {
          node.nodes.forEach((subNode) => {
            if (
              subNode.nodeType === "VariableDeclaration" &&
              subNode.stateVariable
            ) {
              analysis.stateVariables.push({
                name: subNode.name,
                type: subNode.typeName.name,
                visibility: subNode.visibility,
                line: subNode.src.split(":")[0],
              });
            } else if (subNode.nodeType === "ModifierDefinition") {
              analysis.modifiers.push({
                name: subNode.name,
                parameters: subNode.parameters,
                line: subNode.src.split(":")[0],
              });
            } else if (subNode.nodeType === "FunctionDefinition") {
              const existingFunction = analysis.functions.find(
                (f) => f.name === subNode.name
              );
              if (existingFunction) {
                existingFunction.line = subNode.src.split(":")[0];
              }
            } else if (subNode.nodeType === "EventDefinition") {
              const existingEvent = analysis.events.find(
                (e) => e.name === subNode.name
              );
              if (existingEvent) {
                existingEvent.line = subNode.src.split(":")[0];
              }
            }
          });
        }
      });
    }

    setCodeAnalysis(analysis);
    calculateCodeScore(analysis);
  }, []);

  const calculateCodeScore = useCallback(
    (analysis) => {
      let score = 0;
      const newFeedback = [];

      // Check for use of events
      if (analysis.events.length > 0) {
        score += 10;
        newFeedback.push("Good: Uses events for important state changes");
      } else {
        newFeedback.push(
          "Suggestion: Consider using events for important state changes"
        );
      }

      // Check for use of modifiers
      if (analysis.modifiers.length > 0) {
        score += 10;
        newFeedback.push("Good: Uses modifiers for access control");
      } else {
        newFeedback.push(
          "Suggestion: Consider using modifiers for access control"
        );
      }

      // Check for proper use of visibility specifiers
      const hasPublicFunctions = analysis.functions.some(
        (f) => f.stateMutability === "public"
      );
      const hasPrivateVariables = analysis.stateVariables.some(
        (v) => v.visibility === "private"
      );
      if (hasPublicFunctions && hasPrivateVariables) {
        score += 10;
        newFeedback.push("Good: Uses proper visibility specifiers");
      } else {
        newFeedback.push(
          "Suggestion: Ensure proper use of visibility specifiers"
        );
      }

      // Check for use of require statements
      if (code.includes("require(")) {
        score += 10;
        newFeedback.push("Good: Uses require for input validation");
      } else {
        newFeedback.push(
          "Suggestion: Consider using require for input validation"
        );
      }

      // Check for use of SafeMath
      if (code.includes("using SafeMath")) {
        score += 10;
        newFeedback.push("Good: Uses SafeMath for arithmetic operations");
      } else {
        newFeedback.push(
          "Suggestion: Consider using SafeMath for arithmetic operations"
        );
      }

      setCodeScore(score);
      setFeedback(newFeedback);
    },
    [code]
  );

  const deployContract = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to deploy and interact with contracts!");
      return;
    }

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const abi = JSON.parse(output.match(/ABI: (.+)/)[1]);
      const bytecode = output.match(/Bytecode: (.+)/)[1];

      const factory = new ethers.ContractFactory(abi, bytecode, signer);
      const contract = await factory.deploy();
      await contract.deployed();

      setDeployedContract(contract);
      setContractAddress(contract.address);
      setContractFunctions(
        Object.values(contract.interface.functions).filter(
          (f) => f.type === "function"
        )
      );
    } catch (error) {
      console.error("Error deploying contract:", error);
      alert("Error deploying contract. Check console for details.");
    }
  };

  const callContractFunction = async (functionName) => {
    if (!deployedContract) return;

    const functionAbi = contractFunctions.find((f) => f.name === functionName);
    const inputs = functionInputs[functionName] || [];

    try {
      let result;
      if (
        functionAbi.stateMutability === "view" ||
        functionAbi.stateMutability === "pure"
      ) {
        result = await deployedContract[functionName](...inputs);
      } else {
        const tx = await deployedContract[functionName](...inputs);
        await tx.wait();
        result = "Transaction successful";
      }
      setFunctionOutputs((prev) => ({
        ...prev,
        [functionName]: result.toString(),
      }));
    } catch (error) {
      console.error(`Error calling function ${functionName}:`, error);
      setFunctionOutputs((prev) => ({
        ...prev,
        [functionName]: `Error: ${error.message}`,
      }));
    }
  };

  const renderAnalysis = () => (
    <div className="space-y-4">
      {Object.entries(codeAnalysis).map(([category, items]) => (
        <div key={category}>
          <h5 className="text-md font-semibold text-indigo-300 capitalize">
            {category.replace(/([A-Z])/g, " $1").trim()}:
          </h5>
          <ul className="list-disc list-inside text-slate-300">
            {items.map((item, index) => (
              <li
                key={index}
                className="cursor-pointer hover:text-indigo-400"
                onClick={() => highlightLine(item.line)}
              >
                {item.name}
                {showExplanations && (
                  <span className="ml-2 text-xs text-slate-400">
                    ({getExplanation(category, item)})
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  const getExplanation = (category, item) => {
    switch (category) {
      case "stateVariables":
        return `${item.type} variable, ${item.visibility} visibility`;
      case "functions":
        return `${item.stateMutability} function with ${item.inputs.length} input(s) and ${item.outputs.length} output(s)`;
      case "events":
        return `Event with ${item.inputs.length} parameter(s)`;
      case "modifiers":
        return `Modifier with ${item.parameters.parameters.length} parameter(s)`;
      default:
        return "";
    }
  };

  const highlightLine = (lineNumber) => {
    if (editorRef.current) {
      const lines = editorRef.current.value.split("\n");
      const position = lines.slice(0, lineNumber).join("\n").length;
      editorRef.current.setSelectionRange(position, position);
      editorRef.current.focus();
    }
  };

  const renderFunctionInputs = (functionName, inputs) => (
    <div className="space-y-2">
      {inputs.map((input, index) => (
        <input
          key={index}
          type="text"
          placeholder={`${input.name} (${input.type})`}
          className="w-full p-2 bg-slate-700 text-white rounded"
          onChange={(e) => {
            const newInputs = { ...functionInputs };
            if (!newInputs[functionName]) newInputs[functionName] = [];
            newInputs[functionName][index] = e.target.value;
            setFunctionInputs(newInputs);
          }}
        />
      ))}
    </div>
  );

  const renderDeployedContractInterface = () => (
    <div className="mt-6 bg-slate-700 p-4 rounded-lg">
      <h4 className="text-lg font-semibold mb-2 text-indigo-300 flex items-center">
        <Play className="mr-2" /> Deployed Contract Interface
      </h4>
      <p className="text-slate-300 mb-4">Contract Address: {contractAddress}</p>
      {contractFunctions.map((func, index) => (
        <div key={index} className="mb-4 p-4 bg-slate-600 rounded-lg">
          <h5 className="text-md font-semibold text-indigo-300">{func.name}</h5>
          {renderFunctionInputs(func.name, func.inputs)}
          <button
            onClick={() => callContractFunction(func.name)}
            className="mt-2 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition-colors"
          >
            Call
          </button>
          {functionOutputs[func.name] && (
            <p className="mt-2 text-slate-300">
              Output: {functionOutputs[func.name]}
            </p>
          )}
        </div>
      ))}
    </div>
  );

  useEffect(() => {
    const debouncedCompile = setTimeout(() => {
      compileCode();
    }, 1000);

    return () => clearTimeout(debouncedCompile);
  }, [code, compileCode]);

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-6 border border-indigo-500">
      <h3 className="text-2xl font-semibold mb-4 text-indigo-400 flex items-center">
        <Code className="mr-2" /> Advanced Interactive Smart Contract Editor
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-lg font-semibold mb-2 text-indigo-300 flex items-center">
            <FileText className="mr-2" /> Code Editor
          </h4>
          <div className="relative">
            <SyntaxHighlighter
              language="solidity"
              style={tomorrow}
              className="w-full h-96 rounded text-sm"
              wrapLines={true}
              showLineNumbers={true}
              lineProps={(lineNumber) => {
                const style = { display: "block", width: "100%" };
                if (highlightedLines.includes(lineNumber - 1)) {
                  style.backgroundColor = "rgba(255, 0, 0, 0.2)";
                }
                return { style };
              }}
            >
              {code}
            </SyntaxHighlighter>
            <textarea
              ref={editorRef}
              value={code}
              onChange={handleCodeChange}
              className="absolute top-0 left-0 w-full h-full opacity-0 resize-none"
              spellCheck="false"
            />
          </div>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={compileCode}
              className="bg-indigo-500 text-white px-6 py-2 rounded-full font-bold hover:bg-indigo-600 transition-colors flex items-center"
              disabled={isCompiling}
            >
              {isCompiling ? (
                <Loader className="mr-2 animate-spin" />
              ) : (
                <Zap className="mr-2" />
              )}
              {isCompiling ? "Compiling..." : "Compile"}
            </button>
            <button
              onClick={() => setShowExplanations(!showExplanations)}
              className="bg-slate-600 text-white px-6 py-2 rounded-full font-bold hover:bg-slate-700 transition-colors flex items-center"
            >
              {showExplanations ? (
                <>
                  <EyeOff className="mr-2" /> Hide Explanations
                </>
              ) : (
                <>
                  <Eye className="mr-2" /> Show Explanations
                </>
              )}
            </button>
          </div>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-2 text-indigo-300 flex items-center">
            <FileText className="mr-2" /> Compilation Output
          </h4>
          <pre className="w-full h-40 bg-slate-900 text-slate-300 p-4 rounded font-mono text-sm overflow-auto">
            {output}
          </pre>
          <AnimatePresence>
            {errors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-4 p-4 bg-red-900 text-red-100 rounded-lg"
              >
                <AlertTriangle className="inline-block mr-2" />
                <strong>Compilation Errors:</strong>
                <ul className="list-disc list-inside mt-2">
                  {errors.map((error, index) => (
                    <li
                      key={index}
                      onClick={() => highlightLine(error.sourceLocation?.start)}
                    >
                      {error.message}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {warnings.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-4 p-4 bg-yellow-900 text-yellow-100 rounded-lg"
              >
                <AlertTriangle className="inline-block mr-2" />
                <strong>Compilation Warnings:</strong>
                <ul className="list-disc list-inside mt-2">
                  {warnings.map((warning, index) => (
                    <li
                      key={index}
                      onClick={() =>
                        highlightLine(warning.sourceLocation?.start)
                      }
                    >
                      {warning.message}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
          <h4 className="text-lg font-semibold mt-4 mb-2 text-indigo-300 flex items-center">
            <Book className="mr-2" /> Code Analysis
          </h4>
          {renderAnalysis()}
          <div className="mt-4">
            <h4 className="text-lg font-semibold mb-2 text-indigo-300 flex items-center">
              <Award className="mr-2" /> Code Score
            </h4>
            <div className="bg-slate-700 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-indigo-400">
                  {codeScore}/50
                </span>
                <div className="w-2/3 bg-slate-600 rounded-full h-4">
                  <div
                    className="bg-indigo-500 rounded-full h-4 transition-all duration-500 ease-in-out"
                    style={{ width: `${(codeScore / 50) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="text-lg font-semibold mb-2 text-indigo-300 flex items-center">
              <Info className="mr-2" /> Feedback
            </h4>
            <ul className="list-disc list-inside text-slate-300">
              {feedback.map((item, index) => (
                <li
                  key={index}
                  className={
                    item.startsWith("Good")
                      ? "text-green-400"
                      : "text-yellow-400"
                  }
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <h4 className="text-lg font-semibold mb-2 text-indigo-300 flex items-center">
          <CheckCircle className="mr-2" /> Smart Contract Best Practices
        </h4>
        <ul className="list-disc list-inside text-slate-300 grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "Use specific compiler pragma",
            "Use modifiers for repeated checks",
            "Implement access control mechanisms",
            "Use SafeMath for arithmetic operations",
            "Emit events for state changes",
            "Implement 'pull over push' pattern for payments",
            "Avoid using tx.origin for authorization",
            "Use function modifiers only for checks",
            "Check for contract existence when using low-level calls",
            "Explicitly mark visibility in functions and state variables",
            "Properly order your functions: external, public, internal, private",
            "Use require to check inputs and conditions",
          ].map((practice, index) => (
            <li key={index} className="flex items-center">
              <CheckCircle className="mr-2 text-green-500" size={16} />
              {practice}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 flex space-x-4">
        <button
          onClick={deployContract}
          className="bg-green-500 text-white px-6 py-2 rounded-full font-bold hover:bg-green-600 transition-colors flex items-center"
          disabled={!output || errors.length > 0}
        >
          <Play className="mr-2" /> Deploy Contract
        </button>
        <button
          onClick={() => {
            setDeployedContract(null);
            setContractAddress("");
            setContractFunctions([]);
            setFunctionInputs({});
            setFunctionOutputs({});
          }}
          className="bg-red-500 text-white px-6 py-2 rounded-full font-bold hover:bg-red-600 transition-colors flex items-center"
        >
          <RefreshCcw className="mr-2" /> Reset Deployment
        </button>
      </div>
      {deployedContract && renderDeployedContractInterface()}
    </div>
  );
};

export default InteractiveSmartContractEditor;
