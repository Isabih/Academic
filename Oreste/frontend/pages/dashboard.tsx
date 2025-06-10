import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card"; // ✅ Correct path
import { Badge } from "../components/ui/badge"; // Adjust this too if needed
import { Bell, Activity, HeartPulse, ShieldAlert } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import Map component without SSR
const Map = dynamic(() => import("../components/AlertMap"), { ssr: false });

export default function DashboardPage() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "Heartbeat Low",
      message: "Heartbeat dropped below 50 bpm",
      time: "2025-05-06 12:34",
      lat: -1.9441,
      lng: 30.0619,
    },
    {
      id: 2,
      type: "Fall Detected",
      message: "Soldier might have fallen",
      time: "2025-05-06 12:36",
      lat: -1.9444,
      lng: 30.0615,
    },
  ]);

  const [soldierData, setSoldierData] = useState({
    name: "John Doe",
    status: "Active",
    heartbeat: 72,
    impact: false,
    fallen: false,
    lat: -1.9441,
    lng: 30.0619,
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <HeartPulse className="text-red-500" />
            <div>
              <p className="text-sm text-muted-foreground">Heartbeat</p>
              <p className="text-xl font-semibold">{soldierData.heartbeat} bpm</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <Activity className="text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">Fall Status</p>
              <p className="text-xl font-semibold">
                {soldierData.fallen ? "Fallen" : "Normal"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <ShieldAlert className="text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Bullet Impact</p>
              <p className="text-xl font-semibold">
                {soldierData.impact ? "Detected" : "None"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-[400px]">
            <CardContent className="h-full p-0">
              <Map
                lat={soldierData.lat}
                lng={soldierData.lng}
                name={soldierData.name}
                status={soldierData.status}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-[400px] overflow-auto">
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">Alerts</h2>
                <Badge variant="destructive">{alerts.length}</Badge>
              </div>
              {alerts.map((alert) => (
                <div key={alert.id} className="border-b pb-2">
                  <p className="text-sm font-medium">{alert.type}</p>
                  <p className="text-xs text-muted-foreground">{alert.message}</p>
                  <p className="text-xs text-gray-500">{alert.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
