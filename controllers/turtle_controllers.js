const turtleServices = require('../services/turtle_services.js');

async function createTurtle(req, res, next) {
  try {
    const newTurtle = await turtleServices.createTurtle(req.body);
    res.json({
      message: 'Tortuga creada exitosamente',
      turtle: newTurtle
    });
  } catch (error) {
    next(error);
  }
}

async function getTurtles(req, res, next) {
  try {
    const turtles = await turtleServices.getTurtles(req.query);
    res.json({
      message: `Se encontraron ${turtles.length} tortugas`,
      turtles: turtles
    });
  } catch (error) {
    next(error);
  }
}

async function deleteTurtle(req, res, next) {
  try {
    await turtleServices.deleteTurtleById(req.params.id);
    res.json({
      message: 'Tortuga eliminada exitosamente'
    });
  } catch (error) {
    next(error);
  }
}

async function updateTurtle(req, res, next) {
  try {
    const updatedTurtle = await turtleServices.updateTurtleById(req.params.id, req.body);
    res.json({
      message: 'Tortuga actualizada exitosamente',
      turtle: updatedTurtle
    });
  } catch (error) {
    next(error);
  }
}

async function getSpecies(req, res, next) {
  try {
    const species = await turtleServices.getSpecies();
    res.json({
      message: `Se encontraron ${species.length} especies`,
      species: species
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createTurtle,
  getTurtles,
  deleteTurtle,
  updateTurtle,
  getSpecies,
};
