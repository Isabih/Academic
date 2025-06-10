import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const role = res.data.role;
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("role", role);

      toast.success("✅ Login successful!");

      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Login failed. Please try again.";
      toast.error(`❌ ${msg}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-5xl flex shadow-lg rounded-2xl overflow-hidden">
        {/* Left Section */}
        <div className="hidden md:flex w-1/2 bg-blue-600 items-center justify-center text-white p-8">
          <div>
            <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-lg">Log in to access your dashboard and manage your operations efficiently.</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 bg-white p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <h2 className="text-3xl font-bold text-center text-gray-800">🔐 Login</h2>

            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex justify-between items-center text-sm text-blue-600">
              <a href="#" className="hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-lg"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
