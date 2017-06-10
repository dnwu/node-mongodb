'use strict'

const fs = require('fs')
const path = require('path')

//导入验证码模块
const captchapng = require('captchapng')

//导入mongodb第三方模块
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')


//返回登陆页面
module.exports.getLoginPage = (req, res) => {
    fs.readFile(path.join(__dirname, "../view/login.html"), (err, content) => {
        res.setHeader('Content-Type', 'text/html;charset=utf-8')
        res.end(content)
    })
}

//请求验证码 , 返回验证码
module.exports.getVcode = (req, res) => {
    var code = parseInt(Math.random() * 9000 + 1000)

    //把vcode储存在服务器的特定空间
    req.session.vcode = code
    // console.log(code)
    var p = new captchapng(80, 30, code); // width,height,numeric captcha 
    p.color(0, 0, 0, 111); // First color: background (red, green, blue, alpha) 
    p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha) 

    var img = p.getBase64();
    var imgbase64 = new Buffer(img, 'base64');
    res.writeHead(200, {
        'Content-Type': 'image/png'
    });
    res.end(imgbase64);
}

//点击登陆按钮 , 发送请求 , 判断验证码
module.exports.login = (req, res) => {
    // console.log(req.body)
    // console.log(req.session.vcode)
    const respones = {
        status: 1,
        info: '登陆成功'
    }
    if (parseInt(req.body.vcode) != req.session.vcode) {
        respones.status = 2
        respones.info = '验证码错误'
        res.json(respones)
        return
    }
    // console.log('111')
    // Connection URL 
    var url = 'mongodb://localhost:27017/test_db';
    // Use connect method to connect to the Server 
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        //储存一下用户名到session,到登陆页面内取出来用
        req.session.username = req.body.username
        
        const collection = db.collection('account')
        // console.log("Connected correctly to server")
        // console.log(typeof req.body.pad)
        collection.findOne({
            username: req.body.username,
            pad: req.body.pad
        }, (err, doc) => {
            // console.log(doc)
            if (!doc) {
                respones.status = 3
                respones.info = '登陆的用户名或密码错误'
                res.json(respones)
                return
            }
            // res.end("登陆成功后的主页")
            res.json(respones)

            db.close();
        });
    });
}

