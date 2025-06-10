import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

// Load map component only on client
const AlertMap = dynamic(() => import("../../components/AlertMap"), {
  ssr: false,
});

export default function AlertPage() {
  const router = useRouter();
  const { jacketCode } = router.query;

  const [alert, setAlert] = useState<any>(null);
  const [locationName, setLocationName] = useState("Loading...");

  const fetchPlaceName = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      const name = data.display_name || "Unknown";
      setLocationName(name);
    } catch (err) {
      console.error("Geocoding failed:", err);
      setLocationName("Unknown");
    }
  };

  useEffect(() => {
    if (!jacketCode) return;

    const fetchAlert = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/alert/${jacketCode}`);
        const data = await res.json();
        setAlert(data);

        // Initial reverse geocode
        if (data.lat && data.lng) fetchPlaceName(data.lat, data.lng);
      } catch (err) {
        console.error("Failed to fetch alert:", err);
      }
    };

    fetchAlert();

    const interval = setInterval(() => {
      fetchAlert();
    }, 1000); // every 1 second

    return () => clearInterval(interval);
  }, [jacketCode]);

  if (!alert) return <p className="p-4 text-center">Loading alert data...</p>;

  const lat = alert.lat ?? -1.9577;
  const lng = alert.lng ?? 30.1127;

  const determineReason = () => {
    if (alert.hit) return "Hit Detected";
    if (alert.fall) return "Fall Detected";
    if (alert.temperature > 38) return "High Temperature";
    if (alert.heart_rate > 100) return "Abnormal Heartbeat";
    return "No Alert";
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 px-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🚨 Alert for {alert.name}</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT PANEL */}
        <div className="w-full lg:w-1/2 space-y-4 bg-white p-6 shadow rounded-xl">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Info label="Name" value={alert.name} />
            <Info label="Status" value={alert.status} />
            <Info label="Temperature" value={`${alert.temperature}°C`} />
            <Info label="Heart Rate" value={`${alert.heart_rate} bpm`} />
            <Info label="Fall Detected" value={alert.fall ? "Yes" : "No"} />
            <Info label="Hit Detected" value={alert.hit ? "Yes" : "No"} />
            <Info label="Longitude" value={lng.toFixed(5)} />
            <Info label="Latitude" value={lat.toFixed(5)} />
            <Info label="Location" value={locationName} />
            <Info label="Last Seen" value={alert.last_updated || "Unknown"} />
          </div>
          <div className="bg-red-100 text-red-800 px-4 py-2 rounded-md font-semibold">
            Reason for Alert: {determineReason()}
          </div>
        </div>

        {/* RIGHT PANEL - MAP */}
        <div className="w-full lg:w-1/2">
          <AlertMap
            lat={lat}
            lng={lng}
            name={alert.name}
            status={alert.status}
            locationName={locationName}
          />
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  );
}
