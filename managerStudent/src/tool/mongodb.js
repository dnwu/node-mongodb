const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

exports.ObjectId = mongodb.ObjectId

//查询全部数据
module.exports.findAll = (start,num_page,condition, callback) => {
    // Connection URL 
    var url = 'mongodb://localhost:27017/test_db';
    // Use connect method to connect to the Server 
    MongoClient.connect(url, function (err, db) {
        // console.log("Connected correctly to server");
        // Get the documents collection 
        var collection = db.collection('stu_info');
        // Find some documents 
        collection.find(condition).skip(start).limit(num_page).toArray(function (err, docs) {
            // console.log("Found the following records");
            // console.dir(docs);
            callback(err, docs);
        db.close();
        });
    })
}

//查询复合条件的数量
module.exports.getAccount = (condition,callback)=>{
    // Connection URL 
    var url = 'mongodb://localhost:27017/test_db';
    // Use connect method to connect to the Server 
    MongoClient.connect(url, function (err, db) {
        // console.log("Connected correctly to server");
        // Get the documents collection 
        var collection = db.collection('stu_info');
        // Find some documents 
        collection.find(condition).count(function (err, docs) {
            // console.log("Found the following records");
            // console.dir(docs);
            callback(err, docs);
            db.close();
        });
    })
}

//新增一个数据
module.exports.addOne = (condition,callback) => {
    var url = 'mongodb://localhost:27017/test_db';
    MongoClient.connect(url, function (err, db) {
        const collection = db.collection('stu_info');
        collection.insertOne(condition, function (err, result) {
            callback(err,result);
        db.close();
        });
    })
}

//查询一个数据
exports.findOne = (condition,callback)=>{
    var url = 'mongodb://localhost:27017/test_db';
    MongoClient.connect(url, function (err, db) {
        const collection = db.collection('stu_info');
        collection.findOne(condition, (err, result)=> {
            callback(err,result);
        db.close();
        });
    })
}

//更新一条数据
exports.updataOne = (id,condition,callback)=>{
    var url = 'mongodb://localhost:27017/test_db';
    MongoClient.connect(url, function (err, db) {
        const collection = db.collection('stu_info');
        collection.updateOne(id,condition, (err, result)=> {
            callback(err,result);
            db.close();
        });
    })
}

//删除一条数据
exports.deletOne = (condition,callback)=>{
    var url = 'mongodb://localhost:27017/test_db'
    MongoClient.connect(url, function (err, db) {
        const collection = db.collection('stu_info')
        collection.deleteOne(condition, (err, result)=> {
            callback(err,result)
            db.close()
        })
    })
}

//模糊查找
exports.findSome = (condition,callback)=>{
    var url = 'mongodb://localhost:27017/test_db'
    MongoClient.connect(url, function (err, db) {
        const collection = db.collection('stu_info')
        collection.find({name:{$regex:condition}}).toArray(function(err, docs) {
            callback(err,docs)
            db.close()
        })
    })
}