'use strict'

const express = require('express')
const path = require('path')
//可使用 express.Router 类创建模块化、可挂载的路由句柄。Router 实例是一个完整的中间件和路由系统，因此常称其为一个 “mini-app”。
const busRouter = express.Router()
//导入自定义controller模块
const busController = require(path.join(__dirname, '../controller/busController.js'))

//使用controller , 
busRouter.get('/login', busController.getLoginPage)

//验证码
busRouter.get('/vcode',busController.getVcode)
//登陆
busRouter.post('/login',busController.login)
//导出总路由
module.exports = busRouter