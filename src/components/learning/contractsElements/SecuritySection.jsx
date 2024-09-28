import React, { useState, useCallback, useEffect, useMemo } from "react";

const SecurityAuditSimulator = () => {
  const [auditState, setAuditState] = useState({
    auditing: true,
    progress: 0,
    vulnerabilities: [],
    selectedVulnerability: null,
    showVulnerableCode: false,
    showSecureCode: false,
    contractSecurityScore: 0,
    auditLog: [],
  });

  const vulnerabilityDatabase = useMemo(
    () => [
      {
        name: "Reentrancy",
        severity: "High",
        description:
          "A vulnerability that allows a function to be called repeatedly before the first invocation is finished.",
        example: `function withdraw(uint amount) public {
    require(balances[msg.sender] >= amount);
    msg.sender.call.value(amount)("");
    balances[msg.sender] -= amount;
}`,
        fix: `function withdraw(uint amount) public {
    require(balances[msg.sender] >= amount);
    balances[msg.sender] -= amount;
    (bool success, ) = msg.sender.call.value(amount)("");
    require(success, "Transfer failed.");
}`,
        realWorldExample:
          "The DAO hack in 2016, resulting in the loss of 3.6 million ETH.",
      },
      {
        name: "Integer Overflow",
        severity: "Medium",
        description:
          "Occurs when an arithmetic operation attempts to create a numeric value outside the representable range.",
        example: `function addToBalance(uint256 amount) public {
    balances[msg.sender] += amount;
}`,
        fix: `import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract SecureContract {
    using SafeMath for uint256;
    function addToBalance(uint256 amount) public {
        balances[msg.sender] = balances[msg.sender].add(amount);
    }
}`,
        realWorldExample:
          "The BEC token hack in 2018, allowing attackers to generate massive amounts of tokens.",
      },
    ],
    []
  );

  const getRandomVulnerabilities = useCallback(
    () => vulnerabilityDatabase.filter(() => Math.random() > 0.5),
    [vulnerabilityDatabase]
  );

  const addAuditLogEntry = useCallback((message) => {
    setAuditState((prev) => ({
      ...prev,
      auditLog: [...prev.auditLog, { message, timestamp: new Date() }],
    }));
  }, []);

  const calculateSecurityScore = useCallback(
    (foundVulnerabilities) => {
      const maxScore = vulnerabilityDatabase.length * 10;
      const vulnerabilityScore = foundVulnerabilities.reduce(
        (score, vuln) =>
          score -
          (vuln.severity === "High" ? 10 : vuln.severity === "Medium" ? 5 : 2),
        maxScore
      );
      return Math.max(0, (vulnerabilityScore / maxScore) * 100);
    },
    [vulnerabilityDatabase]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setAuditState((prev) => {
        if (prev.progress >= 100) {
          clearInterval(interval);
          const foundVulnerabilities = getRandomVulnerabilities();
          return {
            ...prev,
            auditing: false,
            progress: 100,
            vulnerabilities: foundVulnerabilities,
            contractSecurityScore: calculateSecurityScore(foundVulnerabilities),
          };
        }
        return { ...prev, progress: prev.progress + 10 };
      });
    }, 500);

    return () => clearInterval(interval);
  }, [getRandomVulnerabilities, calculateSecurityScore]);

  useEffect(() => {
    if (auditState.progress === 100) {
      addAuditLogEntry("Audit completed. Vulnerabilities identified.");
    }
  }, [auditState.progress, addAuditLogEntry]);

  const handleVulnerabilityClick = useCallback((index) => {
    setAuditState((prev) => ({
      ...prev,
      selectedVulnerability: index,
      showVulnerableCode: false,
      showSecureCode: false,
    }));
  }, []);

  const toggleCode = useCallback((codeType) => {
    setAuditState((prev) => ({
      ...prev,
      [codeType]: !prev[codeType],
    }));
  }, []);

  const SeverityBadge = ({ severity }) => (
    <span
      className={`${
        severity === "High"
          ? "bg-red-500"
          : severity === "Medium"
          ? "bg-yellow-500"
          : "bg-blue-500"
      } text-white text-xs font-bold mr-2 px-2.5 py-0.5 rounded`}
    >
      {severity}
    </span>
  );

  const renderVulnerabilityList = () => (
    <Card>
      <CardHeader>
        <CardTitle>⚠️ Vulnerabilities Found</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {auditState.vulnerabilities.map((vuln, index) => (
            <li
              key={index}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <button
                className={`w-full text-left flex items-center ${
                  auditState.selectedVulnerability === index
                    ? "bg-indigo-500"
                    : "bg-gray-600"
                } p-2 rounded transition-colors duration-300`}
                onClick={() => handleVulnerabilityClick(index)}
              >
                <span className="mr-1">▶️</span>
                <span className="flex-grow">{vuln.name}</span>
                <SeverityBadge severity={vuln.severity} />
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );

  const renderVulnerabilityDetails = () => {
    const vuln = auditState.vulnerabilities[auditState.selectedVulnerability];
    return (
      <Card>
        <CardHeader>
          <CardTitle>{vuln.name}</CardTitle>
          <CardDescription>{vuln.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => toggleCode("showVulnerableCode")}
              className="btn"
            >
              🔓 Vulnerable Code
            </button>
            <button
              onClick={() => toggleCode("showSecureCode")}
              className="btn"
            >
              🔒 Secure Code
            </button>
          </div>
          {auditState.showVulnerableCode && (
            <CodeBlock title="Vulnerable Code" code={vuln.example} />
          )}
          {auditState.showSecureCode && (
            <CodeBlock title="Secure Code" code={vuln.fix} />
          )}
          <div className="mt-4">
            <h5 className="text-indigo-300 mb-2">Real-World Example:</h5>
            <p className="text-slate-300">{vuln.realWorldExample}</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-6 border border-indigo-500">
      <h3 className="text-2xl font-semibold mb-4 text-indigo-400 flex items-center">
        <span className="mr-2">🛡️</span> Smart Contract Security Audit Simulator
      </h3>
      {auditState.auditing && <Progress value={auditState.progress} />}
      {auditState.vulnerabilities.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          <div className="lg:col-span-1">{renderVulnerabilityList()}</div>
          <div className="lg:col-span-2">
            {auditState.selectedVulnerability !== null &&
              renderVulnerabilityDetails()}
          </div>
        </div>
      )}
      <AuditLog entries={auditState.auditLog} />
      <SecurityScore score={auditState.contractSecurityScore} />
    </div>
  );
};

// Reusable components
const Progress = ({ value }) => (
  <div className="relative pt-1">
    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-700">
      <div
        style={{ width: `${value}%` }}
        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-500 ease-in-out"
      />
    </div>
    <p className="text-slate-300 mt-2">Audit progress: {value}%</p>
  </div>
);

const Card = ({ children }) => (
  <div className="bg-slate-900 rounded-lg shadow-lg p-4">{children}</div>
);

const CardHeader = ({ children }) => (
  <div className="mb-4 border-b border-slate-700 pb-2">{children}</div>
);

const CardTitle = ({ children }) => (
  <h4 className="text-lg font-semibold text-indigo-300 flex items-center">
    {children}
  </h4>
);

const CardDescription = ({ children }) => (
  <p className="text-slate-300">{children}</p>
);

const CardContent = ({ children }) => <div>{children}</div>;

const CodeBlock = ({ title, code }) => (
  <div className="bg-slate-900 p-4 rounded-lg mt-4 animate-fade-in">
    <h5 className="text-indigo-300 mb-2">{title}:</h5>
    <pre className="text-sm text-slate-200 whitespace-pre-wrap">{code}</pre>
  </div>
);

const AuditLog = ({ entries }) => (
  <div className="mt-6 bg-slate-700 p-4 rounded-lg">
    <h4 className="text-indigo-300 mb-4 font-semibold">Audit Log</h4>
    <ul className="space-y-2">
      {entries.map((entry, index) => (
        <li
          key={index}
          className="text-slate-400 animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <span className="text-slate-300 font-semibold">
            [{entry.timestamp.toLocaleTimeString()}]
          </span>{" "}
          {entry.message}
        </li>
      ))}
    </ul>
  </div>
);

const SecurityScore = ({ score }) => (
  <div className="mt-6">
    <h4 className="text-indigo-300 font-semibold">Contract Security Score</h4>
    <div className="relative pt-1">
      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
        <div
          style={{ width: `${score}%` }}
          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-1000 ease-in-out"
        />
      </div>
    </div>
    <p className="text-slate-300 mt-2">{score.toFixed(2)}% secure</p>
  </div>
);

export default SecurityAuditSimulator;
