import Game from "../models/Game.js";

const create = (gameData, userId) => {
  return Game.create({ ...gameData, owner: userId });
};
const getAll = (filter = {}) => {
  const query = Game.find();

  if (filter.search) {
    query.find({ name: { $regex: filter.search, $options: 'i' } });
  
  }

  if (filter.platform && filter.platform !== "-------") {
    query.find({ platform: filter.platform });
  }

  return query;
};

    const getOne = (gameId) => {
  return Game.findById(gameId);
};

const remove = (gameId) => {
  return Game.findByIdAndDelete(gameId);
};

const buy = (gameId, userId) => {
  return Game.findByIdAndUpdate( gameId, { $push: { boughtBy: userId} } );
}

export default {
  create,
  getAll,
  getOne,
  remove,
  buy
};
