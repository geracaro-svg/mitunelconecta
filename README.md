# TunnelConecta Front (CRA + Vercel)

Frontend single-page application para replicar la experiencia de `tunnel-market.preview.emergentagent.com`, con formularios de compra, venta y certificación listos para funcionar 100% en Vercel.

## Tecnologías
- React 19 + React Router 7 (Create React App + CRACO)
- Tailwind + shadcn/ui para componentes
- Datos mockeados y simulación de envíos para mantener la experiencia completa sin backend

## Variables de entorno
No se requiere ninguna variable. Todo el contenido y los formularios funcionan con datos locales y simulaciones de envío.

## Scripts principales

```bash
npm install   # instala dependencias
npm start     # modo desarrollo SPA (http://localhost:3000)
npm run build # build de producción dentro de /build
```

## Estructura relevante

```
src/
  pages/                # Home, Comprar, Vender, Certificación, etc.
  components/ui/        # Catálogo de componentes reutilizables
  data/mockData.js      # Datos estáticos utilizados en la UI
vercel.json             # Configuración de build y rewrites SPA
```

## Flujo de datos
1. Los formularios validan la información y simulan el envío con un pequeño delay para mantener la experiencia del usuario.
2. Las pantallas de datos (`Índice de Precios`, `Reviews`) consumen `src/data/mockData.js`, que puedes ajustar fácilmente.

## Despliegue en Vercel
1. Importar repositorio desde Vercel Dashboard.
2. Configurar variables de entorno en Settings > Environment Variables:
   - `REACT_APP_BACKEND_URL`: URL de tu API en producción
3. Deploy automático en cada push a main.
   - El build usa `npm run build` y publica `/build`.
   - Los rewrites de `vercel.json` garantizan SPA routing.

## Consideraciones
- Puedes modificar `src/data/mockData.js` para ajustar estadísticas, reviews e información del mercado.
- Los formularios validan geolocalización para respetar el radio de 150 km alrededor de Zamora, igual que en el diseño original, y muestran toasts de confirmación.
