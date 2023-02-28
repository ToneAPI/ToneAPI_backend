import { Router } from "express";
const router = Router();
//auth middleware
router.post("/*", (req, res, next) => {
  next();
});
router.post("/*", (req, res, next) => {
  next();
});
export default router;
