// pages/rfid.tsx
import { useState, useEffect, useRef } from "react";

type Soldier = {
  name: string;
  rank: string;
  dob: string;
  battalion: string;
  code: string;
  jacketCode: string;
  disability: string;
};

export default function RFIDFetch() {
  const [cardId, setCardId] = useState("");
  const [soldier, setSoldier] = useState<Soldier | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input on mount
  useEffect(() => inputRef.current?.focus(), []);

  // Simulate fetch on card scanning (Enter key)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && cardId.trim()) {
      // TODO: replace with real API call
      const mock: Soldier = {
        name: "Jane Doe",
        rank: "Lieutenant",
        dob: "1990-07-12",
        battalion: "Delta",
        code: cardId,             // use card ID
        jacketCode: "JP-900",
        disability: "None",
      };
      setSoldier(mock);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">📶 Scan RFID Card</h2>
        <input
          ref={inputRef}
          value={cardId}
          onChange={(e) => setCardId(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Scan or Enter Card ID and press Enter"
          className="w-full border border-gray-300 rounded-xl px-4 py-2 mb-6 focus:outline-none"
        />

        {soldier ? (
          <div className="space-y-2">
            <p><strong>Name:</strong> {soldier.name}</p>
            <p><strong>Rank:</strong> {soldier.rank}</p>
            <p><strong>DOB:</strong> {soldier.dob}</p>
            <p><strong>Battalion:</strong> {soldier.battalion}</p>
            <p><strong>Soldier Code:</strong> {soldier.code}</p>
            <p><strong>Jacket Code:</strong> {soldier.jacketCode}</p>
            <p><strong>Disability:</strong> {soldier.disability}</p>
          </div>
        ) : (
          <p className="text-gray-500">Awaiting card scan...</p>
        )}
      </div>
    </div>
  );
}
