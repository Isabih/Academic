import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale);

type SoldierData = {
  name: string;
  rank: string;
  battalion: string;
  code: string;
  jacketCode: string;
  heartbeat: number;
  fallen: boolean;
  impact: boolean;
  temperature: number;
  history: number[];
};

export default function SoldierPage() {
  const router = useRouter();
  const { code } = router.query;
  const [data, setData] = useState<SoldierData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/soldiers/code/${code}`);
        if (!res.ok) throw new Error("Failed to fetch soldier data.");
        const json = await res.json();
        setData({
          name: json.name,
          rank: json.rank,
          battalion: json.battalion,
          code: json.code,
          jacketCode: json.jacketCode,
          heartbeat: json.heartbeat,
          fallen: json.fallen,
          impact: json.impact,
          temperature: json.temperature,
          history: json.heartbeat_history || [json.heartbeat],
        });
      } catch (err: any) {
        setError(err.message || "Error fetching soldier data.");
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, [code]);

  if (error) {
    return (
      <div className="p-6 text-red-700 bg-red-100 rounded-xl">
        ❌ Error: {error}
      </div>
    );
  }

  if (!data) {
    return <div className="p-6">Loading soldier data...</div>;
  }

  const isUnhealthy =
    data.heartbeat < 60 || data.fallen || data.impact;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-xl space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          🧍 Soldier Status - {data.name}
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl border">
            <h4 className="font-semibold mb-2">🪪 Personal Info</h4>
            <p><strong>Rank:</strong> {data.rank}</p>
            <p><strong>Battalion:</strong> {data.battalion}</p>
            <p><strong>Code:</strong> {data.code}</p>
            <p><strong>Jacket Code:</strong> {data.jacketCode}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border">
            <h4 className="font-semibold mb-2">📡 Live Status</h4>
            <p>💓 <strong>Heartbeat:</strong> {data.heartbeat} BPM</p>
            <p>🌡️ <strong>Temperature:</strong> {data.temperature} °C</p>
            <p>🎯 <strong>Hit Detected:</strong> {data.impact ? "YES" : "NO"}</p>
            <p>⚠️ <strong>Fall Detected:</strong> {data.fallen ? "YES" : "NO"}</p>
            <p>
              🩺 <strong>Health:</strong>{" "}
              {isUnhealthy ? "⚠️ Not Normal" : "✅ Normal"}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl border">
          <h4 className="font-semibold mb-2">📈 Heartbeat History</h4>
          <Line
            data={{
              labels: data.history.map((_, i) => `T-${i}`),
              datasets: [
                {
                  label: "BPM",
                  data: data.history,
                  borderColor: "rgb(59, 130, 246)",
                  backgroundColor: "rgba(59, 130, 246, 0.3)",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                y: { beginAtZero: false, min: 40, max: 140 },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
