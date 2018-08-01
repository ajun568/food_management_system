export function getPath(obj) {
    let srcs = [];
    // console.log('userAgent : ', window.navigator.userAgent)
    // 使用BLOB地址要比FileReader直接生成Base64快特别多倍；
    if ( window && window.URL && window.URL.createObjectURL ) {
        for (let i=0, max=obj.files.length; i<max; i++) {
            srcs.push(window.URL.createObjectURL(obj.files[i]))
        }
        return new Promise((resolve, reject) => { resolve(srcs) })
    } else if (window.FileReader) {
        let count = obj.files.length;
        return new Promise((resolve, reject) => {
            for (let i=0, max=obj.files.length; i<max; i++) {
                let reader = new FileReader()
                reader.readAsDataURL(obj.files[i])
                reader.onload = function (e) {
                    srcs.push(e.currentTarget.result)
                    count -= 1;
                    if (!count) resolve(srcs)
                }
            }
        })
    } else {
        let result = obj.value
        if (result.includes('fakepath')) {
            obj.select()
            obj.blur()      // IE9拒绝访问
            result = document.selection.createRange().text
            document.selection.empty()
        }
        console.log(result)
        return result
    }
}
