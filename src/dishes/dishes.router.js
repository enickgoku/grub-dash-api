const router = require("express").Router({ mergeParams: true })
const controller = require('../dishes/dishes.controller')
const methodNotAllowed = require('../errors/methodNotAllowed')
// TODO: Implement the /dishes routes needed to make the tests pass

router.route('/', controller.list).all(methodNotAllowed)

module.exports = router
