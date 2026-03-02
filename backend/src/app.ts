import "reflect-metadata";
import express, { Application, Request, Response } from "express";
import env, { envSchema } from "./config/env.config";
import Container from "typedi";
import cors from "cors";
import { dbConnection } from "./config/db.config";
import addressRoutes from './routes/address.routes';
import ErrorHandlerMiddleware from "./middlewares/error-handler";

class App {
  private app!: Application;

  public corsOptions: cors.CorsOptions = {
    origin: "*",
    allowedHeaders: "*",
    methods: "*",
  };

  private constructor() {}

  public static async init(): Promise<App> {
    const appInstance = new App();
    appInstance.validateEnv();
    appInstance.app = express();
    await appInstance.initializeMiddlewares();
    await dbConnection();
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
    this.app.use(cors(this.corsOptions));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use('/addresses', addressRoutes);

    // Test route
    this.app.get("/", (req: Request, res: Response) => {
      res.json({ message: "Hello World!" });
    });

  }

  private async initializeRoutes() {
  }

  private errorHandler() {
    this.app.use(ErrorHandlerMiddleware);
  }

  public getExpressInstance(): Application {
    return this.app;
  }
}

export default App;
