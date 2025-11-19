import { useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import VendedorForm from "@/pages/VendedorForm";
import CompradorForm from "@/pages/CompradorForm";
import Certificacion from "@/pages/Certificacion";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="App">
      <Toaster position="top-center" richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vender" element={<VendedorForm />} />
          <Route path="/comprar" element={<CompradorForm />} />
          <Route path="/certificacion" element={<Certificacion />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;