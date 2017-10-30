/**
 * Created by 卫宁宁 on 2017/7/25.
 */
let express = require('express');
let path = require('path');
let app = express();
/*const formidable = require("formidable");
const form = new formidable.IncomingForm();*/
var html;
app.listen(9988, function () {
    console.log('服务已打开，端口号是9988');
});
let pathName = path.join(__dirname, '../');
app.use(express.static(pathName));

app.post('/voice', function (req, res) {

    /*  form.parse(req, function(err, fields, files) {
     config(files)
     });*/
    var buffer = '';
    var chunks = [];
    var size = 0;
    req.on('data', function (chunk) {
        chunks.push(chunk);
        size += chunk.length;
    });
    req.on('end', function () {
        var data = null;
        switch (chunks.length) {
            case 0:
                data = new Buffer(0);
                break;
            case 1:
                data = chunks[0];
                break;
            default:
                data = new Buffer(size);
                for (var i = 0, pos = 0, l = chunks.length; i < l; i++) {
                    var chunk = chunks[i];
                    chunk.copy(data, pos);
                    pos += chunk.length;
                }
                break;
        }
        config(res, data);

    });
});

let request = require('request');
let APP_ID = "9928500";
let API_KEY = "fbmNwxp4kZtjIaP1Xps2BU4s";
let SECRET_KEY = "fea2ceb95659a830c820257a73db9b3e";
var accessToken, result;
let cuid = 'wnnmacproaddress';
let config = function (res, bufData, socket) {
    let option1 = {
        url: `https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=${API_KEY}&client_secret=${SECRET_KEY}`,
        method: 'GET',
        json: true
    };

    function callback1(err, response, data) {
        if (!err && data) {
            accessToken = data.access_token;
            let option2 = {
                headers: {
                    'Content-Type': 'audio/pcm; rate=8000',
                    'Content-Length': bufData.length
                },
                url: `http://vop.baidu.com/server_api?lan=zh&cuid=${cuid}&token=${accessToken}`,
                method: "POST",
                json: true,
                formData: {
                    my_buffer: bufData
                }
            };

            function callback2(err, response, data) {
                if (!err && data) {
                    result = data && data.result||[];
                    html = result.join();
                    res.send(html);
                    console.log(data.result)
                }
            }

            request(option2, callback2)
        }
    }

    request(option1, callback1);

};

