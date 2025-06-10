import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";

type Soldier = {
  id: number;
  name: string;
  rank: string;
  battalion: string;
  code: string;
  jacketCode: string;
  heartbeat: number;
  temperature: number;
  fallen: boolean;
  impact: boolean;
  lat: number;
  lng: number;
};

export default function AdminDashboard() {
  const [soldiers, setSoldiers] = useState<Soldier[]>([]);
  const alertRowRef = useRef<HTMLTableRowElement | null>(null);

  // Fetch all soldier data
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/soldiers")
      .then((res) => res.json())
      .then((data) => {
        setSoldiers(data);
      });
  }, []);

  // Scroll and toast on alert
  useEffect(() => {
    const firstAlert = soldiers.find(s => s.fallen || s.impact || s.heartbeat < 60);
    if (firstAlert && alertRowRef.current) {
      alertRowRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      toast.error(
        <span>
          ⚠️ {firstAlert.name} —{" "}
          <Link href={`/alert/${firstAlert.jacketCode}`} className="underline text-blue-200">
            View Alert
          </Link>
        </span>,
        { autoClose: 5000, position: "top-center" }
      );
    }
  }, [soldiers]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🛡️ Admin Dashboard</h1>

      <div className="overflow-x-auto rounded-xl shadow-lg border">
        <table className="w-full table-auto">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Rank</th>
              <th className="p-3 text-left">Battalion</th>
              <th className="p-3 text-left">Heartbeat</th>
              <th className="p-3 text-left">Temperature</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {soldiers.map((s, i) => {
              const isAlert = s.fallen || s.impact || s.heartbeat < 60;
              const rowRef = isAlert && !alertRowRef.current ? alertRowRef : null;

              return (
                <tr
                  key={s.id}
                  ref={rowRef}
                  className={`${isAlert ? "animate-alert-row" : ""} border-b hover:bg-gray-50`}
                >
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.rank}</td>
                  <td className="p-3">{s.battalion}</td>
                  <td className="p-3">{s.heartbeat} BPM</td>
                  <td className="p-3">{s.temperature} °C</td>
                  <td className="p-3 font-bold">
                    {isAlert ? (
                      <Link href={`/alert/${s.jacketCode}`}>
                        <span className="text-red-600 hover:underline cursor-pointer">⚠️ Alert</span>
                      </Link>
                    ) : (
                      "✅ Normal"
                    )}
                  </td>
                  <td className="p-3">
                    <Link href={`/soldier/${s.code}`}>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded">
                        View
                      </button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
