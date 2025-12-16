import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { saveCompradorData } from "@/lib/supabase";
import { sendClientConfirmationEmail, sendAdminNotificationEmail } from "@/lib/emailService";

const CompradorForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    hectareas: "",
    comentarios: ""
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Only allow numbers
    const numericValue = value.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, telefono: numericValue }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.email || !formData.telefono || !formData.hectareas) {
      toast.error("Por favor completa todos los campos obligatorios");
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

        // Create lead in Zoho CRM via API
        console.log('About to create Zoho lead for comprador...');
        try {
          const zohoResponse = await fetch('/api/create-zoho-lead', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ leadData: formData, tipoLead: 'comprador' })
          });
          const zohoResult = await zohoResponse.json();
          if (zohoResponse.ok) {
            console.log('Zoho lead created successfully for comprador:', zohoResult);
          } else {
            console.error('Error creating Zoho lead for comprador:', zohoResult);
          }
        } catch (zohoError) {
          console.error('Error calling Zoho API for comprador:', zohoError);
          // Don't fail the submission if Zoho fails
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
            <CardTitle className="text-2xl">Comprar Macrotúnel - TúnelUSA<span className="text-emerald-600">2</span></CardTitle>
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
                      onChange={handlePhoneChange}
                      placeholder="3312345678"
                      required
                      className="mt-1"
                      type="tel"
                    />
                  </div>
                </div>
              </div>

              {/* Información del Proyecto */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="hectareas">¿Cuántas Ha necesitas? *</Label>
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

              {/* Comentarios */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="comentarios">Comentarios adicionales</Label>
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
                disabled={loading}
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