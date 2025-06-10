// pages/_app.tsx
import "leaflet/dist/leaflet.css";
import "../styles/globals.css";
import "../styles/MapIcon.css"; // Adjust if not used
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'leaflet/dist/leaflet.css'
import '../styles/globals.css'


export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
      <ToastContainer position="top-right" />
    </Layout>
  );
}
