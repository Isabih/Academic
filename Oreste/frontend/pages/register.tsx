import { useState, useRef } from "react";
import QRCode from "react-qr-code";
import { toast } from "react-toastify";
import axios from "axios";

const rankOptions = [
  "Private", "Corporal", "Sergeant", "Lieutenant",
  "Captain", "Major", "Colonel", "General",
];

const battalionOptions = ["Alpha", "Bravo", "Charlie", "Delta", "Echo"];

const disabilityOptions = ["None", "Hearing", "Vision", "Mobility", "Other"];

export default function Register() {
  const [role, setRole] = useState<"soldier" | "admin">("soldier");
  const [formData, setFormData] = useState({
    name: "",
    rank: "",
    dob: new Date().toISOString().split("T")[0],
    battalion: "",
    code: "",
    jacketCode: "",
    disability: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [qrValue, setQrValue] = useState<string | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQrValue(null); // Reset QR on resubmit

    if (formData.password !== formData.confirmPassword) {
      toast.error("❌ Passwords do not match");
      return;
    }

    try {
      if (role === "soldier") {
        await axios.post("http://localhost:5000/api/auth/register/soldier", {
          name: formData.name,
          rank: formData.rank,
          dob: formData.dob,
          battalion: formData.battalion,
          code: formData.code,
          jacket_code: formData.jacketCode,
          disability: formData.disability,
          email: formData.email,
          password: formData.password,
        });

        const payload = JSON.stringify({
          name: formData.name,
          rank: formData.rank,
          dob: formData.dob,
          battalion: formData.battalion,
          code: formData.code,
          jacket_code: formData.jacketCode,
          disability: formData.disability,
        });

        setQrValue(payload);
        toast.success("✅ Soldier registered and QR code generated!");
      } else {
        await axios.post("http://localhost:5000/api/auth/register/admin", {
          email: formData.email,
          password: formData.password,
        });
        toast.success("✅ Admin registered successfully!");
      }

      setFormData({
        name: "",
        rank: "",
        dob: new Date().toISOString().split("T")[0],
        battalion: "",
        code: "",
        jacketCode: "",
        disability: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

    } catch (err: any) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "❌ Registration failed");
      } else {
        toast.error("❌ Something went wrong");
      }
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
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-5xl flex flex-col md:flex-row">
        
        {/* Left Side - Form */}
        <div className="md:w-1/2 pr-4">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
            📝 Register {role === "soldier" ? "Soldier" : "Admin"}
          </h2>

          <div className="flex justify-center mb-4">
            <button
              type="button"
              onClick={() => setRole("soldier")}
              className={`px-4 py-2 rounded-l-xl ${
                role === "soldier" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              Soldier
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`px-4 py-2 rounded-r-xl ${
                role === "admin" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {role === "soldier" && (
                <>
                  <input
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
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
                    <option value="" disabled>Select Rank</option>
                    {rankOptions.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
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
                    <option value="" disabled>Select Battalion</option>
                    {battalionOptions.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                  <input
                    name="code"
                    value={formData.code}
                    placeholder="Soldier Code"
                    onChange={handleChange}
                    className="border border-gray-300 rounded-xl px-4 py-2 w-full"
                    required
                  />
                  <input
                    name="jacketCode"
                    value={formData.jacketCode}
                    placeholder="Jacket Code"
                    onChange={handleChange}
                    className="border border-gray-300 rounded-xl px-4 py-2 w-full"
                    required
                  />
                </>
              )}

              <input
                name="email"
                value={formData.email}
                placeholder="Email"
                type="email"
                onChange={handleChange}
                className="border border-gray-300 rounded-xl px-4 py-2 w-full"
                required
              />
              <div className="relative">
                <input
                  name="password"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-4 py-2 w-full pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2 text-sm text-blue-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="relative">
                <input
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-4 py-2 w-full pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-2 text-sm text-blue-600"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>

              {role === "soldier" && (
                <select
                  name="disability"
                  value={formData.disability}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl px-4 py-2 w-full bg-white"
                >
                  <option value="" disabled>Select Disability (if any)</option>
                  {disabilityOptions.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold"
            >
              Register {role === "soldier" ? "& Generate QR" : ""}
            </button>
          </form>

          {qrValue && (
            <div className="mt-6 flex flex-col items-center" ref={qrRef}>
              <QRCode value={qrValue} size={200} />
              <button
                type="button"
                onClick={handlePrint}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                🖨️ Print QR Code
              </button>
            </div>
          )}
        </div>

        {/* Right Side Info */}
        <div className="md:w-1/2 mt-8 md:mt-0 pl-4 border-t md:border-t-0 md:border-l border-gray-200 bg-blue-50 rounded-xl p-4">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 text-center md:text-left">
            ✨ Why Register?
          </h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Secure identity verification via QR code</li>
            <li>Streamlined tracking of personnel details</li>
            <li>Role-based access for Admin and Soldier</li>
            <li>Enhanced digital records for quick access</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
