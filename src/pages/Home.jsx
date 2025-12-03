import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sprout, ShoppingCart, TrendingUp, Shield, Star, CheckCircle, Users, Award, Zap } from "lucide-react";
import { MOCK_TESTIMONIALS, MOCK_SUCCESS_STORIES } from "@/data/mockData";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-2xl mb-4">
            <img src="/logo.png" alt="TúnelUSA2 Logo" className="w-72 h-72" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
            Compra y Vende Macrotúneles Usados Certificados
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Marketplace de macrotúneles agrícolas en Zamora y región
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

        {/*
        <div className="py-16 bg-gradient-to-r from-lime-50 via-emerald-50 to-green-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-3 bg-lime-100 rounded-2xl mb-4">
                <Award className="w-8 h-8 text-lime-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Casos de Éxito Reales
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Historias de productores que transformaron sus proyectos con Túnel Usado
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {MOCK_SUCCESS_STORIES.slice(0, 6).map((story, index) => (
                <Card key={index} className="bg-white/90 backdrop-blur-sm border-2 border-lime-100 hover:border-lime-300 transition-all duration-300 overflow-hidden group shadow-lg">
                  <div className="relative">
                    <img
                      src={story.imagen_proyecto}
                      alt={`Proyecto de ${story.nombre}`}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 bg-lime-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {story.tipo}
                    </div>
                    {story.verificado && (
                      <div className="absolute top-4 right-4 bg-green-600 text-white p-1 rounded-full">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < story.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">({story.rating}/5)</span>
                    </div>
                    <p className="text-gray-700 mb-4 italic leading-relaxed">
                      "{story.comentario}"
                    </p>
                    <div className="border-t pt-4">
                      <p className="font-semibold text-gray-900 mb-1">{story.nombre}</p>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{story.ubicacion}</span>
                        <span>{story.hectareas} hectáreas</span>
                      </div>
                      <p className="text-lime-700 font-medium text-sm mt-2">{story.beneficio}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-6">Únete a más de 50 productores exitosos en nuestra plataforma</p>
              <Button
                onClick={() => navigate('/vender')}
                className="bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all text-lg mr-4"
              >
                ¡Empieza tu historia de éxito!
              </Button>
              <Button
                onClick={() => navigate('/comprar')}
                variant="outline"
                className="border-2 border-lime-500 text-lime-700 hover:bg-lime-50 font-semibold py-4 px-8 rounded-xl transition-all text-lg"
              >
                Encuentra tu oportunidad
              </Button>
            </div>
          </div>
        </div>
        */}

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

        {/* SEO Content Section */}
        <div className="max-w-6xl mx-auto px-4 py-16 space-y-16">
          {/* What is Túnel Usado */}
          <section className="text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">¿Qué es TúnelUSA<span className="text-emerald-600">2</span>?</h2>
            <h3 className="text-xl md:text-2xl font-semibold text-emerald-700">La plataforma que revoluciona el mercado de agricultura protegida</h3>
            <div className="max-w-4xl mx-auto text-left space-y-4 text-gray-700 leading-relaxed">
              <p>
                Túnel Usado es la primera plataforma digital especializada en conectar vendedores y compradores de estructuras de agricultura protegida en México y Latinoamérica. Nos enfocamos específicamente en macrotúneles e invernaderos usados, ofreciendo una solución completa que va más allá de la simple intermediación.
              </p>
              <p>
                <strong>La agricultura protegida representa una inversión significativa para cualquier productor.</strong> Los macrotúneles y invernaderos requieren de una inversión inicial considerable, pero con el tiempo, las necesidades de los agricultores pueden cambiar. Túnel Usado surge como respuesta a esta realidad del sector agrícola, permitiendo que las estructuras que ya cumplieron su ciclo útil para un productor puedan encontrar un segundo uso productivo.
              </p>
              <p>
                <strong>Nuestra propuesta de valor se basa en tres pilares fundamentales:</strong> certificación técnica especializada, opciones de financiamiento accesibles y una intermediación confiable que garantiza la calidad de cada transacción. Cada macrotúnel listado en nuestra plataforma pasa por un proceso de verificación técnica que asegura su viabilidad para un segundo uso, generando confianza tanto en vendedores como en compradores.
              </p>
            </div>
          </section>

          {/* Benefits for Sellers */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-emerald-100">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Beneficios para Vendedores</h2>
            <h3 className="text-xl font-semibold text-emerald-700 text-center mb-6">Convierte tu macrotúnel en liquidez inmediata</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2">✓</span>
                    <span>Convierte tu macrotúnel usado en liquidez inmediata</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2">✓</span>
                    <span>Certificación técnica que aumenta el valor de venta hasta 15%</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2">✓</span>
                    <span>Proceso simple y seguro sin intermediarios tradicionales</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2">✓</span>
                    <span>Conecta con compradores verificados en tu región</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2">✓</span>
                    <span>Opción de financiamiento para facilitar la transición</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Benefits for Buyers */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-lime-100">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Beneficios para Compradores</h2>
            <h3 className="text-xl font-semibold text-lime-700 text-center mb-6">Adquiere estructuras certificadas con financiamiento</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2">✓</span>
                    <span>Adquiere macrotúneles certificados a precios accesibles</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2">✓</span>
                    <span>Reduce costos iniciales hasta 60% vs. estructura nueva</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2">✓</span>
                    <span>Financiamiento disponible para facilitar la compra</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2">✓</span>
                    <span>Garantía técnica con inspección profesional</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-lime-600 mr-2">✓</span>
                    <span>Acceso a inventario verificado en tu zona</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Why Choose Túnel Usado */}
          <section className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">¿Por qué elegir TúnelUSA<span className="text-emerald-600">2</span>?</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Certificación técnica especializada</h3>
                <p className="text-gray-600">
                  Cada estructura pasa por una evaluación profesional que incluye inspección física, medición de dimensiones, evaluación del estado de los materiales y verificación de la funcionalidad.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Financiamiento disponible</h3>
                <p className="text-gray-600">
                  Opciones de financiamiento accesibles para vendedores que necesitan liquidez inmediata y compradores que buscan adquirir estructuras de calidad.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto">
                  <Sprout className="w-8 h-8 text-lime-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Cobertura regional</h3>
                <p className="text-gray-600">
                  Con cobertura en Zamora, Michoacán y 150km a la redonda, facilitamos transacciones locales que benefician a toda la comunidad productora.
                </p>
              </div>
            </div>
          </section>

          {/* Additional SEO Content */}
          <section className="bg-gradient-to-r from-emerald-50 to-lime-50 rounded-2xl p-8 text-center space-y-6">
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              <strong>Para los vendedores,</strong> representamos una oportunidad única de convertir un activo improductivo en liquidez inmediata. Muchos agricultores se encuentran en situaciones donde necesitan salir de deudas de manera ágil, y vender su macrotúnel usado puede ser la solución.
            </p>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              <strong>Para los compradores,</strong> especialmente aquellos en situaciones económicas desafiantes, Túnel Usado ofrece la posibilidad de adquirir estructuras agrícolas de calidad sin necesidad de invertir en equipos nuevos.
            </p>
            <div className="pt-4">
              <Button
                onClick={() => navigate('/vender')}
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all text-lg mr-4"
              >
                ¡Registra tu macrotúnel hoy!
              </Button>
              <Button
                onClick={() => navigate('/comprar')}
                variant="outline"
                className="border-2 border-lime-500 text-lime-700 hover:bg-lime-50 font-semibold py-4 px-8 rounded-xl transition-all text-lg"
              >
                Encuentra el tuyo
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;