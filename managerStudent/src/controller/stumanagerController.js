//导包
const fs = require('fs')
const path = require('path')
//导入Xtemplate模块
const xtpl = require('xtpl')

//导入数据库工具模块
const mongodb = require(path.join(__dirname, '../tool/mongodb.js'))


//返回list 页面
exports.getListPage = (req, res) => {
    // console.log(req.query.pagenum)
    // console.log(req.params.name)
    const pageData = 2
    const currentPage = parseInt(req.query.pagenum || 0)
    const username = req.session.username
    // console.log(currentPage)
    // console.log(typeof currentPage)
    const startNum = (req.query.pagenum || 0) * pageData
    const namekey = req.params.name || ''
    // console.log(namekey)
    mongodb.getAccount({name: {$regex: namekey}}, (err, count) => {
        // console.log(count)
        const totalpage = Math.ceil(count / pageData)

        mongodb.findAll(startNum, pageData, {name: {$regex: namekey}}, (err, data) => {
            // console.log('控制器引入成功')
            // console.log(data.length)
            //把页码数从0开始填加到一个数组中
            // console.log(data)
            const pageArr = []
            for (var i = 0; i < totalpage; i++) {
                pageArr.push(i)
            }
            // console.log(pageArr)
            // data.push(pageinfo)
            // console.log(totalpage)
            // console.log(data)
            xtpl.renderFile(path.join(__dirname, '../view/list.html'), {allData: data,pageArr: pageArr,keyword:namekey,currentPage:currentPage,username:username,totalpage:totalpage}, (err, content) => {
                // console.log(err)
                res.setHeader('Content-Type', 'text/html;charset=utf-8')
                res.end(content)
            })
        })
    })
}

//返回新增页
exports.getAddPage = (req, res) => {
    xtpl.renderFile(path.join(__dirname, '../view/add.html'), {}, (err, content) => {
        res.setHeader('Content-Type', 'text/html;charset=utf-8')
        res.end(content)
    })
}
//处理新增页保存数据
exports.addData = (req, res) => {
    // console.log(req.body)
    mongodb.addOne({
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
        phone: req.body.phone,
        address: req.body.address,
        introduction: req.body.introduction
    }, (err, doc) => {
        if (!doc) {
            res.end('<script>alert("新增失败")</script>')
            return
        }
        res.end("<script>window.location.href='/manager/list'</script>")
    })
}
//返回编辑页
exports.getEditPage = (req, res) => {
    // console.log(req.params)
    // const stuId = mongodb.ObjectId(req.params.stu_id)
    const stuId = mongodb.ObjectId(req.params.stu_id)

    // console.log(stuId)
    mongodb.findOne({
        _id: stuId
    }, (err, doc) => {
        // console.log(doc)
        xtpl.renderFile(path.join(__dirname, '../view/edit.html'), {
            stuData: doc
        }, (err, content) => {
            res.setHeader('Content-Type', 'text/html;charset=utf-8')
            res.end(content)
        })
    })
}

//更新一条数据
exports.updataOne = (req, res) => {
    // console.log(req.body)
    const _id = mongodb.ObjectId(req.body._id)
    // console.log(_id)
    mongodb.updataOne({
        _id: _id
    }, {
        $set: {
            name: req.body.name,
            age: req.body.age,
            gender: req.body.gender,
            phone: req.body.phone,
            address: req.body.address,
            introduction: req.body.introduction
        }
    }, (err, doc) => {
        // console.log(doc)
        if (!doc) {
            res.end("<script>alert('修改失败')</script>")
            return
        }
        res.end("<script>window.location.href='/manager/list'</script>")
    })
}


//删除一条数据
exports.deletOne = (req, res) => {
    const _id = mongodb.ObjectId(req.params.id)
    // console.log(_id)
    // console.log(req.params)
    mongodb.deletOne({
        _id: _id
    }, (err, doc) => {
        // console.log(doc)
        if (!doc) {
            res.end("<script>alert('删除失败')</script>")
        }
        res.end("<script>window.location.href='/manager/list'</script>")
    })
}

//模糊查找
exports.findSome = (req, res) => {
    // console.log(req.params.stu_name)
    var name = req.params.stu_name
    mongodb.findSome(name, (err, doc) => {
        // console.log(doc)
        xtpl.renderFile(path.join(__dirname, '../view/list.html'), {
            allData: doc
        }, (err, content) => {
            res.setHeader('Content-Type', 'text/html;charset=utf-8')
            res.end(content)
        })
    })
}

//处理退出逻辑
exports.logout = (req, res) => {
    req.session.username = null
    fs.readFile(path.join(__dirname, "../view/login.html"), (err, content) => {
        res.setHeader('Content-Type', 'text/html;charset=utf-8')
        res.end(content)
    })

}