const express = require('express')
const path = require('path')
const app =express(0)
const busStumanagerRouter = express.Router()

//导入第三方自定义控制器
const busStumanagerController = require(path.join(__dirname,'../controller/stumanagerController.js'))

busStumanagerRouter.get('/list/:name?',busStumanagerController.getListPage)
busStumanagerRouter.get('/add',busStumanagerController.getAddPage)
busStumanagerRouter.post('/add',busStumanagerController.addData)
busStumanagerRouter.get('/edit/:stu_id',busStumanagerController.getEditPage)
busStumanagerRouter.post('/edit/:id',busStumanagerController.updataOne)
busStumanagerRouter.get('/delet/:id',busStumanagerController.deletOne)
busStumanagerRouter.get('/search/:stu_name',busStumanagerController.findSome)
//退出逻辑
busStumanagerRouter.get('/logout',busStumanagerController.logout)


module.exports = busStumanagerRouter