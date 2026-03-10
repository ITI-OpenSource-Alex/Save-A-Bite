import { Router } from "express";
import addressRoutes from "./address.routes";
import orderRoutes from "./order.routes";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import categoryRoutes from "./category.routes";
import storeRoutes from "./store.routes";
import productRoutes from "./product.routes";
<<<<<<< HEAD
import paymentRoutes from './payment.routes';
import cartRoutes from './cart.routes';
import promoCodeRoutes from './promocode.routes';
=======
import paymentRoutes from "./payment.routes";
>>>>>>> c4be7fb1ffb68b3723b5d5470189d7c231f37c9a

const rootRouter = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/addresses", addressRoutes);
rootRouter.use("/orders", orderRoutes);
rootRouter.use("/users", userRoutes);
rootRouter.use("/category", categoryRoutes);
rootRouter.use("/stores", storeRoutes);
rootRouter.use("/products", productRoutes);
<<<<<<< HEAD
rootRouter.use('/payments', paymentRoutes);
rootRouter.use("/cart", cartRoutes);
rootRouter.use("/admin/promocodes", promoCodeRoutes);
=======
rootRouter.use("/payments", paymentRoutes);
>>>>>>> c4be7fb1ffb68b3723b5d5470189d7c231f37c9a

export default rootRouter;
