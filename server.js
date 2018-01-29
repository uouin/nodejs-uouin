const express = require('express');
const static = require('express-static');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const jade = require('jade');
const multer = require('multer');
const pathLib = require('path');
const fs = require('fs');

var server = express();

server.listen(8080);

//1.解析cookie
server.use(cookieParser('hasdjhasghdgasjhbc'));

//2.使用session
var arr=[];
for (let i = 0; i < 100000; i++) {
   arr.push('keys_'+ Math.random());
}
server.use(cookieSession({name:'uouin_session_id',keys:arr,maxAge:20*3600*1000}));

//3.post数据
// bodyParser 不能上传文件  multer 可以上传文件
// server.use(bodyParser.urlencoded({extended:false}));
server.use(multer({dest:'./www/upload/'}).any());//绕过内存直接存文件

//处理用户请求
server.use('/',function(req,res,next) {
    console.log('----------');
    console.log('query:',req.query,'\nbody:',req.body,'\ncookies:',req.cookies,'\nsession:',req.session);
    console.log('files:',req.files); //multer

    //1.获取原始文件拓展名
    // base    文件名全称      a.html
    // ext     拓展名
    // dir     路径            c:\\libs\\www
    // name    文件名部分      a
    console.log('pathLib.parse:', pathLib.parse(req.files[0].originalname));
    var oldExt = pathLib.parse(req.files[0].originalname).ext;

    //2.重命名临时文件
    var newName = req.files[0].path + oldExt;// www\\upload\\9604004941300 + .png

    fs.rename(req.files[0].path , newName , function (err) {
        if(err) res.send('上传失败');
        else res.send('上传成功');
    })
})

//4.static数据
server.use(static('./www'));