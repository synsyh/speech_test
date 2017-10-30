let request = require('request');
let APP_ID = "9928500";
let API_KEY = "fbmNwxp4kZtjIaP1Xps2BU4s";
let SECRET_KEY = "fea2ceb95659a830c820257a73db9b3e";
var accessToken, result;
let cuid = 'wnnmacproaddress';
let config = function (bufData, socket) {
    let option1 = {
        url: `https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=${API_KEY}&client_secret=${SECRET_KEY}`,
        method: 'GET',
        json: true
    };

    function callback1(err, res, data) {
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

            function callback2(err, data) {
                if (!err && data) {
                    result = data && data.result;
                    console.log('result', result);
                }
            }

            request(option2, callback2)
        }
    }
    request(option1, callback1);

};
