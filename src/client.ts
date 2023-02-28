import { Router } from "express";
const router = Router();
//timeout middleware ?
router.get("/*", (req, res, next) => {
  next();
});
router.get("/client/:clientId/", (req, res, next) => {
  res.send("get information about client number " + req.params.clientId);
});
router.get("/server/:serverId/", (req, res, next) => {
  res.send("get information about server number " + req.params.serverId);
});
router.get("/weapon/:weaponId/", (req, res, next) => {
  res.send("get information about weapon  " + req.params.weaponId);
});
export default router;
