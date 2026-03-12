import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller";
import { IsAuthenticatedMiddleware } from "../middlewares/auth.middleware"; 

const router = Router();
const notificationController = new NotificationController();

router.use(IsAuthenticatedMiddleware); // Protect all routes in this router


router.get("/", notificationController.getNotifications);

router.patch("/:id/read", notificationController.markNotificationAsRead);
router.patch("/read-all", notificationController.markAllNotificationsAsRead);

export default router;