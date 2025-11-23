import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, MapPin, Loader2, AlertCircle } from "lucide-react";
import { saveCompradorData } from "@/lib/supabase";
import { sendClientConfirmationEmail, sendAdminNotificationEmail } from "@/lib/emailService";

const CENTRO_ZAMORA = { lat: 19.9855, lon: -102.2833 };
const MAX_DISTANCIA_KM = 150;

const CompradorForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ubicacionValida, setUbicacionValida] = useState(null);
  
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    hectareas: "",
    zona: "",
    lat: null,
    lon: null,
    tipo: "nueva",
    comentarios: "",
    // Nuevos campos
    para_cultivo: "",
    cuando_inicia: "",
    tiene_financiamiento: "",
    primera_vez_tuneles: "",
    tuneles_existentes: "",
    prioridad_principal: "",
    presupuesto: "",
    cuando_decide: ""
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const validarUbicacion = (lat, lon) => {
    const distancia = calcularDistancia(lat, lon, CENTRO_ZAMORA.lat, CENTRO_ZAMORA.lon);
    return distancia <= MAX_DISTANCIA_KM;
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Tu navegador no soporta geolocalización");
      return;
    }

    toast.info("Obteniendo tu ubicación...", { duration: 3000 });
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        setFormData(prev => ({ ...prev, lat, lon }));
        
        const esValida = validarUbicacion(lat, lon);
        setUbicacionValida(esValida);
        
        if (esValida) {
          toast.success("✓ Ubicación capturada - Dentro de nuestra zona de servicio");
        } else {
          toast.error("Tu ubicación está fuera de nuestra zona de servicio (Zamora +150km)");
        }
      },
      (error) => {
        let errorMessage = "No se pudo obtener la ubicación.";
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permiso denegado. Por favor activa la ubicación en tu navegador.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Ubicación no disponible. Verifica tu conexión GPS.";
            break;
          case error.TIMEOUT:
            errorMessage = "Tiempo agotado. Intenta de nuevo.";
            break;
          default:
            errorMessage = "Error desconocido. Ingresa tu zona manualmente.";
        }
        
        toast.error(errorMessage);
        console.error("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.email || !formData.telefono || !formData.hectareas || !formData.zona) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    if (!formData.lat || !formData.lon) {
      toast.error("Por favor captura tu ubicación GPS");
      return;
    }

    if (ubicacionValida === false) {
      toast.error("Tu ubicación está fuera de nuestra zona de servicio");
      return;
    }

    setLoading(true);

    try {
      const result = await saveCompradorData(formData);

      if (result.success) {
        // Send emails after successful database save
        console.log('About to send emails for comprador...');
        try {
          const [clientResult, adminResult] = await Promise.all([
            sendClientConfirmationEmail(formData),
            sendAdminNotificationEmail(formData)
          ]);
          console.log('Emails sent successfully for comprador:', { clientResult, adminResult });
        } catch (emailError) {
          console.error('Error sending emails for comprador:', emailError);
          // Don't fail the submission if emails fail
        }

        toast.success("¡Solicitud de compra registrada exitosamente! Te contactaremos muy pronto.");
        setTimeout(() => navigate('/'), 2000);
      } else {
        toast.error(`Error al guardar los datos: ${result.error}`);
      }
    } catch (error) {
      console.error('Error en handleSubmit:', error);
      toast.error("Error inesperado. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button
          data-testid="back-btn"
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 hover:bg-lime-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>

        <Card className="border-2 border-lime-200 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-lime-500 to-green-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl">Comprar Macrotúnel - TunnelConecta</CardTitle>
            <p className="text-lime-100 text-sm">Zona de servicio: Zamora, Michoacán +150km</p>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información Personal */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Información Personal</h3>
                
                <div>
                  <Label htmlFor="nombre">Nombre Completo *</Label>
                  <Input
                    id="nombre"
                    data-testid="nombre-input"
                    value={formData.nombre}
                    onChange={(e) => handleChange("nombre", e.target.value)}
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

              {/* Información del Proyecto */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">¿Qué estás buscando?</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hectareas">Hectáreas Necesarias *</Label>
                    <Input
                      id="hectareas"
                      data-testid="hectareas-input"
                      type="number"
                      step="0.1"
                      value={formData.hectareas}
                      onChange={(e) => handleChange("hectareas", e.target.value)}
                      placeholder="2.5"
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="para_cultivo">¿Para qué cultivo?</Label>
                    <Input
                      id="para_cultivo"
                      value={formData.para_cultivo}
                      onChange={(e) => handleChange("para_cultivo", e.target.value)}
                      placeholder="Fresas, frambuesas..."
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>Tipo de Estructura *</Label>
                  <RadioGroup
                    value={formData.tipo}
                    onValueChange={(value) => handleChange("tipo", value)}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nueva" id="tipo-nueva" data-testid="tipo-nueva" />
                      <Label htmlFor="tipo-nueva" className="cursor-pointer">Nueva</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="usada" id="tipo-usada" data-testid="tipo-usada" />
                      <Label htmlFor="tipo-usada" className="cursor-pointer">Usada</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cualquiera" id="tipo-cualquiera" data-testid="tipo-cualquiera" />
                      <Label htmlFor="tipo-cualquiera" className="cursor-pointer">Cualquiera</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cuando_inicia">¿Cuándo planeas iniciar?</Label>
                    <Select
                      value={formData.cuando_inicia}
                      onValueChange={(value) => handleChange("cuando_inicia", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecciona" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="esta_semana">Esta semana</SelectItem>
                        <SelectItem value="este_mes">Este mes</SelectItem>
                        <SelectItem value="este_trimestre">Este trimestre</SelectItem>
                        <SelectItem value="este_anio">Este año</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="presupuesto">Presupuesto aproximado (MXN)</Label>
                    <Input
                      id="presupuesto"
                      type="number"
                      value={formData.presupuesto}
                      onChange={(e) => handleChange("presupuesto", e.target.value)}
                      placeholder="400000"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Experiencia */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Experiencia con Macrotúneles</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primera_vez_tuneles">¿Es tu primera vez con macrotúneles?</Label>
                    <Select
                      value={formData.primera_vez_tuneles}
                      onValueChange={(value) => handleChange("primera_vez_tuneles", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecciona" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="si">Sí, es mi primera vez</SelectItem>
                        <SelectItem value="no">No, ya tengo experiencia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="tuneles_existentes">¿Cuántas hectáreas de macrotúneles tienes actualmente?</Label>
                    <Input
                      id="tuneles_existentes"
                      type="number"
                      value={formData.tuneles_existentes}
                      onChange={(e) => handleChange("tuneles_existentes", e.target.value)}
                      placeholder="0"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Decisión */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Información de Decisión</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="prioridad_principal">¿Qué es lo más importante para ti?</Label>
                    <Select
                      value={formData.prioridad_principal}
                      onValueChange={(value) => handleChange("prioridad_principal", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecciona" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="precio">Precio</SelectItem>
                        <SelectItem value="calidad">Calidad</SelectItem>
                        <SelectItem value="rapidez">Rapidez</SelectItem>
                        <SelectItem value="garantia">Garantía</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="cuando_decide">¿Cuándo piensas tomar la decisión?</Label>
                    <Select
                      value={formData.cuando_decide}
                      onValueChange={(value) => handleChange("cuando_decide", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecciona" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="esta_semana">Esta semana</SelectItem>
                        <SelectItem value="este_mes">Este mes</SelectItem>
                        <SelectItem value="este_trimestre">Este trimestre</SelectItem>
                        <SelectItem value="sin_prisa">Sin prisa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="tiene_financiamiento">¿Tienes financiamiento?</Label>
                  <Select
                    value={formData.tiene_financiamiento}
                    onValueChange={(value) => handleChange("tiene_financiamiento", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="si">Sí, ya tengo</SelectItem>
                      <SelectItem value="en_proceso">En proceso</SelectItem>
                      <SelectItem value="no">No, pagaré de contado</SelectItem>
                      <SelectItem value="necesito">Necesito financiamiento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Ubicación */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Ubicación del Rancho</h3>
                
                <div>
                  <Label htmlFor="zona">Zona / Municipio *</Label>
                  <Input
                    id="zona"
                    data-testid="zona-input"
                    value={formData.zona}
                    onChange={(e) => handleChange("zona", e.target.value)}
                    placeholder="Zamora, Michoacán"
                    required
                    className="mt-1"
                  />
                </div>

                <Button
                  type="button"
                  data-testid="get-location-btn"
                  variant="outline"
                  onClick={getLocation}
                  className="w-full border-lime-300 hover:bg-lime-50"
                >
                  <MapPin className="mr-2 h-4 w-4" /> Capturar Ubicación GPS *
                </Button>
                
                {formData.lat && formData.lon && (
                  <div className={`p-3 rounded-lg ${
                    ubicacionValida === true ? 'bg-green-50 border border-green-300' :
                    ubicacionValida === false ? 'bg-red-50 border border-red-300' :
                    'bg-gray-50 border border-gray-300'
                  }`}>
                    {ubicacionValida === true && (
                      <p className="text-sm text-green-700 flex items-center">
                        <span className="mr-2">✓</span> Ubicación capturada: {formData.lat.toFixed(4)}, {formData.lon.toFixed(4)}
                        <br />
                        <span className="text-xs">Dentro de nuestra zona de servicio</span>
                      </p>
                    )}
                    {ubicacionValida === false && (
                      <p className="text-sm text-red-700 flex items-start">
                        <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        Tu ubicación está fuera de nuestra zona de servicio (Zamora +150km). Por ahora solo operamos en esta región.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Comentarios */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Comentarios Adicionales</h3>
                
                <div>
                  <Textarea
                    id="comentarios"
                    data-testid="comentarios-input"
                    value={formData.comentarios}
                    onChange={(e) => handleChange("comentarios", e.target.value)}
                    placeholder="Cuéntanos más sobre lo que necesitas..."
                    rows={4}
                    className="mt-1 resize-none"
                  />
                </div>
              </div>

              <Button
                type="submit"
                data-testid="submit-comprador-btn"
                disabled={loading || ubicacionValida === false}
                className="w-full bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...</>
                ) : (
                  "Enviar Solicitud"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompradorForm;