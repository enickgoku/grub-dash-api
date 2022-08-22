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

//middleware validation

const dishExists = (req, res, next) => {
  const { dishId } = req.params
  const foundDish = dishes.find(dish => dish.id === Number(dishId))

  if(foundDish) {
    res.locals.dish = foundDish
    return next()
  }
  next({
    status: 404,
    message: `Dish does not exist: ${dishId}.`
  })
}

const dishHasName = (req, res, next) => {
  const { data = {} } = req.body

  if (!data.name) {
    next({
      status: 400,
      message: "Dish must include a name."
    })
  }
  res.locals.reqBody = data
  return next()
}

const dishHasDescription = (req, res, next) => {
  const reqBody = res.locals.reqBody

  if (!reqBody) {
    next({
      status: 400,
      message: "Dish must include a description."
    })
  }
  return next()
}

const dishHasPrice = (req, res, next) => {
  const reqBody = res.locals.reqBody

  if (!reqBody.price || reqBody.price < 0 || typeof reqBody.price !== "number") {
    next({
      status: 400,
      message:
        "Dish must include a price and it must be an integer greater than 0.",
    })
  }
  return next()
}

const dishHasImageUrl = (req, res, next) => {
  const reqBody = res.locals.reqBody

  if (!reqBody["image_url"]) {
    next({
      status: 400,
      message: "Dish must include a image_url"
    })
  }
  return next()
}

module.exports = {
  list,
  create: 
    [dishHasName,
    dishHasDescription,
    dishHasPrice,
    dishHasImageUrl,
    create],
  read: [dishExists, read],
  update: 
    [dishExists,
    dishHasName,
    dishHasDescription,
    dishHasPrice,
    dishHasImageUrl,
    update]
}