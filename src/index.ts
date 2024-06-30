import express, { Express, Request, Response } from "express";
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import sequelize from "./config/database";
import dotenv from "dotenv";
import passport from "./config/passport"; // Importa la configuración de Passport.js
import usuariosApiRouter from "./routes/usuarios/usuarios";
import healthCheckApiRoutes from "./routes/health/health";
import swaggerConfig from "./config/swagger";

// Carga y analiza los detalles de configuración del archivo .env en el objeto process.env de Node.js
dotenv.config();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});

// Crea una aplicación Express y obtiene el valor de la variable de entorno PORT del objeto process.env
const app: Express = express();
const port = process.env.PORT || 3000;

// Configura la plantilla Pug
app.set("view engine", "pug");
app.set("views", "./src/templates");

// Middleware para manejar errores de Sentry
Sentry.setupExpressErrorHandler(app);

// Configura Swagger
swaggerConfig(app);

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Rutas de ejemplo
app.get("/hello", (req: Request, res: Response) => {
  res.render("hello", { name: "Lucas" });
});

app.get("/", (req: Request, res: Response) => {
  res.render("index", { name: "Lucas" });
});

// Inicializa Passport
app.use(passport.initialize());

// Rutas de API
app.use("/health", healthCheckApiRoutes);
app.use("/api", usuariosApiRouter);

// Inicialización del servidor
app.listen(port, async () => {
  await sequelize.sync(); // Sincroniza el modelo con la base de datos
  Sentry.captureMessage("Hola Lucas", "info");
  console.log(`[server]: Server levantado en: http://localhost:${port}`);
});
