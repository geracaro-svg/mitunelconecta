import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react";
import { MOCK_ITP } from "@/data/mockData";

const IndicePrecios = () => {
  const navigate = useNavigate();
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDatos(MOCK_ITP);
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const getTrendIcon = (tendencia) => {
    if (tendencia > 0) return <TrendingUp className="w-5 h-5 text-green-600" />;
    if (tendencia < 0) return <TrendingDown className="w-5 h-5 text-red-600" />;
    return <Minus className="w-5 h-5 text-gray-600" />;
  };

  const getTrendColor = (tendencia) => {
    if (tendencia > 0) return "text-green-600";
    if (tendencia < 0) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 hover:bg-slate-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-slate-100 rounded-2xl mb-4">
            <BarChart3 className="w-16 h-16 text-slate-700" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Índice TunnelConecta de Precios (ITP)</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Referencia oficial del mercado de macrotúneles agrícolas en México
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Actualizado mensualmente con datos reales de transacciones
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Cargando datos del índice...</p>
          </div>
        ) : !datos ? (
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Vista Previa del ITP</h3>
              <p className="text-gray-600">
                Aquí verás precios por región, tendencias mensuales y análisis detallado.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Resumen General */}
            <Card className="bg-gradient-to-r from-slate-700 to-gray-800 text-white">
              <CardHeader>
                <CardTitle className="text-2xl">Resumen del Mercado</CardTitle>
                <p className="text-slate-300">Período: {datos.periodo}</p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-slate-300 text-sm mb-1">Precio Promedio Nacional</p>
                    <p className="text-3xl font-bold">${datos.precio_promedio_nacional?.toLocaleString()} MXN/ha</p>
                  </div>
                  <div>
                    <p className="text-slate-300 text-sm mb-1">Transacciones Registradas</p>
                    <p className="text-3xl font-bold">{datos.total_transacciones}</p>
                  </div>
                  <div>
                    <p className="text-slate-300 text-sm mb-1">Tendencia Mensual</p>
                    <div className="flex items-center space-x-2">
                      <p className={`text-3xl font-bold ${getTrendColor(datos.tendencia_mensual)}`}>
                        {datos.tendencia_mensual > 0 ? '+' : ''}{datos.tendencia_mensual}%
                      </p>
                      {getTrendIcon(datos.tendencia_mensual)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Por Región */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">Precios por Región</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {datos.por_region && datos.por_region.map((region, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-gray-900">{region.nombre}</h3>
                        <p className="text-sm text-gray-600">{region.transacciones} transacciones</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-700">
                          ${region.precio_promedio?.toLocaleString()} MXN/ha
                        </p>
                        <div className="flex items-center justify-end space-x-1 mt-1">
                          {getTrendIcon(region.tendencia)}
                          <span className={`text-sm font-semibold ${getTrendColor(region.tendencia)}`}>
                            {region.tendencia > 0 ? '+' : ''}{region.tendencia}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}</div>
              </CardContent>
            </Card>

            {/* Por Antigüedad */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">Precios por Antigüedad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {datos.por_antiguedad && datos.por_antiguedad.map((categoria, index) => (
                    <div key={index} className="p-6 bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg border-2 border-slate-200">
                      <h3 className="font-semibold text-gray-900 mb-2">{categoria.categoria}</h3>
                      <p className="text-3xl font-bold text-slate-700 mb-1">
                        ${categoria.rango_min?.toLocaleString()} - ${categoria.rango_max?.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">MXN por hectárea</p>
                      <p className="text-xs text-gray-500 mt-2">{categoria.transacciones} registros</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Insights */}
            <Card className="bg-blue-50 border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="text-xl text-blue-900">💡 Insights del Mercado</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-blue-900">
                  {datos.insights && datos.insights.map((insight, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 mt-8">
              <p>El Índice TunnelConecta de Precios (ITP) se actualiza mensualmente</p>
              <p>Basado en transacciones reales verificadas • Última actualización: {datos.ultima_actualizacion}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndicePrecios;
