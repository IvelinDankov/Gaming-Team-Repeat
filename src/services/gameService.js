import Game from "../models/Game.js";

const create = (gameData, userId) => {
  return Game.create({ ...gameData, owner: userId });
};
const getAll = () => {
  return Game.find();
};

export default {
  create,
  getAll,
};
