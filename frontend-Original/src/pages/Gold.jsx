import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, TrendingUp, ShoppingCart, Shield, DollarSign, Clock, Award, Zap } from "lucide-react";

const Gold = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl mb-4 shadow-2xl">
            <Crown className="w-20 h-20 text-white" />
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight">
            TunnelConecta <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Gold</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Accede a beneficios exclusivos, liquidez inmediata y control total del mercado
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          {/* Vendedor Gold */}
          <Card 
            className="group relative overflow-hidden border-4 border-amber-400 hover:border-amber-500 transition-all duration-300 hover:shadow-2xl cursor-pointer bg-white"
            onClick={() => navigate('/gold/vendedor')}
          >
            <div className="absolute top-0 right-0 bg-gradient-to-br from-amber-400 to-orange-500 text-white px-6 py-2 text-sm font-bold rounded-bl-2xl">
              POPULAR
            </div>
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Vendedor Gold</h2>
                  <p className="text-gray-600">Vende más rápido y mejor</p>
                </div>
              </div>

              <div className="py-6 border-y border-amber-200">
                <p className="text-5xl font-bold text-gray-900">$10,000</p>
                <p className="text-gray-600 mt-1">MXN / año</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Zap className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700"><strong>Liquidez inmediata:</strong> TunnelConecta compra tu estructura en 48 horas</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700"><strong>Certificación incluida:</strong> Valoración $800 MXN gratis</p>
                </div>
                <div className="flex items-start space-x-3">
                  <DollarSign className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700"><strong>Precio premium:</strong> 5-10% más que mercado regular</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Award className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700"><strong>Badge Gold:</strong> Prioridad en búsquedas</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700"><strong>Acceso al ITP:</strong> Datos exclusivos del mercado</p>
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all text-lg"
                onClick={() => navigate('/gold/vendedor')}
              >
                Ver Beneficios Completos
              </Button>
            </CardContent>
          </Card>

          {/* Comprador Gold */}
          <Card 
            className="group relative overflow-hidden border-4 border-blue-400 hover:border-blue-500 transition-all duration-300 hover:shadow-2xl cursor-pointer bg-white"
            onClick={() => navigate('/gold/comprador')}
          >
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShoppingCart className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Comprador Gold</h2>
                  <p className="text-gray-600">Compra con confianza</p>
                </div>
              </div>

              <div className="py-6 border-y border-blue-200">
                <p className="text-5xl font-bold text-gray-900">$10,000</p>
                <p className="text-gray-600 mt-1">MXN / año</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Award className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700"><strong>Inventario exclusivo:</strong> Acceso a estructuras certificadas Gold</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700"><strong>Garantía 12 meses:</strong> Cobertura total TunnelConecta</p>
                </div>
                <div className="flex items-start space-x-3">
                  <DollarSign className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700"><strong>Financiamiento preferencial:</strong> Hasta 70% financiado</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700"><strong>Acceso al ITP:</strong> Datos exclusivos del mercado</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Zap className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700"><strong>Soporte prioritario:</strong> Asesoría especializada</p>
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all text-lg"
                onClick={() => navigate('/gold/comprador')}
              >
                Ver Beneficios Completos
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Comparison Table */}
        <div className="max-w-5xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Comparación: Regular vs Gold</h2>
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-4 px-4 text-gray-900">Beneficio</th>
                      <th className="text-center py-4 px-4 text-gray-600">Regular (Gratis)</th>
                      <th className="text-center py-4 px-4 text-amber-600">Gold ($10k/año)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-4 px-4 font-medium">Listar en marketplace</td>
                      <td className="text-center py-4 px-4">✅</td>
                      <td className="text-center py-4 px-4">✅</td>
                    </tr>
                    <tr className="bg-amber-50">
                      <td className="py-4 px-4 font-medium">Venta inmediata (48h)</td>
                      <td className="text-center py-4 px-4">❌</td>
                      <td className="text-center py-4 px-4">✅</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-medium">Certificación incluida</td>
                      <td className="text-center py-4 px-4">❌ ($800)</td>
                      <td className="text-center py-4 px-4">✅ Gratis</td>
                    </tr>
                    <tr className="bg-amber-50">
                      <td className="py-4 px-4 font-medium">Precio premium</td>
                      <td className="text-center py-4 px-4">Mercado</td>
                      <td className="text-center py-4 px-4">+5-10%</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-medium">Acceso al ITP</td>
                      <td className="text-center py-4 px-4">❌</td>
                      <td className="text-center py-4 px-4">✅ Total</td>
                    </tr>
                    <tr className="bg-amber-50">
                      <td className="py-4 px-4 font-medium">Ver reviews completas</td>
                      <td className="text-center py-4 px-4">Limitado</td>
                      <td className="text-center py-4 px-4">✅ Total</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-medium">Garantía</td>
                      <td className="text-center py-4 px-4">❌</td>
                      <td className="text-center py-4 px-4">✅ 12 meses</td>
                    </tr>
                    <tr className="bg-amber-50">
                      <td className="py-4 px-4 font-medium">Financiamiento</td>
                      <td className="text-center py-4 px-4">Regular</td>
                      <td className="text-center py-4 px-4">✅ Preferencial</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Final */}
        <div className="text-center">
          <p className="text-gray-600 mb-6">¿Listo para llevar tu negocio al siguiente nivel?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-6 px-12 rounded-xl shadow-lg hover:shadow-xl transition-all text-lg"
              onClick={() => navigate('/gold/vendedor')}
            >
              Soy Vendedor
            </Button>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-6 px-12 rounded-xl shadow-lg hover:shadow-xl transition-all text-lg"
              onClick={() => navigate('/gold/comprador')}
            >
              Soy Comprador
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gold;