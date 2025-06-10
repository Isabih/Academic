import { useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const AlertMap = dynamic(() => import('../components/AlertMap'), {
  ssr: false,
});

type Soldier = {
  name: string;
  code: string;
  jacketCode: string;
  lat: number;
  lng: number;
  heartbeat: number;
  temperature: number;
  status: string;
  last_updated: string;
  reason: string;
};

export default function MapPage() {
  const [query, setQuery] = useState('');
  const [soldier, setSoldier] = useState<Soldier | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setError('');
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/soldier/search?q=${query}`);
      if (!res.ok) throw new Error('Failed to fetch soldier');
      const data = await res.json();

      if (!data) {
        setSoldier(null);
        setError('No soldier found with that info.');
        return;
      }

      setSoldier(data);
    } catch (err) {
      setError('Something went wrong.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-xl space-y-6">
        <h1 className="text-2xl font-bold text-center">📍 Soldier Location Map</h1>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by Name / Code / Jacket Code"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-xl shadow-sm"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        {error && <p className="text-red-600 text-center">{error}</p>}

        {soldier && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 items-start">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-700">🧍 Soldier Info</h2>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <Info label="Name" value={soldier.name} />
                <Info label="Code" value={soldier.code} />
                <Info label="Jacket Code" value={soldier.jacketCode} />
                <Info label="Temperature" value={`${soldier.temperature}°C`} />
                <Info label="Heartbeat" value={`${soldier.heartbeat} bpm`} />
                <Info label="Status" value={soldier.status} />
                <Info label="Alert Reason" value={soldier.reason || 'None'} />
                <Info label="Last Seen" value={soldier.last_updated || 'Unknown'} />
              </div>
            </div>

            <AlertMap
              lat={soldier.lat}
              lng={soldier.lng}
              name={soldier.name}
              status={soldier.status}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  );
}
