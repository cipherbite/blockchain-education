import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  AlertCircle,
  Check,
  Code,
  DollarSign,
  ArrowRight,
  Zap,
  Repeat,
} from "lucide-react";

const SimulationSection = () => {
  const contractFunctions = useMemo(
    () => [
      { name: "deposit", gasEstimate: 21000 },
      { name: "withdraw", gasEstimate: 30000 },
    ],
    []
  );

  const [contractState, setContractState] = useState({
    balance: 1000,
    owner: "0x123...",
    transactions: [],
  });
  const [action, setAction] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [logs, setLogs] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [gasPrice, setGasPrice] = useState(20); // in Gwei
  const [difficulty, setDifficulty] = useState(1);
  const [networkCongestion, setNetworkCongestion] = useState(1);
  const [marketVolatility, setMarketVolatility] = useState(1);
  const [activeTab, setActiveTab] = useState("state");
  const [activeChartTab, setActiveChartTab] = useState("balance");

  const executeAction = useCallback(() => {
    setContractState((prev) => {
      const numAmount = Number(amount);
      let newLogs = [];
      let newBalance = prev.balance;
      let newTransactions = [...prev.transactions];
      let gasUsed = 0;

      switch (action) {
        case "deposit":
          newBalance += numAmount;
          newLogs = [
            "Deposit function called",
            `Received ${numAmount} ETH`,
            `New balance: ${newBalance} ETH`,
            "Deposit event emitted",
          ];
          newTransactions.push({
            type: "Deposit",
            amount: numAmount,
            timestamp: new Date().toISOString(),
          });
          gasUsed = contractFunctions.find(
            (f) => f.name === "deposit"
          ).gasEstimate;
          break;
        case "withdraw":
          if (numAmount <= prev.balance) {
            newBalance -= numAmount;
            newLogs = [
              "Withdraw function called",
              "Ownership verified",
              `Sufficient balance confirmed`,
              `Withdrawn ${numAmount} ETH`,
              `New balance: ${newBalance} ETH`,
              "Withdrawal event emitted",
            ];
            newTransactions.push({
              type: "Withdrawal",
              amount: numAmount,
              timestamp: new Date().toISOString(),
            });
            gasUsed = contractFunctions.find(
              (f) => f.name === "withdraw"
            ).gasEstimate;
          } else {
            newLogs = [
              "Withdraw function called",
              "Ownership verified",
              "Error: Insufficient balance for withdrawal",
            ];
          }
          break;
        default:
          return prev;
      }

      setLogs(newLogs.map((log) => ({ message: log, gasUsed })));
      setCurrentStep(0);

      return {
        ...prev,
        balance: newBalance,
        transactions: newTransactions,
      };
    });
    setAmount("");
  }, [action, amount, contractFunctions]);

  const chartData = useMemo(() => {
    return contractState.transactions.map((tx, index) => ({
      name: index,
      balance: contractState.transactions
        .slice(0, index + 1)
        .reduce(
          (acc, curr) =>
            curr.type === "Deposit" ? acc + curr.amount : acc - curr.amount,
          1000
        ),
    }));
  }, [contractState.transactions]);

  const renderLogs = () => {
    return logs.map((log, index) => (
      <div
        key={index}
        className={`flex items-center justify-between ${
          index <= currentStep ? "text-green-400" : "text-slate-400"
        }`}
      >
        <div className="flex items-center">
          {index <= currentStep ? (
            <Check size={16} className="mr-2" />
          ) : (
            <AlertCircle size={16} className="mr-2" />
          )}
          <span>{log.message}</span>
        </div>
        <span className="text-xs">Gas: {log.gasUsed}</span>
      </div>
    ));
  };

  const totalGasUsed = useMemo(() => {
    return logs.reduce((total, log) => total + log.gasUsed, 0);
  }, [logs]);

  const gasCost = useMemo(() => {
    return (totalGasUsed * gasPrice * 1e-9).toFixed(6);
  }, [totalGasUsed, gasPrice]);

  const simulateNetworkConditions = useCallback(() => {
    const congestionFactor = 1 + (networkCongestion - 1) * 0.5;
    setGasPrice((prevPrice) =>
      Math.max(1, Math.floor(prevPrice * congestionFactor))
    );
  }, [networkCongestion]);

  const simulateMarketConditions = useCallback(() => {
    const volatilityFactor = 1 + (marketVolatility - 1) * 0.1;
    setContractState((prev) => ({
      ...prev,
      balance: prev.balance * (1 + (Math.random() - 0.5) * volatilityFactor),
    }));
  }, [marketVolatility]);

  useEffect(() => {
    const interval = setInterval(() => {
      simulateNetworkConditions();
      simulateMarketConditions();
    }, 5000);
    return () => clearInterval(interval);
  }, [simulateNetworkConditions, simulateMarketConditions]);

  useEffect(() => {
    const interval = setInterval(() => {
      setContractState((prev) => {
        const change = (Math.random() - 0.5) * 10 * difficulty;
        const newBalance = Math.max(0, prev.balance + change);
        return {
          ...prev,
          balance: parseFloat(newBalance.toFixed(2)),
          transactions: [
            ...prev.transactions,
            {
              type: change > 0 ? "Deposit" : "Withdrawal",
              amount: Math.abs(change),
              timestamp: new Date().toISOString(),
            },
          ],
        };
      });
    }, 5000 / difficulty);

    return () => clearInterval(interval);
  }, [difficulty]);

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-6 border border-indigo-500">
      <h3 className="text-2xl font-semibold mb-4 text-indigo-400 flex items-center">
        <Zap className="mr-2" /> Advanced Smart Contract Simulator
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex mb-4">
            <button
              onClick={() => setActiveTab("state")}
              className={`flex-1 py-2 px-4 rounded-l ${
                activeTab === "state"
                  ? "bg-indigo-500 text-white"
                  : "bg-slate-700 text-slate-300"
              }`}
            >
              Contract State
            </button>
            <button
              onClick={() => setActiveTab("actions")}
              className={`flex-1 py-2 px-4 rounded-r ${
                activeTab === "actions"
                  ? "bg-indigo-500 text-white"
                  : "bg-slate-700 text-slate-300"
              }`}
            >
              Actions
            </button>
          </div>
          {activeTab === "state" ? (
            <div className="bg-slate-700 p-4 rounded mb-4">
              <p className="text-slate-300">
                Balance: {contractState.balance.toFixed(2)} ETH
              </p>
              <p className="text-slate-300">Owner: {contractState.owner}</p>
              <p className="text-slate-300">
                Transactions: {contractState.transactions.length}
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap mb-4">
              <select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="bg-slate-700 text-slate-300 p-2 rounded mr-2 mb-2"
                aria-label="Select Action"
              >
                <option value="">Select Action</option>
                <option value="deposit">Deposit</option>
                <option value="withdraw">Withdraw</option>
              </select>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                className="bg-slate-700 text-slate-300 p-2 rounded mr-2 mb-2"
                aria-label="Amount"
              />
              <button
                onClick={executeAction}
                className="bg-indigo-500 text-white px-4 py-2 rounded-full font-bold hover:bg-indigo-600 mb-2 flex items-center"
              >
                <ArrowRight className="mr-2" /> Execute
              </button>
            </div>
          )}
          <h4 className="text-lg font-semibold mb-2 text-indigo-300 flex items-center">
            <Code className="mr-2" /> Execution Logs
          </h4>
          <div className="bg-slate-700 p-4 rounded mb-4 h-40 overflow-y-auto">
            {renderLogs()}
          </div>
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={() =>
                setCurrentStep((prev) => Math.min(prev + 1, logs.length - 1))
              }
              className="bg-indigo-500 text-white px-4 py-2 rounded-full font-bold hover:bg-indigo-600 flex items-center"
              disabled={currentStep === logs.length - 1}
            >
              <ArrowRight className="mr-2" /> Next Step
            </button>
            <div className="text-slate-300">
              <span className="font-semibold">Total Gas Used:</span>{" "}
              {totalGasUsed}
            </div>
          </div>
          <div className="bg-slate-700 p-4 rounded">
            <DollarSign className="h-4 w-4 inline mr-2" />
            <span className="font-bold">Gas Cost Estimation</span>
            <p className="text-slate-300">
              Estimated cost: {gasCost} ETH (at {gasPrice} Gwei)
            </p>
          </div>
        </div>
        <div>
          <div className="flex mb-4">
            <button
              onClick={() => setActiveChartTab("balance")}
              className={`flex-1 py-2 px-4 rounded-l ${
                activeChartTab === "balance"
                  ? "bg-indigo-500 text-white"
                  : "bg-slate-700 text-slate-300"
              }`}
            >
              Balance History
            </button>
            <button
              onClick={() => setActiveChartTab("functions")}
              className={`flex-1 py-2 px-4 rounded-r ${
                activeChartTab === "functions"
                  ? "bg-indigo-500 text-white"
                  : "bg-slate-700 text-slate-300"
              }`}
            >
              Contract Functions
            </button>
          </div>
          {activeChartTab === "balance" ? (
            <>
              <div
                className="bg-slate-700 p-4 rounded mb-4"
                style={{ height: "300px" }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "none",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="balance"
                      stroke="#818cf8"
                      fill="#818cf8"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-indigo-300 mb-2">
                  Simulation Difficulty: {difficulty}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={difficulty}
                  onChange={(e) => setDifficulty(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </>
          ) : (
            <div className="bg-slate-700 p-4 rounded">
              {contractFunctions.map((func, index) => (
                <div key={index} className="mb-4">
                  <button
                    onClick={() => setSelectedFunction(func)}
                    className="text-indigo-300 hover:text-indigo-400 underline flex items-center"
                  >
                    <Code className="mr-2" /> {func.name}()
                  </button>
                  <p className="text-slate-400 text-sm">{func.description}</p>
                </div>
              ))}
            </div>
          )}
          {selectedFunction && (
            <div className="mt-4">
              <h5 className="text-md font-semibold mb-1 text-indigo-200 flex items-center">
                <Code className="mr-2" /> {selectedFunction.name}() Function
              </h5>
              <pre className="bg-slate-900 p-2 rounded text-sm text-slate-300 overflow-x-auto">
                {selectedFunction.code}
              </pre>
              <h6 className="text-md font-semibold mt-2 mb-1 text-indigo-200 flex items-center">
                <Repeat className="mr-2" /> Function Steps:
              </h6>
              <ol className="list-decimal list-inside text-slate-300">
                {selectedFunction.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
              <p className="text-slate-300 mt-2">
                <span className="font-semibold">Estimated Gas:</span>{" "}
                {selectedFunction.gasEstimate}
              </p>
            </div>
          )}
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-2 text-indigo-300 flex items-center">
            <Repeat className="mr-2" /> Simulation Parameters
          </h4>
          <div className="mb-4">
            <label className="block text-sm font-medium text-indigo-300 mb-2">
              Network Congestion: {networkCongestion.toFixed(1)}x
            </label>
            <input
              type="range"
              min="1"
              max="5"
              step="0.1"
              value={networkCongestion}
              onChange={(e) => setNetworkCongestion(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-indigo-300 mb-2">
              Market Volatility: {marketVolatility.toFixed(1)}x
            </label>
            <input
              type="range"
              min="1"
              max="5"
              step="0.1"
              value={marketVolatility}
              onChange={(e) => setMarketVolatility(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationSection;
