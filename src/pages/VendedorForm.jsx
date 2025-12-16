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
import { ArrowLeft, MapPin, Upload, Loader2, AlertCircle } from "lucide-react";
import { saveVendedorData } from "@/lib/supabase";

const CENTRO_ZAMORA = { lat: 19.9855, lon: -102.2833 };
const MAX_DISTANCIA_KM = 150;

const VendedorForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ubicacionValida, setUbicacionValida] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    hectareas: "",
    fotos_base64: []
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Validación en tiempo real
    if (field === 'telefono') {
      validateTelefono(value);
    }
  };

  const validateTelefono = (telefono) => {
    const telefonoRegex = /^[0-9]{10}$/;
    if (!telefono) {
      setErrors(prev => ({ ...prev, telefono: '' }));
      return;
    }
    if (!telefonoRegex.test(telefono)) {
      setErrors(prev => ({ ...prev, telefono: 'El teléfono debe tener exactamente 10 dígitos' }));
    } else {
      setErrors(prev => ({ ...prev, telefono: '' }));
    }
  };

  const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en km
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

  const getLocation = async () => {
    console.log("Intentando obtener ubicación...");

    if (!navigator.geolocation) {
      toast.error("Tu navegador no soporta geolocalización");
      console.error("Geolocation not supported");
      return;
    }

    // Check if we're on HTTPS or localhost
    const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    if (!isSecure) {
      toast.error("La geolocalización requiere HTTPS. Usa localhost o un sitio seguro.");
      console.error("Geolocation requires HTTPS");
      return;
    }

    setLocationLoading(true);
    toast.info("Obteniendo tu ubicación...", { duration: 5000 });

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 60000
          }
        );
      });

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      console.log("Ubicación obtenida:", { lat, lon });

      setFormData(prev => ({ ...prev, lat, lon }));

      const esValida = validarUbicacion(lat, lon);
      setUbicacionValida(esValida);

      if (esValida) {
        toast.success(`✓ Ubicación capturada: ${lat.toFixed(4)}, ${lon.toFixed(4)} - Dentro de zona de servicio`);
      } else {
        const distancia = calcularDistancia(lat, lon, CENTRO_ZAMORA.lat, CENTRO_ZAMORA.lon);
        toast.error(`Tu ubicación está a ${distancia.toFixed(1)}km de Zamora. Fuera de zona de servicio (+150km)`);
      }
    } catch (error) {
      console.error("Geolocation error:", error);

      let errorMessage = "No se pudo obtener la ubicación.";

      switch(error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Permiso denegado. Activa la ubicación en configuración del navegador y recarga la página.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Ubicación no disponible. Verifica GPS/conexión e intenta de nuevo.";
          break;
        case error.TIMEOUT:
          errorMessage = "Tiempo agotado obteniendo ubicación. Verifica señal GPS.";
          break;
        default:
          errorMessage = `Error de geolocalización: ${error.message || 'Desconocido'}`;
      }

      toast.error(errorMessage, { duration: 8000 });
    } finally {
      setLocationLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      toast.error("Máximo 3 fotos permitidas");
      return;
    }

    Promise.all(
      files.map(file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    ).then(base64Files => {
      setFormData(prev => ({ ...prev, fotos_base64: base64Files }));
      toast.success(`${files.length} foto(s) cargada(s)`);
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.email || !formData.telefono || !formData.hectareas) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    setLoading(true);

    try {
      const result = await saveVendedorData(formData);

      if (result.success) {
        // Enviar emails después de guardar exitosamente
        try {
          const emailResponse = await fetch('/api/send-vendedor-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });

          if (!emailResponse.ok) {
            console.error('Error sending emails:', await emailResponse.text());
            // No mostrar error al usuario, ya que los datos se guardaron correctamente
          }
        } catch (emailError) {
          console.error('Error calling email API:', emailError);
          // No mostrar error al usuario
        }

        // Create lead in Zoho CRM via API
        console.log('About to create Zoho lead for vendedor...');
        try {
          const zohoResponse = await fetch('/api/create-zoho-lead', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ leadData: formData, tipoLead: 'vendedor' })
          });
          const zohoResult = await zohoResponse.json();
          if (zohoResponse.ok) {
            console.log('Zoho lead created successfully for vendedor:', zohoResult);
          } else {
            console.error('Error creating Zoho lead for vendedor:', zohoResult);
          }
        } catch (zohoError) {
          console.error('Error calling Zoho API for vendedor:', zohoError);
          // Don't fail the submission if Zoho fails
        }

        toast.success("¡Registro enviado exitosamente! Nuestro equipo evaluará tu macrotúnel.");
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button
          data-testid="back-btn"
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 hover:bg-emerald-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>

        <Card className="border-2 border-emerald-200 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl">Vender mi Macrotúnel - TúnelUSA<span className="text-emerald-600">2</span></CardTitle>
            <p className="text-emerald-100 text-sm">Zona de servicio: Zamora, Michoacán +150km</p>
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

              {/* Información del Macrotúnel */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="hectareas">¿Número de ha a vender? *</Label>
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
              </div>

              {/* Fotos */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Fotos</h3>
                <p className="text-sm text-gray-600">Sube fotos de tu macrotúnel (máx 3)</p>

                <div className="border-2 border-dashed border-emerald-300 rounded-lg p-6 text-center hover:bg-emerald-50 transition-colors cursor-pointer">
                  <input
                    type="file"
                    id="fotos"
                    data-testid="fotos-input"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="fotos" className="cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-emerald-600 mb-2" />
                    <p className="text-sm text-gray-600">Click para subir fotos</p>
                  </label>
                </div>
                {formData.fotos_base64.length > 0 && (
                  <p className="text-sm text-green-600" data-testid="fotos-uploaded">
                    ✓ {formData.fotos_base64.length} foto(s) cargada(s)
                  </p>
                )}
              </div>

              <Button
                type="submit"
                data-testid="submit-vendedor-btn"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...</>
                ) : (
                  "Enviar Información"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendedorForm;