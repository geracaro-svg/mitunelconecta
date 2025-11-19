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

