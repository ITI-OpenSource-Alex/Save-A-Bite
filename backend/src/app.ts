import "reflect-metadata";
import express, { Application, Request, Response } from "express";
import env, { envSchema } from "./config/env.config";
import Container from "typedi";
import cors from "cors";
import { dbConnection } from "./config/db.config";
import rootRouter from "./routes/index";
import { Seeder } from "./utils/seeder";
import ErrorHandlerMiddleware from "./middlewares/error-handler";
import { RedisService } from "./utils/redis";
import { webhookController } from "./controllers/webhook.controller";
import { generalLimiter } from "./utils/ratelimit";
class App {
  private app!: Application;

  public corsOptions: cors.CorsOptions = {
    origin: true, // Reflects the origin of the request
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization, X-Requested-With, Accept"
  };

  private constructor() {}

  public static async init(): Promise<App> {
    const appInstance = new App();
    appInstance.validateEnv();
    appInstance.app = express();
    appInstance.app.set("trust proxy", 1); // Trust the reverse proxy
    await appInstance.initializeMiddlewares();
    await dbConnection();
    await Seeder.seedSuperAdmin();
    new RedisService().getClient();
    await Seeder.runAllSeeds();
    await appInstance.initializeRoutes();
    appInstance.errorHandler();
    return appInstance;
  }

  private validateEnv() {
    const { error } = envSchema.validate(env);
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
  }

  private async initializeMiddlewares() {
   this.app.post(
      '/api/payments/webhook', 
      express.raw({ type: 'application/json' }), 
      webhookController.handleStripeWebhook
    );
    this.app.use(cors(this.corsOptions));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

  
    this.app.get("/", (req: Request, res: Response) => {
      res.json({ message: "Hello World!" });
    });
  }

  private async initializeRoutes() {
    this.app.use(generalLimiter); // Apply general rate limit to all routes
    this.app.use("/api", rootRouter);
  }

  private errorHandler() {
    this.app.use(ErrorHandlerMiddleware);
  }

  public getExpressInstance(): Application {
    return this.app;
  }
}

export default App;
