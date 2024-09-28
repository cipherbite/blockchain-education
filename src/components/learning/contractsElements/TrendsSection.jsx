import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SmartContractTrendsAnalyzer = () => {
  const [trendData, setTrendData] = useState([]);
  const [timeRange, setTimeRange] = useState(30);
  const [volatility, setVolatility] = useState(1);
  const [activeTab, setActiveTab] = useState("trendAnalysis");

  const trends = {
    defi: {
      name: "DeFi",
      color: "#1B5E20",
      baseValue: 1000,
      growth: 0.05,
      description:
        "Decentralized Finance (DeFi) refers to financial services built on blockchain technology, enabling open, permissionless access to various financial instruments.",
    },
    nft: {
      name: "NFT",
      color: "#0D47A1",
      baseValue: 500,
      growth: 0.03,
      description:
        "Non-Fungible Tokens (NFTs) are unique digital assets representing ownership of specific items or content on the blockchain, often used in digital art and collectibles.",
    },
    dao: {
      name: "DAO",
      color: "#F57F17",
      baseValue: 200,
      growth: 0.02,
      description:
        "Decentralized Autonomous Organizations (DAOs) are community-led entities with no central authority, governed by smart contracts and collective decision-making.",
    },
    gamefi: {
      name: "GameFi",
      color: "#4A148C",
      baseValue: 300,
      growth: 0.04,
      description:
        "GameFi combines blockchain gaming with decentralized finance, allowing players to earn cryptocurrency and NFTs through gameplay and participation.",
    },
    layer2: {
      name: "Layer 2",
      color: "#BF360C",
      baseValue: 400,
      growth: 0.06,
      description:
        "Layer 2 solutions are scalability technologies built on top of existing blockchains, aiming to increase transaction speed and reduce costs.",
    },
  };

  const generateRealisticTrendData = useCallback(() => {
    const data = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - timeRange + 1);

    for (let i = 0; i < timeRange; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      const day = {
        date: currentDate.toISOString().split("T")[0],
      };

      Object.entries(trends).forEach(([key, trend]) => {
        const growthFactor = Math.pow(1 + trend.growth, i);
        const randomFactor = 1 + (Math.random() - 0.5) * volatility * 0.1;
        day[key] = Math.round(trend.baseValue * growthFactor * randomFactor);
      });

      data.push(day);
    }
    setTrendData(data);
  }, [timeRange, volatility]);

  useEffect(() => {
    generateRealisticTrendData();
  }, [generateRealisticTrendData]);

  const calculateTrendStatistics = useMemo(() => {
    if (trendData.length < 2) return {};
    const statistics = {};
    Object.keys(trends).forEach((trend) => {
      const values = trendData.map((day) => day[trend]);
      const firstValue = values[0];
      const lastValue = values[values.length - 1];
      const change = ((lastValue - firstValue) / firstValue) * 100;
      const average =
        values.reduce((sum, value) => sum + value, 0) / values.length;
      const standardDeviation = Math.sqrt(
        values.reduce((sum, value) => sum + Math.pow(value - average, 2), 0) /
          values.length
      );
      const minValue = Math.min(...values);
      const maxValue = Math.max(...values);

      statistics[trend] = {
        change: change.toFixed(2),
        average: average.toFixed(2),
        standardDeviation: standardDeviation.toFixed(2),
        min: minValue,
        max: maxValue,
        range: maxValue - minValue,
      };
    });
    return statistics;
  }, [trendData]);

  const calculatePearsonCorrelation = (data, trend1, trend2) => {
    const n = data.length;
    let sum_X = 0,
      sum_Y = 0,
      sum_XY = 0;
    let squareSum_X = 0,
      squareSum_Y = 0;

    for (let i = 0; i < n; i++) {
      const x = data[i][trend1];
      const y = data[i][trend2];

      sum_X += x;
      sum_Y += y;
      sum_XY += x * y;

      squareSum_X += x * x;
      squareSum_Y += y * y;
    }

    const numerator = n * sum_XY - sum_X * sum_Y;
    const denominator = Math.sqrt(
      (n * squareSum_X - sum_X * sum_X) * (n * squareSum_Y - sum_Y * sum_Y)
    );

    return numerator / denominator;
  };

  const getCorrelationStrength = (correlation) => {
    const absCorrelation = Math.abs(correlation);
    if (absCorrelation >= 0.7) return "Strong";
    if (absCorrelation >= 0.5) return "Moderate";
    if (absCorrelation >= 0.3) return "Weak";
    return "Very Weak";
  };

  const calculateCorrelations = useMemo(() => {
    if (trendData.length === 0) return [];
    const correlations = [];
    const trendKeys = Object.keys(trends);
    trendKeys.forEach((trend1, i) => {
      trendKeys.forEach((trend2, j) => {
        if (i < j) {
          const correlation = calculatePearsonCorrelation(
            trendData,
            trend1,
            trend2
          );
          correlations.push({
            pair: `${trends[trend1].name} & ${trends[trend2].name}`,
            correlation: correlation.toFixed(2),
            strength: getCorrelationStrength(correlation),
          });
        }
      });
    });
    return correlations;
  }, [trendData]);

  const renderTrendAnalysis = () => (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Trend Analysis</h2>
      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {Object.entries(trends).map(([key, trend]) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={trend.name}
                stroke={trend.color}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {Object.entries(calculateTrendStatistics).map(([trend, stats]) => (
          <div key={trend} className="bg-gray-100 p-4 rounded-lg">
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: trends[trend].color }}
            >
              {trends[trend].name}
            </h3>
            <p className="text-sm mb-2 text-gray-700">
              {trends[trend].description}
            </p>
            <p className="text-gray-800">Change: {stats.change}%</p>
            <p className="text-gray-800">Average: {stats.average}</p>
            <p className="text-gray-800">Std Dev: {stats.standardDeviation}</p>
            <p className="text-gray-800">
              Range: {stats.range} ({stats.min} - {stats.max})
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCorrelationAnalysis = () => (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Correlation Analysis</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Trend Pair</th>
            <th className="text-left">Correlation</th>
            <th className="text-left">Strength</th>
          </tr>
        </thead>
        <tbody>
          {calculateCorrelations.map((correlation, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
              <td className="text-gray-800">{correlation.pair}</td>
              <td
                style={{
                  color: correlation.correlation > 0 ? "#1B5E20" : "#B71C1C",
                }}
              >
                {correlation.correlation}
              </td>
              <td className="text-gray-800">{correlation.strength}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Smart Contract Trends Analyzer
      </h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Time Range: {timeRange} days
        </label>
        <input
          type="range"
          min="7"
          max="90"
          value={timeRange}
          onChange={(e) => setTimeRange(Number(e.target.value))}
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Volatility: {volatility.toFixed(1)}x
        </label>
        <input
          type="range"
          min="1"
          max="5"
          step="0.1"
          value={volatility}
          onChange={(e) => setVolatility(Number(e.target.value))}
          className="w-full"
        />
      </div>
      <button
        onClick={generateRealisticTrendData}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
      >
        Regenerate Data
      </button>
      <div className="mb-4">
        <button
          onClick={() => setActiveTab("trendAnalysis")}
          className={`mr-2 px-4 py-2 rounded ${
            activeTab === "trendAnalysis"
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-gray-800"
          } hover:bg-blue-600 hover:text-white`}
        >
          Trend Analysis
        </button>
        <button
          onClick={() => setActiveTab("correlationAnalysis")}
          className={`px-4 py-2 rounded ${
            activeTab === "correlationAnalysis"
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-gray-800"
          } hover:bg-blue-600 hover:text-white`}
        >
          Correlation Analysis
        </button>
      </div>
      {activeTab === "trendAnalysis"
        ? renderTrendAnalysis()
        : renderCorrelationAnalysis()}
    </div>
  );
};

export default SmartContractTrendsAnalyzer;
