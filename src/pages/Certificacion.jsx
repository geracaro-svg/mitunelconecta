import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ArrowLeft, Shield, CheckCircle, Camera, FileText, Loader2, CreditCard, Lock } from "lucide-react";
import { saveCertificationData } from "@/lib/supabase";

const Certificacion = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [accepted, setAccepted] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre_vendedor: "",
    telefono: "",
    email: "",
    ubicacion: "",
    hectareas: "",
    fecha_inspeccion: "",
    observaciones: ""
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    if (!formData.nombre_vendedor || !formData.telefono || !formData.email || !formData.ubicacion) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }
    if (!accepted) {
      toast.error("Debes aceptar los términos y condiciones");
      return;
    }
    setShowPayment(true);
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Guardar datos en Supabase
      const result = await saveCertificationData(formData);

      if (result.success) {
        toast.success("¡Pago simulado exitoso! En producción se integrará la pasarela real.");
        await new Promise((resolve) => setTimeout(resolve, 1200));
        toast.success("Solicitud de certificación registrada. Te contactaremos para coordinar la inspección.");
        setTimeout(() => navigate('/'), 2000);
      } else {
        toast.error(`Error al guardar la solicitud: ${result.error}`);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error en handlePayment:', error);
      toast.error("Error al procesar la solicitud. Inténtalo de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button
          data-testid="back-btn"
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 hover:bg-amber-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-amber-100 rounded-2xl mb-4">
            <Shield className="w-16 h-16 text-amber-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Certificación TunnelConecta Gold</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Certifica tu macrotúnel y aumenta su valor hasta un 15%. Genera confianza total en los compradores.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-10 h-10 text-amber-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Inspección Técnica</h3>
              <p className="text-sm text-gray-600">Evaluación completa por expertos</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
            <CardContent className="p-6 text-center">
              <FileText className="w-10 h-10 text-amber-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Reporte Detallado</h3>
              <p className="text-sm text-gray-600">Fotos, medidas y estado</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
            <CardContent className="p-6 text-center">
              <Camera className="w-10 h-10 text-amber-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Certificado Digital</h3>
              <p className="text-sm text-gray-600">Con QR verificable</p>
            </CardContent>
          </Card>
        </div>

        {/* Form or Payment */}
        {!showPayment ? (
          <Card className="border-2 border-amber-200 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl">Solicitar Certificación</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
            <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 mb-6">
              <p className="text-amber-900 font-semibold mb-2">💰 Inversión: $5,000 MXN</p>
              <p className="text-sm text-amber-800">• Aumenta el valor de tu macrotúnel 10-15%</p>
              <p className="text-sm text-amber-800">• Vende más rápido con certificación</p>
              <p className="text-sm text-amber-800">• Badge "Certificado" en tu listado</p>
              <p className="text-xs text-amber-700 mt-2">💡 Incluido GRATIS en membresía Gold</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Información del Vendedor</h3>
                
                <div>
                  <Label htmlFor="nombre_vendedor">Nombre Completo *</Label>
                  <Input
                    id="nombre_vendedor"
                    data-testid="nombre-input"
                    value={formData.nombre_vendedor}
                    onChange={(e) => handleChange("nombre_vendedor", e.target.value)}
                    placeholder="Juan Pérez"
                    required
                    className="mt-1"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Correo Electrónico *</Label>
                    <Input
                      id="email"
                      data-testid="email-input"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="tu@email.com"
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="telefono">Teléfono *</Label>
                    <Input
                      id="telefono"
                      data-testid="telefono-input"
                      value={formData.telefono}
                      onChange={(e) => handleChange("telefono", e.target.value)}
                      placeholder="3312345678"
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Información del Macrotúnel</h3>
                
                <div>
                  <Label htmlFor="ubicacion">Ubicación *</Label>
                  <Input
                    id="ubicacion"
                    data-testid="ubicacion-input"
                    value={formData.ubicacion}
                    onChange={(e) => handleChange("ubicacion", e.target.value)}
                    placeholder="Zamora, Michoacán"
                    required
                    className="mt-1"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hectareas">Hectáreas</Label>
                    <Input
                      id="hectareas"
                      data-testid="hectareas-input"
                      type="number"
                      step="0.1"
                      value={formData.hectareas}
                      onChange={(e) => handleChange("hectareas", e.target.value)}
                      placeholder="2.5"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="fecha_inspeccion">Fecha Preferida para Inspección</Label>
                    <Input
                      id="fecha_inspeccion"
                      data-testid="fecha-input"
                      type="date"
                      value={formData.fecha_inspeccion}
                      onChange={(e) => handleChange("fecha_inspeccion", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="observaciones">Observaciones / Notas Adicionales</Label>
                  <Textarea
                    id="observaciones"
                    data-testid="observaciones-input"
                    value={formData.observaciones}
                    onChange={(e) => handleChange("observaciones", e.target.value)}
                    placeholder="Información adicional que quieras compartir..."
                    rows={4}
                    className="mt-1 resize-none"
                  />
                </div>
              </div>

              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">✅ Próximos Pasos</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-green-800">
                  <li>Envía tu solicitud</li>
                  <li>Nuestro equipo te contactará en 24 horas</li>
                  <li>Agendamos la inspección técnica</li>
                  <li>Recibes tu certificado digital en 48 horas</li>
                </ol>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="terms"
                  checked={accepted}
                  onCheckedChange={setAccepted}
                />
                <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                  Acepto los <span className="text-amber-600 underline">términos y condiciones</span> del servicio de certificación
                </label>
              </div>

              <Button
                type="button"
                data-testid="submit-certificacion-btn"
                disabled={loading}
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</>
                ) : (
                  "Continuar al Pago - $5,000 MXN"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
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
                      value=""
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
                      value=""
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      className="mt-1"
                      disabled
                      value=""
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
                    value=""
                  />
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Certificación TunnelConecta</span>
                  <span className="font-semibold">$5,000.00 MXN</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">IVA (16%)</span>
                  <span>$800.00 MXN</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-amber-600">$5,800.00 MXN</span>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-6 rounded-xl shadow-lg text-lg"
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</>
                ) : (
                  "Pagar $5,800 MXN (SIMULADO)"
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Al hacer clic en "Pagar", aceptas los términos del servicio de certificación TunnelConecta
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Certificacion;