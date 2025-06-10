"use client"; // <-- safe even in pages router for clarity

import dynamic from "next/dynamic";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
  lat: number;
  lng: number;
  name: string;
  status: string;
};

export default function AlertMapClient({ lat, lng, name, status }: Props) {
  return (
    <div className="h-[400px] w-full">
      <MapContainer center={[lat, lng]} zoom={13} scrollWheelZoom={true} className="h-full w-full z-0">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[lat, lng]}>
          <Popup>
            {name} - {status}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
