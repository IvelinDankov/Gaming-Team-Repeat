import { Router } from "express";
import gameService from "../services/gameService.js";
import { getErrorMsg } from "../util/getErrMsg.js";

const router = Router();

/**********************
 ******* Create**********
 ***********************/

router.get("/create", (req, res) => {
  const gameData = req.body;
  const selectData = platForm(gameData);

  res.render("game/create", {
    title: "Create Page - Gaming Team",
    platform: selectData,
  });
});

router.post("/create", async (req, res) => {
  const gameData = req.body;
  const userId = req.user._id;
  try {
    await gameService.create(gameData, userId);

    res.redirect("/games/catalog");
  } catch (err) {
    const selectData = platForm(gameData);
    const error = getErrorMsg(err);

    res.render("game/create", {
      title: "Create Page - Gaming Team",
      game: gameData,
      platform: selectData,
      error,
    });
  }
});

/**************************
 ******* CATALOG **********
 **************************/

router.get("/catalog", async (req, res) => {
  try {
    const game = await gameService.getAll().lean();

    res.render("game/catalog", { title: "Catalog Page - Gaming Team", game });
  } catch (err) {
    // TODO: Error Handling
  }
});


/**************************
 ******* DETAILS **********
 **************************/

router.get('/:gameId/details', (req, res) => {
    

  res.render(`game/details`);
 });

/**********************
 ******* HELPERS **********
 ***********************/

function platForm(gameData) {
  const platforms = ["-------", "PC", "Nintendo", "PS4", "PS5", "XBOX"];

  const platformData = platforms.map((platform) => ({
    value: platform,
    option: platform,
    selected: platform === gameData.platform ? "selected" : "",
  }));

  console.log(platformData);

  return platformData;
}

export default router;
