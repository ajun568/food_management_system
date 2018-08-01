const $ = require('jquery');
import { Message } from 'element-ui';

export const api = (url, data) => new Promise((resolve, reject) => {
    $.ajax({
        url: url,
        type: 'POST',
        dataType:'json',
        contentType:'application/json;charset=UTF-8',
        data: JSON.stringify({
            ...data,
        }),
        success: function (result) {
            if (typeof result == 'string') {
                result = JSON.parse(result);
            }
            if (result.code < 0 ) {
                if (result.code == -2 || result.code == -10) {
                    Message.error({
                        message: result.msg
                    });
                    reject(result);
                }else{
                    reject(result);
                }
            } else {
                if (result.code == 2) {
                    Message.success({
                        message: result.msg
                    });
                }
                if (result.code == 3) {
                    Message.warning({
                        message: result.msg
                    });
                }
                resolve(result.data);
            }
        },
        error: function (result) {
            Message.error({
                message: '网络错误，或者服务器发生了点小意外'
            });
            reject(result);
        }
    })
});
