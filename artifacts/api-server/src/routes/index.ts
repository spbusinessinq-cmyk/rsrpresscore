import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import applicationsRouter from "./applications";
import bulletinsRouter from "./bulletins";
import assignmentsRouter from "./assignments";
import scheduleRouter from "./schedule";
import messagesRouter from "./messages";
import reportsRouter from "./reports";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(applicationsRouter);
router.use(bulletinsRouter);
router.use(assignmentsRouter);
router.use(scheduleRouter);
router.use(messagesRouter);
router.use(reportsRouter);

export default router;
