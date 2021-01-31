const express = require('express')

const user_controller = require('../user/user-controller')
const menu_controller = require('../menu/forms_menu/form-menu-controller')
const reports_controller = require('../reports/reports-controller')

const router = express.Router()
const authorize = require('./auth')


// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Incoming request Time: ', Date.now())
  next()
})

router.get('/', express.static(__dirname ));

router.post('/login', user_controller.login )
router.get('/logins/:login', user_controller.testFreeLogin )

router.post('/users',      user_controller.postUser )
router.get('/users',       user_controller.selectUsers )
router.delete('/users/:id', user_controller.deleteUser )
router.put('/users/:id',    user_controller.updateUser )
router.get('/users/:id',    user_controller.findOneUser )

router.post('/menu',      menu_controller.create )
router.get('/menu',       menu_controller.select )
router.delete('/menu/:id', menu_controller.delete )
router.patch('/menu/:id',    menu_controller.update )
router.get('/menu/:id',    menu_controller.findOne )

router.get('/reports/regim/:id', reports_controller.getRegim )
router.get('/reports/excel/:id', reports_controller.getExcel )

module.exports =  router 