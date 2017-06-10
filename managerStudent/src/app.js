'use strict'

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')


//导入session模块
const session = require('express-session')



//初始化创建一个服务
const app = express()

//导入session 中间件
app.use(session({
    secret: 'keyboard cat',
    cookie: {
        maxAge: 600000
    }
}))
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({
    extended: false
}))

//静态资源
app.use(express.static(path.join(__dirname, 'static')))

//权限验证,
//参考地址:http://www.expressjs.com.cn/4x/api.html#router.all
app.all('*', (req, res,next) => {
    if (req.url.includes('/account')) {
        next()
    } else {
        if (req.session.username != null) {
            next()
        } else {
            res.setHeader('Content-Type',"text/html;charset=utf-8")
            res.end("<script>window.location.href = '/account/login'</script>")
        }
    }
})

//导入自定义路由模块
const busRouter = require(path.join(__dirname, '/router/busRouter.js'))
//使用路由
app.use('/account', busRouter)
//导入路由
const busStumanagerRouter = require(path.join(__dirname, '/router/stumanagerRouter.js'))
app.use('/manager', busStumanagerRouter)


//开启服务
app.listen(3000, '127.0.0.1', (err) => {
    if (err) {
        console.log(err)
    }
    console.log('启动成功')
})