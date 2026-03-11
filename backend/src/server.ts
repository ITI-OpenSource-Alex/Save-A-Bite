import "reflect-metadata";
import Container from "typedi";
import { Logger } from "./services/logger.service";
import { exit } from "process";
import env from "./config/env.config";
import { createServer } from "http";
import addressRoutes from "./routes/address.routes";
import { initSocket } from "./utils/socket";
import App from "./app";
import NotificationCollector from './utils/notification.collector';

const logger = Container.get(Logger);

const startApplication = async () => {
  try {
    const app = await App.init();
    const server = createServer(app.getExpressInstance());
    const io = initSocket(server);
    
    // Initialize notification collector
    NotificationCollector.getInstance();

    server.listen(env.APP.PORT, () => {
      logger.info(`🚀 Server is running at http://localhost:${env.APP.PORT}`);
    });
  } catch (err: any) {
    logger.error(`Error starting application: ${err.message}`, err);
    exit(1);
  }
};

startApplication();
