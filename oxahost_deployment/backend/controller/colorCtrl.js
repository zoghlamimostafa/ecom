const { Color } = require('../models');
;
const asyncHandler = require("express-async-handler");
const createColor = asyncHandler(async (req, res) => {
  try {
    const newColor = await Color.create(req.body);
    res.json(newColor);
  } catch (error) {
    throw new Error(error);
  }
});
const updateColor = asyncHandler(async (req, res) => {
  const { id } = req.params;try {
    await Color.update(req.body, { where: { id: id }, 
      new: true,
     });
    const updatedColor = await Color.findByPk(id);
    res.json(updatedColor);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteColor = asyncHandler(async (req, res) => {
  const { id } = req.params;try {
    const deletedColor = await Color.destroy({ where: { id: id } });
    res.json(deletedColor);
  } catch (error) {
    throw new Error(error);
  }
});
const getColor = asyncHandler(async (req, res) => {
  const { id } = req.params;try {
    const getaColor = await Color.findByPk(id);
    res.json(getaColor);
  } catch (error) {
    throw new Error(error);
  }
});
const getallColor = asyncHandler(async (req, res) => {
  try {
    const getallColor = await Color.findAll();
    res.json(getallColor);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createColor,
  updateColor,
  deleteColor,
  getColor,
  getallColor,
};