import { Router } from "express";
import gameService from "../services/gameService.js";
import { getErrorMsg } from "../util/getErrMsg.js";
import { isAuth } from "../middlewares/authMiddleware.js";

const router = Router();

/**********************
 ******* Create**********
 ***********************/

router.get("/create", isAuth, (req, res) => {
  const gameData = req.body;
  const selectData = platForm(gameData);

  res.render("game/create", {
    title: "Create Page - Gaming Team",
    platform: selectData,
  });
});

router.post("/create", isAuth, async (req, res) => {
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
 ******* search GAME **********
 **************************/

router.get("/search", async (req, res) => {
  const filter = req.query;

  const platformData = platForm(filter);

  const games = await gameService.getAll(filter).lean();

  res.render("game/search", {
    title: "Search Page",
    games,
    filter,
    platform: platformData,
  });
});

/**************************
 ******* CATALOG **********
 **************************/

router.get("/catalog", async (req, res) => {
  try {
    const games = await gameService.getAll().lean();

    res.render("game/catalog", { title: "Catalog Page - Gaming Team", games });
  } catch (err) {

    const error = await getErrorMsg(err);
    res.render("game/catalog", { title: "Catalog Page - Gaming Team", games, error });
  }
});

/**************************
 ******* DETAILS **********
 **************************/

router.get("/:gameId/details", async (req, res) => {
  const gameId = req.params.gameId;

  try {
    const game = await gameService.getOne(gameId).lean();

    const owner = req.user?._id == game.owner;
    const bought = game.boughtBy.some((userId) => userId == req.user?._id);

    res.render(`game/details`, { title: "Details Page", game, owner, bought });
  } catch (err) {
    const error = await getErrorMsg(err);
    res.render(`game/details`, { title: "Details Page", game, owner, bought, error });;
    

  }
});

/******************************
 ******* REMOVE GAME **********
 ******************************/

router.get("/:gameId/delete", isAuth, async (req, res) => {
  const gameId = req.params.gameId;
  const userId = req.user._id;

   const isOwner = isGameOwner(gameId, userId);

   if (!isOwner) {
     return res.redirect("/404");
   }

  try {
    await gameService.remove(gameId);

    res.redirect("/games/catalog");
  } catch (err) {
    const error = await getErrorMsg(err);
    res.render(`game/details`, {
      title: "Details Page",
      error,
    });

  }
});

/**************************
 ******* BUY GAME **********
 **************************/

router.get("/:gameId/buy", isAuth, async (req, res) => {
  const gameId = req.params.gameId;
  const userId = req.user._id;
  
  const isOwner = isGameOwner(gameId, userId)

  if (isOwner) {
    return res.redirect('/404')
  }

  try {
    await gameService.buy(gameId, userId);

    res.redirect(`/games/${gameId}/details`);
  } catch (err) {
    const error = await getErrorMsg(err);
   
    res.render({ error });

  }
});

/**************************
 ******* EDIT GAME ********
 **************************/
router.get("/:gameId/edit", isAuth, async (req, res) => {
  const gameId = req.params.gameId;
  const userId = req.user._id

  const isOwner = isGameOwner(gameId, userId);

  if (!isOwner) {
    return res.redirect("/404");
  }

  try {
    const game = await gameService.getOne(gameId).lean();
    

    const platformData = platForm(game);

    res.render("game/edit", {
      title: "Edit Page - Gaming Team",
      game,
      platform: platformData,
    });
  } catch (err) {
    const error = await getErrorMsg(err);

     res.render("game/edit", {
       title: "Edit Page - Gaming Team",
       game,
       error
     });

  }
});

router.post("/:gameId/edit", isAuth, async (req, res) => {
  const gameId = req.params.gameId;
  const gameData = req.body;
  const platformData = platForm(game);
  const userId = req.user._id;

  const isOwner = isGameOwner(gameId, userId);

  if (!isOwner) {
    return res.redirect("/404");
  }

  try {
    await gameService.edit(gameId, gameData);
    res.redirect(`/games/${gameId}/details`);
  } catch (err) {
     const error = await getErrorMsg(err);

    res.render("game/edit", {
      title: "Edit Page - Gaming Team",
      game,
      platform: platformData,
      error,
    });

  }
});

/**************************
 ******* HELPERS **********
 **************************/

function platForm(gameData) {
  const platforms = ["-------", "PC", "Nintendo", "PS4", "PS5", "XBOX"];

  const platformData = platforms.map((platform) => ({
    value: platform,
    option: platform,
    selected: platform === gameData.platform ? "selected" : "",
  }));

  return platformData;
}

async function isGameOwner(gameId, userId) {
 
  const game = await gameService.getOne(gameId);
  const isOwner = game.owner == userId

  return isOwner
}




export default router;
