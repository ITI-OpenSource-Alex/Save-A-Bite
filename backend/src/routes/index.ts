import { Router } from "express";
import addressRoutes from "./address.routes";
import orderRoutes from "./order.routes";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import categoryRoutes from "./category.routes";
import storeRoutes from "./store.routes";
import productRoutes from "./product.routes";
import paymentRoutes from './payment.routes';
import cartRoutes from './cart.routes';
import promoCodeRoutes from './promocode.routes';
import notificationRoutes from './notification.routes';

const rootRouter = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/addresses", addressRoutes);
rootRouter.use("/orders", orderRoutes);
rootRouter.use("/users", userRoutes);
rootRouter.use("/category", categoryRoutes);
rootRouter.use("/stores", storeRoutes);
rootRouter.use("/products", productRoutes);
rootRouter.use("/payments", paymentRoutes);
rootRouter.use("/cart", cartRoutes);
rootRouter.use("/admin/promocodes", promoCodeRoutes);
rootRouter.use("/notifications", notificationRoutes);



export default rootRouter;
