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
    anios_uso: "",
    plastico: "no",
    plastico_edad: "",
    ubicacion_texto: "",
    lat: null,
    lon: null,
    fotos_base64: [],
    // Nuevos campos
    proveedor_original: "",
    precio_compra_original: "",
    cultivos_sembrados: "",
    motivo_venta: "",
    expectativa_precio: "",
    factura_file: null
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

  const handleFacturaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("El archivo es muy grande. Máximo 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, factura_file: e.target.result }));
        toast.success("Factura cargada correctamente");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar teléfono antes de enviar
    const telefonoRegex = /^[0-9]{10}$/;
    if (!telefonoRegex.test(formData.telefono)) {
      toast.error("El teléfono debe tener exactamente 10 dígitos");
      return;
    }

    if (!formData.nombre || !formData.email || !formData.telefono || !formData.hectareas || !formData.anios_uso || !formData.ubicacion_texto) {
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

    if (!formData.motivo_venta) {
      toast.error("Por favor indica por qué estás vendiendo");
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
            <CardTitle className="text-2xl">Vender mi Macrotúnel - TunnelConecta</CardTitle>
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
                      className={`mt-1 ${errors.telefono ? 'border-red-500' : ''}`}
                    />
                    {errors.telefono && (
                      <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Información del Macrotúnel */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Información del Macrotúnel</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hectareas">Hectáreas *</Label>
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
                    <Label htmlFor="anios_uso">Años de Uso *</Label>
                    <Input
                      id="anios_uso"
                      data-testid="anios-uso-input"
                      type="number"
                      value={formData.anios_uso}
                      onChange={(e) => handleChange("anios_uso", e.target.value)}
                      placeholder="2"
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>¿Incluye plástico? *</Label>
                    <RadioGroup
                      value={formData.plastico}
                      onValueChange={(value) => handleChange("plastico", value)}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sí" id="plastico-si" data-testid="plastico-si" />
                        <Label htmlFor="plastico-si" className="cursor-pointer">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="plastico-no" data-testid="plastico-no" />
                        <Label htmlFor="plastico-no" className="cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.plastico === "sí" && (
                    <div>
                      <Label htmlFor="plastico_edad">Antigüedad del Plástico (años)</Label>
                      <Input
                        id="plastico_edad"
                        data-testid="plastico-edad-input"
                        type="number"
                        value={formData.plastico_edad}
                        onChange={(e) => handleChange("plastico_edad", e.target.value)}
                        placeholder="1"
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="cultivos_sembrados">Cultivos que se han sembrado</Label>
                  <Input
                    id="cultivos_sembrados"
                    value={formData.cultivos_sembrados}
                    onChange={(e) => handleChange("cultivos_sembrados", e.target.value)}
                    placeholder="Ej: Fresas, frambuesas"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Historial de Compra */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Historial de Compra (Opcional)</h3>
                
                <div>
                  <Label htmlFor="precio_compra_original">¿En cuánto lo compraste? (MXN)</Label>
                  <Input
                    id="precio_compra_original"
                    type="number"
                    value={formData.precio_compra_original}
                    onChange={(e) => handleChange("precio_compra_original", e.target.value)}
                    placeholder="450000"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="proveedor_original">¿A quién se lo compraste? (Fabricante/Vendedor)</Label>
                  <Input
                    id="proveedor_original"
                    value={formData.proveedor_original}
                    onChange={(e) => handleChange("proveedor_original", e.target.value)}
                    placeholder="Nombre del fabricante o vendedor"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="factura">Factura Original (Opcional - PDF, máx 5MB)</Label>
                  <input
                    type="file"
                    id="factura"
                    accept="application/pdf,image/*"
                    onChange={handleFacturaChange}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                  />
                  {formData.factura_file && (
                    <p className="text-sm text-green-600 mt-1">✓ Factura cargada</p>
                  )}
                </div>
              </div>

              {/* Motivación de Venta */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Información de Venta</h3>
                
                <div>
                  <Label htmlFor="motivo_venta">¿Por qué estás vendiendo? *</Label>
                  <Textarea
                    id="motivo_venta"
                    value={formData.motivo_venta}
                    onChange={(e) => handleChange("motivo_venta", e.target.value)}
                    placeholder="Ej: Cambio de cultivo, retiro del negocio, necesito liquidez..."
                    rows={3}
                    required
                    className="mt-1 resize-none"
                  />
                </div>

                <div>
                  <Label htmlFor="expectativa_precio">¿Cuál es tu expectativa de precio? (MXN)</Label>
                  <Input
                    id="expectativa_precio"
                    type="number"
                    value={formData.expectativa_precio}
                    onChange={(e) => handleChange("expectativa_precio", e.target.value)}
                    placeholder="400000"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Ubicación */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Ubicación del Rancho</h3>
                
                <div>
                  <Label htmlFor="ubicacion_texto">Zona / Municipio *</Label>
                  <Input
                    id="ubicacion_texto"
                    data-testid="ubicacion-input"
                    value={formData.ubicacion_texto}
                    onChange={(e) => handleChange("ubicacion_texto", e.target.value)}
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
                  disabled={locationLoading}
                  className="w-full border-emerald-300 hover:bg-emerald-50 disabled:opacity-50"
                >
                  {locationLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Obteniendo ubicación...
                    </>
                  ) : (
                    <>
                      <MapPin className="mr-2 h-4 w-4" /> Capturar Ubicación GPS *
                    </>
                  )}
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

              {/* Fotos */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Fotos (máx 3)</h3>
                <p className="text-sm text-gray-600">Panorámica, arcos y plástico</p>
                
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
                disabled={loading || ubicacionValida === false}
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