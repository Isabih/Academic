// pages/register.tsx
import { useState, useRef } from "react";
import QRCode from "react-qr-code";
import { toast } from "react-toastify";
import axios from "axios";

const rankOptions = [
  "Private",
  "Corporal",
  "Sergeant",
  "Lieutenant",
  "Captain",
  "Major",
  "Colonel",
  "General",
];

const battalionOptions = [
  "Alpha",
  "Bravo",
  "Charlie",
  "Delta",
  "Echo",
];

export default function RegisterSoldier() {
  const [formData, setFormData] = useState({
    name: "",
    rank: "",
    dob: "",
    battalion: "",
    code: "",
    disability: "",
    jacketCode: "",
    email: "",
    password: "",
  });
  const [qrValue, setQrValue] = useState<string | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Register soldier in backend
      await axios.post("http://localhost:5000/api/auth/register/soldier", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      const payload = JSON.stringify({
        name: formData.name,
        rank: formData.rank,
        dob: formData.dob,
        battalion: formData.battalion,
        code: formData.code,
        jacketCode: formData.jacketCode,
        disability: formData.disability,
      });

      setQrValue(payload);
      toast.success("✅ Soldier registered and QR code generated!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Registration failed");
    }
  };

  const handlePrint = () => {
    if (!qrRef.current) return;
    const printContents = qrRef.current.innerHTML;
    const win = window.open("", "_blank", "width=400,height=600");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Print QR Code</title>
          <style>
            body { display:flex; justify-content:center; align-items:center; height:100vh; margin:0 }
          </style>
        </head>
        <body>${printContents}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          📝 Register Soldier
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="border border-gray-300 rounded-xl px-4 py-2 w-full"
              required
            />

            <select
              name="rank"
              value={formData.rank}
              onChange={handleChange}
              className="border border-gray-300 rounded-xl px-4 py-2 w-full bg-white"
              required
            >
              <option value="" disabled>
                Select Rank
              </option>
              {rankOptions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <input
              type="date"
              name="dob"
              onChange={handleChange}
              className="border border-gray-300 rounded-xl px-4 py-2 w-full"
              required
            />

            <select
              name="battalion"
              value={formData.battalion}
              onChange={handleChange}
              className="border border-gray-300 rounded-xl px-4 py-2 w-full bg-white"
              required
            >
              <option value="" disabled>
                Select Battalion
              </option>
              {battalionOptions.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            <input
              name="code"
              placeholder="Soldier Code"
              onChange={handleChange}
              className="border border-gray-300 rounded-xl px-4 py-2 w-full"
              required
            />

            <input
              name="jacketCode"
              placeholder="Jacket Code"
              onChange={handleChange}
              className="border border-gray-300 rounded-xl px-4 py-2 w-full"
              required
            />

            <input
              name="email"
              placeholder="Email"
              type="email"
              onChange={handleChange}
              className="border border-gray-300 rounded-xl px-4 py-2 w-full"
              required
            />

            <input
              name="password"
              placeholder="Password"
              type="password"
              onChange={handleChange}
              className="border border-gray-300 rounded-xl px-4 py-2 w-full"
              required
            />
          </div>

          <input
            name="disability"
            placeholder="Disability (if any)"
            onChange={handleChange}
            className="border border-gray-300 rounded-xl px-4 py-2 w-full"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold"
          >
            Register & Generate QR
          </button>
        </form>

        {qrValue && (
          <div className="mt-8 text-center space-y-4">
            <div
              ref={qrRef}
              className="inline-block bg-white p-4 rounded-xl"
            >
              <QRCode value={qrValue} size={256} />
            </div>
            <button
              onClick={handlePrint}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
            >
              🖨️ Print QR Code
            </button>
            <p className="text-gray-600">
              Give this QR to the soldier for their vest.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
