import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sprout, ShoppingCart, TrendingUp, Shield } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-2xl mb-4">
            <Sprout className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
            TunnelConecta
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Marketplace de macrotúneles agrícolas en Zamora y región
          </p>
          <p className="text-sm text-emerald-700 font-semibold">
            📍 Servicio disponible en Zamora, Michoacán y 150km a la redonda
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <Card 
            data-testid="vender-card"
            className="group hover:shadow-2xl transition-all duration-300 border-2 border-emerald-200 hover:border-emerald-400 cursor-pointer bg-white/80 backdrop-blur-sm"
            onClick={() => navigate('/vender')}
          >
            <CardContent className="p-8 space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Quiero Vender</h2>
              <p className="text-gray-600">
                ¿Tienes un macrotúnel que ya no usas? Regístralo y conecta con compradores interesados en la región.
              </p>
              <Button 
                data-testid="vender-btn"
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                onClick={() => navigate('/vender')}
              >
                Registrar mi Macrotúnel
              </Button>
            </CardContent>
          </Card>

          <Card 
            data-testid="comprar-card"
            className="group hover:shadow-2xl transition-all duration-300 border-2 border-lime-200 hover:border-lime-400 cursor-pointer bg-white/80 backdrop-blur-sm"
            onClick={() => navigate('/comprar')}
          >
            <CardContent className="p-8 space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-lime-400 to-green-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Quiero Comprar</h2>
              <p className="text-gray-600">
                Encuentra el macrotúnel perfecto para tu proyecto. Conectamos con los mejores vendedores de la región.
              </p>
              <Button 
                data-testid="comprar-btn"
                className="w-full bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                onClick={() => navigate('/comprar')}
              >
                Buscar Macrotúnel
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <button 
            onClick={() => navigate('/certificacion')}
            className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-emerald-100 hover:bg-white hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-4">
              <Shield className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Certificación</h3>
            <p className="text-sm text-gray-600">Certifica tu estructura y genera confianza</p>
          </button>
          
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-emerald-100">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-4">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Rápido</h3>
            <p className="text-sm text-gray-600">Respuesta en menos de 24 horas</p>
          </div>
          
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-emerald-100">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-4">
              <Sprout className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Confiable</h3>
            <p className="text-sm text-gray-600">Verificamos toda la información</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;