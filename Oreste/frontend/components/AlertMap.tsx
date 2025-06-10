'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type Props = {
  lat: number;
  lng: number;
  name: string;
  status: string; // example: 'OK', 'Alert', 'Critical'
  locationName?: string;
};

// Function to choose color based on status
function getColorByStatus(status: string): string {
  switch (status.toLowerCase()) {
    case 'critical':
      return 'red';
    case 'alert':
      return 'orange';
    case 'ok':
      return 'green';
    default:
      return 'gray';
  }
}

export default function AlertMap({ lat, lng, name, status, locationName }: Props) {
  const iconColor = getColorByStatus(status);

  const customIcon = new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div class="marker-pin" style="background-color: ${iconColor}"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12], // center the marker
  });

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden border relative">
      <MapContainer center={[lat, lng]} zoom={17} scrollWheelZoom className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[lat, lng]} icon={customIcon}>
          <Popup>
            <strong>{name}</strong><br />
            Status: {status}<br />
            Location: {locationName || 'Unknown'}
          </Popup>
        </Marker>
      </MapContainer>

      {/* Inline styles for marker */}
      <style jsx>{`
        .marker-pin {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
}
