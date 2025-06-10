// pages/index.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Topbar */}
      <header className="bg-blue-900 text-white py-6 px-6 text-center text-2xl font-bold shadow-md">
        🛡️  Bulletproof Soldier Monitoring System
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-6xl">
          {/* Left Side - Button Grid */}
          <div className="bg-blue-800 text-white w-full md:w-1/2 p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">🔗 Quick Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/register" className="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-xl text-center">
                Register Soldier
              </Link>
              <Link href="/login" className="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-xl text-center">
                Login
              </Link>
              <Link href="/admin" className="bg-green-600 hover:bg-green-700 py-2 px-4 rounded-xl text-center">
                Admin Dashboard
              </Link>
              <Link href="/map" className="bg-purple-600 hover:bg-purple-700 py-2 px-4 rounded-xl text-center">
                Search Location
              </Link>
              <Link href="/alert/1" className="bg-red-600 hover:bg-red-700 py-2 px-4 rounded-xl text-center">
                View Alert & Map
              </Link>
              <Link href="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 py-2 px-4 rounded-xl text-center">
                Real-time Dashboard
              </Link>
            </div>
          </div>

          {/* Right Side - Description */}
          <div className="w-full md:w-1/2 p-10 text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">🎖️ Bulletproof Soldier Monitoring</h1>
            <p className="text-lg text-gray-600 mb-4">
              Welcome to the cutting-edge system for monitoring soldier health, safety, and positioning in real-time.
              With live location tracking, alert management, and smart dashboards, we ensure our heroes are always protected.
            </p>
            <p className="text-gray-600">
              Use the navigation on the left to register new soldiers, manage accounts, track movements,
              and respond instantly to any critical alerts.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 text-center text-sm">
        © {new Date().getFullYear()} Orest. All rights reserved.
      </footer>
    </div>
  );
}
