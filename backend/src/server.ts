import "reflect-metadata";
import Container from "typedi";
import { Logger } from "./services/logger.service";
import { exit } from "process";
import env from "./config/env.config";
import { createServer } from "http";
import addressRoutes from "./routes/address.routes";
import { initSocket } from "./utils/socket";
import App from "./app";
import NotificationCollector from "./utils/notification.collector";

const logger = Container.get(Logger);

const startApplication = async () => {
  try {
    const app = await App.init();
    const server = createServer(app.getExpressInstance());
    const io = initSocket(server);

    // Initialize notification collector
    NotificationCollector.getInstance();
    const port = process.env.PORT || env.APP.PORT || 4000;
    server.listen(port, () => {
      logger.info(`🚀 Server is running at http://localhost:${port}`);
    });
  } catch (err: any) {
    console.error("FATAL STARTUP ERROR:", err);
    process.exit(1);
  }
};

startApplication();
