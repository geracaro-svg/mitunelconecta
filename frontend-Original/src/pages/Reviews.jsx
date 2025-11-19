import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, ArrowLeft, TrendingUp } from "lucide-react";
import { MOCK_REVIEWS } from "@/data/mockData";

const Reviews = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const computeStats = (data) => {
    if (!data.length) {
      return {
        total_transacciones: 0,
        rating_promedio: 0,
        satisfaccion: 0,
        recomendarian: 0
      };
    }

    const ratingProm = data.reduce((acc, r) => acc + (r.rating || 0), 0) / data.length;
    const verified = data.filter((r) => r.verificado).length;

    return {
      total_transacciones: data.length,
      rating_promedio: Number(ratingProm.toFixed(1)),
      satisfaccion: Math.min(100, Math.round((verified / data.length) * 100)),
      recomendarian: 95
    };
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setReviews(MOCK_REVIEWS);
      setStats(computeStats(MOCK_REVIEWS));
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 hover:bg-blue-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-blue-100 rounded-2xl mb-4">
            <Star className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Reviews y Reputación</h1>
          <p className="text-lg text-gray-600">
            Lo que nuestros clientes dicen sobre sus transacciones
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <p className="text-4xl font-bold text-blue-600">{stats.total_transacciones || 0}</p>
                <p className="text-sm text-gray-600 mt-1">Transacciones</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-1">
                  <p className="text-4xl font-bold text-yellow-600">{stats.rating_promedio || 0}</p>
                  <Star className="w-8 h-8 fill-yellow-400 text-yellow-400 ml-2" />
                </div>
                <p className="text-sm text-gray-600">Calificación Promedio</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <p className="text-4xl font-bold text-green-600">{stats.satisfaccion || 0}%</p>
                <p className="text-sm text-gray-600 mt-1">Satisfacción</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <p className="text-4xl font-bold text-purple-600">{stats.recomendarian || 0}%</p>
                <p className="text-sm text-gray-600 mt-1">Recomendarían</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Gold Required Message */}
        <Card className="bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-400 mb-8">
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl mb-4">
              <Star className="w-8 h-8 text-white fill-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Contenido Exclusivo Gold</h3>
            <p className="text-gray-700 mb-4">
              Accede a reviews completas, estadísticas detalladas y calificaciones verificadas de todas las transacciones.
            </p>
            <p className="text-amber-900 font-semibold mb-6">
              Solo disponible para miembros Gold
            </p>
            <Button
              onClick={() => navigate('/gold')}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold px-8 py-4"
            >
              Vuélvete Gold - $10,000/año
            </Button>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Cargando reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Vista Previa</h3>
                <p className="text-gray-600">
                  Aquí verás reviews verificadas de transacciones reales.
                  <br />Hazte Gold para acceso completo.
                </p>
              </CardContent>
            </Card>
          ) : (
            reviews.map((review, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-blue-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{review.nombre_cliente}</h3>
                      <p className="text-sm text-gray-500">{review.tipo_transaccion} • {review.ubicacion}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{review.comentario}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{review.hectareas} hectáreas</span>
                    <span>{new Date(review.fecha).toLocaleDateString('es-MX')}</span>
                  </div>
                  
                  {review.verificado && (
                    <div className="mt-3 inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      ✓ Transacción Verificada
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;