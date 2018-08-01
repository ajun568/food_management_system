export const Yijun = {
    init () {},
    randomID () {
        return String(Math.random()*new Date().getTime()).split('.')[0]
    },
    JSON : {

        /*
         * stringify - 类似 JSON.stringify 但是需要转化函数为字符串
         */
        stringify (obj) {
            let result = ''
            for (let key in obj) {
                if (typeof obj[key] == 'object') {
                    this.stringify(obj[key])
                } else if (typeof obj[key] == 'function') {
                    obj[key] = String(obj[key])
                }
            }
        },
        parse (str, deep) {
            str = deep=='deep' ? str : str.replace(/\\n|\n|\\t|\t/g, '')
            let newObj = deep=='deep' ? str : JSON.parse(str)
            for (let key in newObj) {
                if (typeof newObj[key] == 'object') {
                    newObj[key] = this.parse(newObj[key], 'deep')
                } else if (typeof newObj[key] == 'string') {
                    if ( newObj[key].includes('=>') || newObj[key].includes('function') ) {
                        newObj[key] = eval('('+newObj[key]+')')
                    }
                }
            }
            return newObj
        }

    },
    extend (
        // 需要被扩展的对象
        source = {},
        // 原材料
        raw = {},
        // 是否进行深拷贝
        deep = true,
        // 是否覆盖原始值 - 不依赖source的原始值的值
        rewrite = true,
    ) {
        // 参数长度不同导致的操作方式不同
        // 1. 默认参数传递 - 用对象raw对象去扩展source对象
        // 2. extend语义化操作方式
        let _source, _raw, _deep, _rewrite
        if (arguments.length==1 || arguments.length>1 && typeof arguments[1]=='boolean') {
            _source = {}, _raw = source
            if (arguments.length>1) {
                _deep = raw, _rewrite = deep
            }
        } else _source = source, _raw = raw, _deep = deep, _rewrite = rewrite

        // 拷贝
        for (let key in _raw) {

            if (typeof _raw[key] == 'object') {

                if (_raw[key] instanceof Array) {
                    _deep && _rewrite
                    ?   ( _source[key] = [] ) && ( _source[key] = this.extend(_source[key], _raw[key]) )
                    :   !_deep
                        ?   _rewrite
                            ?   _source[key] = _raw[key]
                            :   !Object.keys(_source).includes(key) && ( _source[key] = _raw[key] )
                        :   !Object.keys(_source).includes(key) && ( ( _source[key] = [] ) && ( _source[key] = this.extend(_source[key], _raw[key]) ) )
                } else {
                    _deep && _rewrite
                    ?   ( _source[key] = {} ) && ( _source[key] = this.extend(_source[key], _raw[key]) )
                    :   !_deep
                        ?   _rewrite
                            ?   _source[key] = _raw[key]
                            :   !Object.keys(_source).includes(key) && ( _source[key] = _raw[key] )
                        :   !Object.keys(_source).includes(key) && ( ( _source[key] = {} ) && ( _source[key] = this.extend(_source[key], _raw[key]) ) )
                }

            } else {
                _rewrite
                    &&  ( _source[key] = _raw[key] )
                    ||  ( !Object.keys(_source).includes(key) && ( _source[key] = _raw[key] ) )
            }

        }
        return _source
    }
}
