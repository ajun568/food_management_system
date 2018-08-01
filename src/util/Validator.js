export default class Validator {
  /**
   * 空字符串验证
   */
   static trim = (rule, value, callback) => {
    if(value.replace(/^\s+/, "").replace(/\s+$/, "") === '') {
      return callback(new Error('输入不能为空'));
    }
    callback();
   }

  /**
   * 数组不能为空
   */
   static requiredArray = (rule, value, callback) => {
    if (value.length == 0) {
        return callback(new Error('类型不正确'));
    }
    callback();
    }

    /**
     * 浮点数字的判断
     */
    static float = (rule, value, callback) => {
        if (isNaN(value) || value === '') {
            return callback(new Error('类型不正确'));
        }
        callback();
    }

    /**
     * 整数类型的判断
     */
    static int = (rule, value, callback) => {
        var value = '' + value
        var re = /^[0-9]*[1-9][0-9]*$/;
        if (!re.test(value) && value != '0' || value == '') {
            return callback(new Error('类型不正确'));
        }
        callback();
    }


	 /**
   * 手机号验证
   */
  static strictMobile = (rule, value, callback) => {
    value == '' &&
        callback(new Error('请输入手机号码'));
    !(/^1[3|4|5|7|8][0-9]{9}$/.test(value)) &&
    callback(new Error('请输入11位数字'));
    callback();
	}
}