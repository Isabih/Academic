import { useEffect, useState } from "react";
import Link from "next/link";

type Soldier = {
  id: number;
  name: string;
  rank: string;
  battalion: string;
  code: string;
  jacketCode: string;
  heartbeat: number | null;
  fallen: boolean;
  impact: boolean;
  temperature: number | null;
  lat: number | null;
  lng: number | null;
  status: string;
  last_updated: string;
};

export default function AdminDashboard() {
  const [soldiers, setSoldiers] = useState<Soldier[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Fetching soldiers...");
    fetch("http://127.0.0.1:5000/api/soldiers/")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch soldiers.");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched soldiers:", data);
        setSoldiers(data);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message);
      });
  }, []);

  const filtered = soldiers.filter((s) => {
    const name = s.name || "";
    const rank = s.rank || "";
    const battalion = s.battalion || "";
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      rank.toLowerCase().includes(search.toLowerCase()) ||
      battalion.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-xl space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          🧑‍💼 Admin Dashboard
        </h2>

        <input
          type="text"
          placeholder="Search by name, rank, or battalion..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded">
            ❌ {error}
          </div>
        )}

        <div className="bg-yellow-50 p-2 rounded">
          <strong>Debug:</strong> Loaded {soldiers.length} soldier(s)
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm text-gray-700">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Name</th>
                <th className="p-2">Rank</th>
                <th className="p-2">Battalion</th>
                <th className="p-2">Heartbeat</th>
                <th className="p-2">Fall</th>
                <th className="p-2">Impact</th>
                <th className="p-2">Temp</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const isAlert =
                  (s.heartbeat ?? 0) < 60 || s.fallen || s.impact;

                return (
                  <tr
                    key={s.id}
                    className={isAlert ? "bg-red-100" : "bg-green-50"}
                  >
                    <td className="p-2">{s.name}</td>
                    <td className="p-2">{s.rank}</td>
                    <td className="p-2">{s.battalion}</td>
                    <td className="p-2">{s.heartbeat ?? "--"} BPM</td>
                    <td className="p-2">{s.fallen ? "Yes" : "No"}</td>
                    <td className="p-2">{s.impact ? "Yes" : "No"}</td>
                    <td className="p-2">{s.temperature ?? "--"}°C</td>
                   
                      <td className="p-2 font-bold">
                         {isAlert ? (
                        <Link href={`/alert/${s.jacketCode}`}>
                        <span className="text-red-600 hover:underline cursor-pointer">⚠️ Alert</span>
                        </Link>
                         ) : (
                         "✅ Normal"
                       )}
                    </td>
                    <td className="p-2">
                      <Link href={`/soldier/${s.code}`}>
                        <span className="text-blue-600 hover:underline cursor-pointer">
                          View
                        </span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center p-4">
                    No matching soldiers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
