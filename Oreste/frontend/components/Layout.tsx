import React from 'react'
import Link from 'next/link'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-900 text-white p-4 flex justify-between">
        <h1 className="text-xl font-bold">Bulletproof Monitoring</h1>
        <div className="space-x-4">
          <Link href="/">Home</Link>
          <Link href="/register">Register</Link>
          <Link href="/admin">Admin</Link>
          <Link href="/map">Map</Link>
        </div>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  )
}

export default Layout