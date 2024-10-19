import { Router } from "express";
import authService from "../services/authService.js";
import { getErrorMsg } from "../util/getErrMsg.js";
import { isAuth } from "../middlewares/authMiddleware.js";

const router = Router();

/***********************
######## REGISTER ######
************************/
// GET
router.get("/register", (req, res) => {
  res.render("auth/register", { title: "Register Page" });
});

// POST
router.post("/register", async (req, res) => {
  const { username, email, password, rePass } = req.body;

  try {
    await authService.register(username, email, password, rePass);

    res.redirect("/auth/login");
  } catch (err) {
    // TODO: Make error handling
    const error = getErrorMsg(err);

    res.render("auth/register", {
      title: "Register Page",
      username,
      email,
      error,
    });
  }
});

/*##################
####### LOGIN ###
###################*/

// GET

router.get("/login", (req, res) => {
  res.render("auth/login", { title: "Login Page" });
});

// POST
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await authService.login(email, password);

    res.cookie("auth", token);

    res.redirect("/");
  } catch (err) {
    // TODO: Error handling;

    const error = getErrorMsg(err);

    res.render("auth/login", { title: "Login Page", email, error });
  }
});

/*##################
####### LOGOUT ###
###################*/

router.get("/logout", isAuth, (req, res) => {
  res.clearCookie("auth");

  res.redirect("/");
});

export default router;
