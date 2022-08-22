const path = require("path")

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"))

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId")

// TODO: Implement the /dishes handlers needed to make the tests pass

const list = (req, res) => {
  res.json({ data: dishes })
}

const create = (req, res) => {
  const dishData = res.locals.dish
  const newDish = {
    id: nextId(),
    ...dishData
  }
  dishes.push(newDish)
  res.status(201).json({ data: newDish })
}

const read = (req, res) => {
  res.status(200).json({ data: res.locals.original })
}

const update = (req, res) => {
  const dishData = res.locals.dish
  const originalDish = res.locals.original

  const { data: { name, description, price, image_url } = {} } = req.body
  
  dishData.id = originalDish.id
  dishData.name = name
  dishData.description = description
  dishData.price = price
  dishData.image_url = image_url

  res.json({ data: dishData })
}

module.exports = {
  list,
  create: [create],
  read: [read],
  update: [update]
}