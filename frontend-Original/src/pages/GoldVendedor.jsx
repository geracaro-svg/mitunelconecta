import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Crown, Check, CreditCard, Lock } from "lucide-react";
import { toast } from "sonner";

const GoldVendedor = () => {
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false);
  const [accepted, setAccepted] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    empresa: ""
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    if (!formData.nombre || !formData.email || !formData.telefono) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    if (!accepted) {
      toast.error("Debes aceptar los términos y condiciones");
      return;
    }
    setShowPayment(true);
  };

  const handlePayment = () => {
    toast.success("¡Pago simulado exitoso! En producción se integrará la pasarela real.");
    setTimeout(() => {
      toast.info("Redirigiendo al dashboard Gold...");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/gold')}
          className="mb-6 hover:bg-amber-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>

        {!showPayment ? (
          <>
            {/* Benefits Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl mb-4 shadow-xl">
                <Crown className="w-16 h-16 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Vendedor Gold</h1>
              <p className="text-xl text-gray-600">Vende tu macrotúnel en 48 horas con garantía de pago</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Benefits */}
              <Card className="bg-white/90 backdrop-blur-sm border-2 border-amber-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-amber-700">Beneficios Incluidos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Check className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Liquidez Inmediata</p>
                      <p className="text-sm text-gray-600">TunnelConecta compra tu estructura directamente. Pago en 48 horas vía transferencia bancaria.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Check className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Certificación Gratis</p>
                      <p className="text-sm text-gray-600">Inspección técnica completa ($800 MXN de valor) incluida en tu membresía.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Check className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Precio Premium</p>
                      <p className="text-sm text-gray-600">Pagamos 5-10% más que el mercado regular. Sin regateos ni comisiones ocultas.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Check className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Acceso Total al ITP</p>
                      <p className="text-sm text-gray-600">Índice TunnelConecta de Precios completo. Conoce tendencias y precios por región.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Check className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Badge Gold</p>
                      <p className="text-sm text-gray-600">Aparece primero en búsquedas. Mayor visibilidad y confianza.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Check className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Dashboard Exclusivo</p>
                      <p className="text-sm text-gray-600">Panel de control con métricas, historial y herramientas avanzadas.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Form */}
              <Card className="bg-white/90 backdrop-blur-sm border-2 border-amber-200">
                <CardHeader>
                  <CardTitle className="text-2xl">Información de Registro</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="nombre">Nombre Completo *</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => handleChange("nombre", e.target.value)}
                      placeholder="Juan Pérez"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Correo Electrónico *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="tu@email.com"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="telefono">Teléfono *</Label>
                    <Input
                      id="telefono"
                      value={formData.telefono}
                      onChange={(e) => handleChange("telefono", e.target.value)}
                      placeholder="3312345678"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="empresa">Empresa (opcional)</Label>
                    <Input
                      id="empresa"
                      value={formData.empresa}
                      onChange={(e) => handleChange("empresa", e.target.value)}
                      placeholder="Mi Agronegocio"
                      className="mt-1"
                    />
                  </div>

                  <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4">
                    <p className="text-2xl font-bold text-amber-900 mb-1">$10,000 MXN</p>
                    <p className="text-sm text-amber-800">Membresía anual • Renovación automática</p>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="terms"
                      checked={accepted}
                      onCheckedChange={setAccepted}
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                      Acepto los <span className="text-amber-600 underline">términos y condiciones</span> de TunnelConecta Gold
                    </label>
                  </div>

                  <Button
                    onClick={handleContinue}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-6 rounded-xl shadow-lg"
                  >
                    Continuar al Pago
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          /* Payment Section (Simulated) */
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-amber-200 max-w-2xl mx-auto">
            <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl flex items-center">
                <Lock className="w-6 h-6 mr-2" />
                Pago Seguro
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mb-6">
                <p className="text-blue-900 font-semibold">🔒 Conexión segura - Simulación de pago</p>
                <p className="text-sm text-blue-800 mt-1">En producción se integrará Stripe/Mercado Pago</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="card-number">Número de Tarjeta</Label>
                  <div className="relative">
                    <Input
                      id="card-number"
                      placeholder="4242 4242 4242 4242"
                      className="mt-1 pl-10"
                      disabled
                    />
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Vencimiento</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/AA"
                      className="mt-1"
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      className="mt-1"
                      disabled
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="name">Nombre en la Tarjeta</Label>
                  <Input
                    id="name"
                    placeholder="JUAN PEREZ"
                    className="mt-1"
                    disabled
                  />
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Membresía Gold (Anual)</span>
                  <span className="font-semibold">$10,000.00 MXN</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">IVA (16%)</span>
                  <span>$1,600.00 MXN</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-amber-600">$11,600.00 MXN</span>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-6 rounded-xl shadow-lg text-lg"
              >
                Pagar $11,600 MXN (SIMULADO)
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Al hacer clic en "Pagar", aceptas los términos del servicio y la política de privacidad de TunnelConecta
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GoldVendedor;