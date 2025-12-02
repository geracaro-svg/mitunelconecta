export const MOCK_ITP = {
  periodo: "Octubre 2025",
  precio_promedio_nacional: 195000,
  total_transacciones: 48,
  tendencia_mensual: 3.2,
  ultima_actualizacion: "15/10/2025",
  por_region: [
    {
      nombre: "Zamora, Michoacán",
      precio_promedio: 210000,
      tendencia: 4.5,
      transacciones: 18
    },
    {
      nombre: "Los Reyes",
      precio_promedio: 185000,
      tendencia: 1.8,
      transacciones: 12
    },
    {
      nombre: "La Piedad",
      precio_promedio: 178000,
      tendencia: -1.2,
      transacciones: 9
    },
    {
      nombre: "Jalisco (limítrofe)",
      precio_promedio: 205000,
      tendencia: 2.1,
      transacciones: 9
    }
  ],
  por_antiguedad: [
    {
      categoria: "0-2 años",
      rango_min: 230000,
      rango_max: 260000,
      transacciones: 8
    },
    {
      categoria: "3-4 años",
      rango_min: 190000,
      rango_max: 220000,
      transacciones: 16
    },
    {
      categoria: "5-6 años",
      rango_min: 160000,
      rango_max: 185000,
      transacciones: 14
    },
    {
      categoria: "7+ años",
      rango_min: 120000,
      rango_max: 150000,
      transacciones: 10
    }
  ],
  insights: [
    "La demanda de estructuras certificadas aumentó 18% en el último trimestre.",
    "Los compradores priorizan macrotúneles con sistemas de riego incluidos.",
    "El 62% de las transacciones se cierra en menos de 30 días."
  ]
};

export const MOCK_REVIEWS = [
  {
    nombre_cliente: "Mariana López",
    ubicacion: "Zamora, Michoacán",
    tipo_transaccion: "Compra",
    hectareas: 2.1,
    rating: 5,
    comentario: "Excelente acompañamiento en todo el proceso. Certificaron el macrotúnel antes de entregarlo.",
    fecha: "2025-08-02",
    verificado: true
  },
  {
    nombre_cliente: "Víctor Godínez",
    ubicacion: "Los Reyes",
    tipo_transaccion: "Venta",
    hectareas: 3.4,
    rating: 4,
    comentario: "Publicaron mi estructura y en menos de un mes cerré la venta. Buen seguimiento.",
    fecha: "2025-07-15",
    verificado: true
  },
  {
    nombre_cliente: "Granja San Carlos",
    ubicacion: "La Piedad",
    tipo_transaccion: "Compra",
    hectareas: 1.8,
    rating: 5,
    comentario: "Nos ayudaron a definir la mejor zona y nos conectaron con financiamiento local.",
    fecha: "2025-05-30",
    verificado: true
  }
];

export const MOCK_TESTIMONIALS = [
  {
    ubicacion: "Zamora, Michoacán",
    tipo: "Venta",
    comentario: "Vendí mi macrotúnel certificado en solo 15 días. Obtuve 20% más de lo esperado gracias a la plataforma.",
    hectareas: 2.5,
    imagen_proyecto: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=400&h=300&fit=crop",
    beneficio: "Venta rápida y precio premium"
  },
  {
    ubicacion: "Los Reyes",
    tipo: "Compra",
    comentario: "Encontré el macrotúnel perfecto para mi expansión. El financiamiento facilitó todo el proceso.",
    hectareas: 3.2,
    imagen_proyecto: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop",
    beneficio: "Compra financiada y expansión exitosa"
  },
  {
    ubicacion: "La Piedad",
    tipo: "Venta",
    comentario: "Conectaron mi estructura con compradores interesados. Transacción segura y sin intermediarios.",
    hectareas: 1.8,
    imagen_proyecto: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop",
    beneficio: "Transacción directa y confiable"
  }
];

export const MOCK_SUCCESS_STORIES = [
  {
    nombre: "Mariana López",
    ubicacion: "Zamora, Michoacán",
    tipo: "Compra",
    hectareas: 2.1,
    rating: 5,
    comentario: "Excelente acompañamiento en todo el proceso. Certificaron el macrotúnel antes de entregarlo. ¡Increíble cómo facilitaron mi inversión!",
    imagen_proyecto: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=400&h=300&fit=crop",
    beneficio: "Compra segura y certificada",
    verificado: true,
    fecha: "2025-08-02"
  },
  {
    nombre: "Víctor Godínez",
    ubicacion: "Los Reyes",
    tipo: "Venta",
    hectareas: 3.4,
    rating: 4,
    comentario: "Publicaron mi estructura y en menos de un mes cerré la venta. Buen seguimiento y precio justo. ¡Recomiendo 100%!",
    imagen_proyecto: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop",
    beneficio: "Venta rápida y sin complicaciones",
    verificado: true,
    fecha: "2025-07-15"
  },
  {
    nombre: "Granja San Carlos",
    ubicacion: "La Piedad",
    tipo: "Compra",
    hectareas: 1.8,
    rating: 5,
    comentario: "Nos ayudaron a definir la mejor zona y nos conectaron con financiamiento local. Nuestra producción aumentó 40% este año.",
    imagen_proyecto: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop",
    beneficio: "Expansión exitosa con financiamiento",
    verificado: true,
    fecha: "2025-05-30"
  },
  {
    nombre: "Roberto Mendoza",
    ubicacion: "Zamora, Michoacán",
    tipo: "Venta",
    hectareas: 4.2,
    rating: 5,
    comentario: "Convertí mi macrotúnel obsoleto en liquidez inmediata. El proceso fue transparente y el precio superó mis expectativas.",
    imagen_proyecto: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=400&h=300&fit=crop",
    beneficio: "Liquidez inmediata y precio premium",
    verificado: true,
    fecha: "2025-09-10"
  },
  {
    nombre: "Familia García",
    ubicacion: "Los Reyes",
    tipo: "Compra",
    hectareas: 2.8,
    rating: 5,
    comentario: "Gracias a Túnel Usado, pudimos adquirir nuestra primera estructura agrícola. El equipo nos guió en cada paso. ¡Nuestro sueño hecho realidad!",
    imagen_proyecto: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop",
    beneficio: "Primer macrotúnel familiar",
    verificado: true,
    fecha: "2025-06-20"
  },
  {
    nombre: "Agroindustria Valle Verde",
    ubicacion: "La Piedad",
    tipo: "Compra",
    hectareas: 5.5,
    rating: 5,
    comentario: "Invertimos en tecnología agrícola de calidad a través de la plataforma. La certificación nos dio la confianza necesaria para una inversión de este tamaño.",
    imagen_proyecto: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop",
    beneficio: "Inversión tecnológica certificada",
    verificado: true,
    fecha: "2025-04-15"
  }
];

