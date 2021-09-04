const hasOwnProperty = Object.prototype.hasOwnProperty;
const isArray = Array.isArray;

enum VariableTag {
    Date = '[object Date]',
    Array = '[object Array]',
    Object = '[object Object]',
}

function getTag(value: any): VariableTag {
    return Object.prototype.toString.call(value);
}


export function isPlainObject(value: any) {
    return getTag(value) === VariableTag.Object;
}

export function isString(value: any) {
    return typeof value === 'string';
}

export function isPromise(promise) {
    return promise && typeof promise.then === 'function';
}

// Shortcut function for checking if an object has a given property directly
// on itself (in other words, not on a prototype).
const has = (obj, path) => {
    if (!Array.isArray(path)) {
        return obj != null && Object.prototype.hasOwnProperty.call(obj, path);
    }
    let length = path.length;
    for (let i = 0; i < length; i++) {
        let key = path[i];
        if (obj == null || !Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
        obj = obj[key];
    }
    return !!length;
};

const isFunction = (obj) => {
    return typeof obj === 'function';
};

export const isEqualWithStack = (a, b, aStack = [], bStack = []) => {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    // 排除了a = 0, b = -0的情况，因为0 === -0，但是Infinity !== -Infinity
    if (a === b) {
        return a !== 0 || 1 / a === 1 / b;
    }
    // `null` or `undefined` only equal to itself (strict comparison).
    // null === null, undefined !== null，排除a或者b是null的情况
    if (a == null || b == null) {
        return false;
    }
    // `NaN`s are equivalent, but non-reflexive.
    // NaN是非自反的，NaN !== NaN，当a和b都是NaN时，认为他们相等
    if (a !== a && b !== b) {
        return true;
    }
    // Exhaust primitive checks
    // 如果a和b都不是function或者object，则认为他们不相等
    let typeA = typeof a;
    let typeB = typeof b;
    if (typeA !== 'function' && typeA !== 'object' && typeB != 'object') {
        return false;
    }

    // 下面开始对比对象和方法
    // Compare `[[Class]]` names.
    let classNameA = Object.prototype.toString.call(a);
    let classNameB = Object.prototype.toString.call(b);
    if (classNameA !== classNameB) {
        return false;
    }
    switch (classNameA) {
        // Strings, numbers, regular expressions, dates, and booleans are compared by value.
        case '[object RegExp]':
        // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
        case '[object String]':
            // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
            // equivalent to `new String("5")`.
            return '' + a === '' + b;
        case '[object Number]':
            // `NaN`s are equivalent, but non-reflexive.
            // Object(NaN) is equivalent to NaN.
            if (+a !== +a) return +b !== +b;
            // An `egal` comparison is performed for other numeric values.
            return +a === 0 ? 1 / +a === 1 / b : +a === +b;
        case '[object Date]':
        case '[object Boolean]':
            // Coerce dates and booleans to numeric primitive values. Dates are compared by their
            // millisecond representations. Note that invalid dates with millisecond representations
            // of `NaN` are not equivalent.
            return +a === +b;
        case '[object Symbol]':
            return Symbol.prototype.valueOf.call(a) === Symbol.prototype.valueOf.call(b);
    }

    let areArrays = classNameA === '[object Array]';
    if (!areArrays) {
        // 如果不是数组，但是ab都不是object，那ab不相等
        if (typeof a != 'object' || typeof b != 'object') return false;

        // Objects with different constructors are not equivalent, but `Object`s or `Array`s
        // from different frames are.
        // 判断对象的构造函数
        // Array.constructor === Object.constructor，{}.constructor === {}.constructor，Object.constructor === Object.constructor，Object.constructor !== {}.constructor
        let aCtor = a.constructor;
        let bCtor = b.constructor;

        // 两者的构造函数不同，并且两者都不是`Object` or `Array`
        if (aCtor !== bCtor && !(isFunction(aCtor) && aCtor instanceof aCtor && isFunction(bCtor) && bCtor instanceof bCtor) && ('constructor' in a && 'constructor' in b)) {
            return false;
        }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    // 避免循环引用，递归的时候出现死循环
    let aStackLength = aStack.length;
    let bStackLength = bStack.length;
    while (aStackLength--) {
        // Linear search. Performance is inversely proportional to the number of
        // unique nested structures.
        // 遇到循环引用，直接比较对象自身和上一级对象，发现相等，就是循环引用，直接跳出递归
        if (aStack[aStackLength] === a && bStack[aStackLength] === b) return true;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    // 遍历数组
    if (areArrays) {
        // Compare array lengths to determine if a deep comparison is necessary.
        let lengthA = a.length;
        let lengthB = b.length;
        // 数组顺序都不相等，就肯定不相等了
        if (lengthA !== lengthB) return false;
        // Deep compare the contents, ignoring non-numeric properties.
        // 递归，这递归写的真丑
        while (lengthA--) {
            if (!isEqualWithStack(a[lengthA], b[lengthA], aStack, bStack)) return false;
        }
    } else {
        // Deep compare objects.
        // 遍历对象
        let keysA = Object.keys(a);
        let keysB = Object.keys(b);

        let keysALength = keysA.length;
        let keysBLength = keysB.length;

        // Ensure that both objects contain the same number of properties before comparing deep equality.
        if (keysALength !== keysBLength) return false;
        // 递归，这递归写的真丑
        while (keysALength--) {
            // Deep compare each member
            let key = keysA[keysALength];
            if (!(has(b, key) && isEqualWithStack(a[key], b[key], aStack, bStack))) return false;
        }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
};

/**
 * 判断变量是否相等
 * @param  {any} a     需要比较的变量
 * @param  {any} b     需要比较的变量
 * @return {Boolean}   变量是否相等
 */
export const isEqual = (a, b) => {
    return isEqualWithStack(a, b);
};

/**
 * deep copy
 * @param value
 * @return {any}
 */
export function clone(value: any) {
    if (value === null) {
        return value;
    }

    if (typeof value in ['number', 'string', 'boolean', 'undefined']) {
        return value;
    }

    switch (getTag(value)) {
        case VariableTag.Date:
            return new Date(value);
        case VariableTag.Array:
            return value.map(clone);
        case VariableTag.Object:
            return merge({}, value);
        default:
            return value;
    }
}

/**
 * deep merge
 * @param {{}} dest
 * @param sources
 * @return {{}}
 */
export function merge(dest = {}, ...sources) {
    if (sources.length === 0) {
        return dest;
    }

    for (let source of sources) {
        if (source === dest) {
            continue;
        }

        if (!isPlainObject(source)) {
            continue;
        }

        for (let key in source) {
            if (hasOwnProperty.call(source, key)) {
                dest[key] = clone(source[key]);
            }
        }
    }

    return dest;
}

export function setAt(path: string, root: Object | any, data: any) {
    if (!path) {
        return;
    }

    const parts = path.replace(/\[([^\]]+)]/g, '.$1') // Replace 'x[0]' to 'x.0'
                      .split('.').map(function (part) {
            return part.replace(/['"`]/g, '');
        });
    let p = root;
    while (true) {
        const part = parts.shift();
        try {
            if (parts.length === 0) {
                p[part] = data;
                break;
            }
            p = p[part];
        } catch (err) {
            throw new Error('fail to set value on path ' + path);
        }
    }
}

/**
 * 数组扁平化
 * @param array
 * @return {any}
 */
export function flatten(array) {
    return array.reduce(function (result, item) {
        if (isArray(item)) {
            return result.concat(item);
        }
        result.push(item);
        return result;
    }, []);
}

function basePick(object, keys) {
    let picked = {};
    for (let key of keys) {
        if (hasOwnProperty.call(object, key)) {
            picked[key] = object[key];
        }
    }
    return picked;
}

/**
 * 从对象里取数据，返回取的对象
 * @param object
 * @param keys
 * @return {{}}
 */
export function pick(object, ...keys) {
    return basePick(object, flatten(keys));
}

/**
 * 从多想去除数据，返回去除之后的对象
 * @param object
 * @param keys
 * @return {{}}
 */
export function omit(object, ...keys) {
    keys = flatten(keys);
    return basePick(object, Object.keys(object).filter(function (key) {
        return keys.indexOf(key) < 0;
    }));
}

/**
 * 价格格式化
 * @param price
 * @return {string}
 */
export function formatPrice(price) {
    if (!price && price !== 0) {
        return '';
    } else if (typeof price === 'string') {
        return price;
    } else {
        return (price / 100).toFixed(2);
    }
}

export function formatPriceDrawer(price, fractionDigits: number) {
    if (!price && price !== 0) {
        return '';
    } else if (typeof price === 'string') {
        return price;
    } else {
        if (price % 100 === 0) {
            return (price / 100).toFixed(0);
        } else if (price % 10 === 0) {
            return (price / 100).toFixed(1);
        } else {
            return (price / 100).toFixed(2);
        }
    }
}

/**
 * 取原图地址
 * @param path
 * @return {any}
 */
export function getImageUrl(path) {
    if (path.indexOf('/') === 0) {
        return 'http://cdn.wanwudezhi.com' + path;
    } else {
        return path;
    }
}

/**
 * 解析query字符串，返回KV对象
 * @param queryString
 * @param decode
 * @return {{}}
 */
export function parse(queryString, decode = true) {
    let query = {};
    if (!queryString) {
        return query;
    }

    const queryArray = queryString.split('&');
    for (let queryItem of queryArray) {
        const arr = queryItem.split('=');

        if (arr.length > 1) {
            if(typeof query[arr[0]] ==='undefined'){
                query[arr[0]] = decode ? decodeURIComponent(arr[1]) : arr[1];
            }
        }
    }

    return query;
}

/**
 * 格式化对象，组成url的query，key=value&key1=value1
 * @param params
 * @param {boolean} encode
 * @return {string}
 */
export function stringify(params, encode = true) {
    if (!params) {
        return '';
    }
    return Object.keys(params).map((key) => {
        const value = params[key];
        return stringifyKV(key, value, encode);
    }).filter((image) => {
        return image !== '';
    }).join('&');
}

function stringifyKV(key, value, encode) {

    if (typeof value === 'undefined') {
        return '';
    }
    if (value === null) {
        return '';
    }
    if (typeof value === 'string') {
        value = encode ? encodeURIComponent(value) : value;
    }
    return key + '=' + value;
}

/**
 * 格式化URL，将对象拼到url上
 * @param url
 * @param params
 * @param {boolean} encode
 * @return {string}
 */
export function stringifyUrl(url: string, params = {}, encode = true): string {
    // 从url取的数据，一定需要decode
    const parsedUrl = parseUrl(url, params, true);
    const path = parsedUrl.path;
    const mergedParams = parsedUrl.params;

    if (Object.keys(mergedParams).length === 0) {
        return path;
    } else {
        return path + '?' + stringify(mergedParams, encode);
    }
}

export function parseUrl(url: string, params = {}, decode = true): { path: string, params: any ,hash: string } {
    const baseUrlArr = url.split('#')
    url = baseUrlArr[0];
    const hash = baseUrlArr[1]
    const arr = url.split('?');
    const path = arr[0];

    if (arr.length > 0) {
        params = Object.assign({}, parse(arr[1], decode), params);
    }
    return { path, params, hash };
}

/**
 * @desc 获取链接参数的值
 * @param  {string} name - 参数名字
 * @param  {string} [url] - 链接url，为空的时候取location.search
 * @return {string} 参数
 */
export function getQueryString(name: string, url: string = location.search) {
    if (!name) return '';
    url = url.split('#')[0];

    const reg = new RegExp('(^|\\?|&)' + name + '=([^&]*)(&|$)', 'i');
    const matches = url.match(reg);
    if (matches) {
        return decodeURIComponent(matches[2]);
    }
    return reg.test(url) ? RegExp.$2.replace(/\+/g, ' ') : '';
}

/**
 * 设置链接参数
 * @param uri 要设置的链接
 * @param key 要设置的参数 key
 * @param value 要设置的值 value
 */
export function setQueryString(uri: string, key: string, value: any) {
    const re = new RegExp('([?&])' + key + '=.*?(&|#|$)', 'i');
    const separator = uri.indexOf('?') !== -1 ? '&' : '?';
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + '=' + value + '$2');
    } else {
        return uri + separator + key + '=' + value;
    }
}

/**
 * 删除链接参数
 * @param uri
 * @param key
 */
export function removeQueryString(uri: string, key: string) {
    const re = new RegExp('([?&])' + key + '=.*?(&|#|$)', 'i');
    const separator = uri.indexOf('?') !== -1 ? '&' : '?';
    let uriRes = uri;

    while (uriRes.match(re)) {
        if (RegExp.$1 === '&') {
            uriRes = uriRes.replace(re, '$2');
        } else {
            uriRes = uriRes.replace(re, '$1');
        }
    }
    return uriRes;
}

/**
 * 设置 cookie
 *
 * demo: M.setCookie('_ccna', 2, {expire: 1, path: '/'});
 * @desc 设置cookie值，只能设置二级域名，过期时间最多一天
 * @param {string} name - cookie name
 * @param {string} value - cookie value
 * @param {object} options
 *          options.expire: 过期时间，单位为天
 *          options.path:   cookie 存放路径
 */
export function setCookie(name, value, options: any = {}) {
    if (value === null || typeof value === 'undefined') {
        value = '';
        options.expires = -1;
    }
    let expires = '';
    if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
        let date = new Date();
        const dayTimes = 86400000
        let times = date.getTime() + dayTimes;
        if(options.expires.getTime){
            times = options.expires.getTime()
        }else if (Number(options.expires)) {
            //清除cookie
            times = date.getTime() + options.expires * dayTimes;
        }
        date.setTime(times);
        expires = '; expires=' + date;
    }
    let path = options.path ? '; path=' + (options.path) : '';
    let secure = options.secure ? '; secure' : '';
    let domain = '';
    //用户只能设置二级域名
    if (options.domain && options.domain.toString().split('.').length >= 3) {
        domain = '; domain=' + (options.domain);
    } else {
        domain = '; domain=' + document.domain.toString();
    }
    document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
}

/**
 * 获取 cookie 值, 如果 cookie 取不到，返回 '';
 * @param  {string} name - cookie name
 * @return {string} cookie value
 */
export function getCookie(name) {
    const arr = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'));
    if (arr !== null) return decodeURIComponent(arr[2]);
    return '';
}

/**
 * 删除 cookie
 */
export function removeCookie(name, options?: any) {
    options = options || {};
    options.expires = -1;
    this.setCookie(name, null, options);
}

/**
 * 补全数字
 * @param  {Number} val 数字
 * @return {String}     数字字符串
 */
function completeZero(val) {
    return val < 10 ? `0${val}` : val;
}

/**
 * 获取格式化时间
 * @param  {Number} leftSecond 剩余时间
 * @param  {String} format      格式
 * @return {Object}             格式化映射对象
 */
export function getFormatTime(leftSecond: number, format: string) {
    let z = leftSecond % 1000;
    leftSecond = Math.floor(leftSecond / 1000);
    let d = Math.floor(leftSecond / (60 * 60 * 24));
    let h = Math.floor((leftSecond - d * 24 * 60 * 60) / 3600);
    let m = Math.floor((leftSecond - (d * 24 * 60 + h * 60) * 60) / 60);
    let s = Math.floor(leftSecond - (d * 24 * 60 + h * 60 + m) * 60);

    if (leftSecond >= 86400 && format.indexOf('d') === -1) {
        h += d * 24;
    }

    if (leftSecond >= 3600 && format.indexOf('h') === -1) {
        m += h * 60;
    }

    if (leftSecond >= 60 && format.indexOf('m') === -1) {
        s += m * 60;
    }

    return {
        dd: completeZero(d),
        hh: completeZero(h),
        mm: completeZero(m),
        ss: completeZero(s),
        zz: completeZero(z),
        zzz: z < 100 ? '0' + completeZero(z) : z,
        d,
        h,
        m,
        s,
        z,
    };
}

/**
 * 时间格式化（非日期），如果没雨dd或者d，会将时间加到小时中，没有hh或者h，把时间加到分钟，以此类推
 * @param  {Number} timeStamp 时间
 * @param  {String} format    格式
 * @return {[type]}
 * @example   formatTimeStamp(60, 'mm分ss秒') === 01分00秒
 * @example   formatTimeStamp(60, 'ss秒') === 60秒
 */
export function formatTime(timeStamp, format = 'dd hh:mm:ss') {

    const timeObj = getFormatTime(timeStamp, format);

    return format.replace(/([a-z])(\1)*/ig, (m) => {
        return timeObj[m];
    });
}

export function getFormatTimeArray(timeStamp, format = 'dd hh:mm:ss') {
    const timeObj = getFormatTime(timeStamp, format);
    return format.match(/[\u4e00-\u9fa5]+|[^a-zA-Z]|([a-z])(\1)?/g).map((item) => {
        if (/([a-z])(\1)?/.test(item)) {
            return {
                value: timeObj[item],
                type: 'number',
            };
        } else {
            return {
                value: item,
                type: 'symbol',
            };
        }
    });
}

function apply(func, thisArg, args) {
    if (typeof args === 'undefined') {
        return func.call(thisArg);
    }
    switch (args.length) {
        case 0:
            return func.call(thisArg);
        case 1:
            return func.call(thisArg, args[0]);
        case 2:
            return func.call(thisArg, args[0], args[1]);
        case 3:
            return func.call(thisArg, args[0], args[1], args[2]);
        default:
            return func.apply(thisArg, args);
    }
}

/**
 * 节流函数，保证方法至少间隔wait时间执行一次
 * @param {(...args: any[]) => any} func
 * @param {number} wait
 * @param {{leading?: boolean; trailing?: boolean}} options
 * @return {(...args: any[]) => any}
 */
export function throttle(func, wait, options) {
    if (options === void 0) {
        options = {};
    }
    let context;
    let args;
    let result;
    let timeout = null;
    let previous = 0;
    let later = function () {
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        result = apply(func, context, args);
        if (!timeout) {
            context = args = null;
        }
    };
    let throttled: any = function () {
        let now = Date.now();
        if (!previous && options.leading === false) {
            previous = now;
        }
        let remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            /**
             * when client time is set forward, remaining may be negative
             * while timeout is not null
             */
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = apply(func, context, args);
            /**
             * fix throttle and debounce to be re-entrant #1629
             * @see {@link https://github.com/jashkenas/underscore/pull/1629}
             */
            if (!timeout) {
                context = args = null;
            }
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
    throttled.cancel = function () {
        clearTimeout(timeout);
        previous = 0;
        timeout = context = args = null;
    };
    return throttled;
}

/**
 * 防抖函数，保证方法在上次调用之后wait时间之后执行
 * @param {(...args: any[]) => any} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {(...args: any[]) => any}
 */
export function debounce(func, wait, immediate) {
    let timeout;
    let args;
    let context;
    let timestamp;
    let result;
    let later = function () {
        let last = Date.now() - timestamp;
        if (last < wait && last > 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;
            if (!immediate) {
                result = func.apply(context, args);
                if (!timeout) {
                    context = args = null;
                }
            }
        }
    };
    let debounced: any = function () {
        context = this;
        args = arguments;
        timestamp = Date.now();
        let callNow = immediate && !timeout;
        if (!timeout) {
            timeout = setTimeout(later, wait);
        }
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }
        return result;
    };
    debounced.cancel = function () {
        clearTimeout(timeout);
        timeout = null;
    };
    return debounced;
}

/**
 * 语义化版本号比较
 * @param {string} v1
 * @param {string} v2
 * @return {number}
 */
export function compareVersion(v1: string, v2: string) {
    if (!v1 || !v2) {
        return -1;
    }
    const v1Arr = v1.split('.');
    const v2Arr = v2.split('.');
    const len = Math.max(v1Arr.length, v1Arr.length);

    while (v1Arr.length < len) {
        v1Arr.push('0');
    }
    while (v2Arr.length < len) {
        v2Arr.push('0');
    }

    for (let i = 0; i < len; i++) {
        const num1 = parseInt(v1Arr[i]);
        const num2 = parseInt(v2Arr[i]);

        if (num1 > num2) {
            return 1;
        } else if (num1 < num2) {
            return -1;
        }
    }

    return 0;
}

export function getDebugCode() {
    let today = new Date();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    let digit = day % 10;
    let tmp = Math.floor(month / 10);
    let code = '' + (tmp + digit + 7) % 10;

    tmp = month % 10;
    code = code + (tmp + digit + 7) % 10;
    tmp = Math.floor(day / 10);
    code = code + (tmp + digit + 7) % 10;
    tmp = day % 10;
    code = code + (tmp + digit + 7) % 10;

    return code;
}

export function filter(data: object | any[], filterCallback: (item: any, key?: string | number) => boolean) {
    if(isArray(data)) {
        return Array.prototype.filter.call(data, filterCallback);
    } else {
        const result = {};
        for (let key of Object.keys(data)) {
            const value = data[key];
            if (filterCallback.call(null, value, key)) {
                result[key] = value;
            }
        }
        return result;
    }
}
export function getTypeof(obj){
    switch(obj){
        case null:
            return "null";
        case undefined:
            return "undefined";
    }
    var s=Object.prototype.toString.call(obj);
    switch(s){
        case "[object String]":
            return "string";
        case "[object Number]":
            return "number";
        case "[object Boolean]":
            return "boolean";
        case "[object Array]":
            return "array";
        case "[object Date]":
            return "date";
        case "[object Function]":
            return "function";
        case "[object RegExp]":
            return "regExp";
        case "[object Object]":
            return "object";
        default:
            return "object";
    }
}
/**
 * 判断各种js数据类型
 */
export const typeYalidator ={

    /**
     * 判断是否是整形数字
     * @param value
     * @returns {boolean}
     */
    isInt(value) {
        value = value < 0 ? Math.abs(value) : value;
        return this.isNumber(value) && value % 1 === 0;
    },

    /**
     * 判断是否浮点型数字
     * @param value
     * @returns {boolean}
     */
    isFloat(value) {
        value = value < 0 ? Math.abs(value) : value;
        return this.isNumber(value) && value % 1 !== 0;
    },

    /**
     * 判断是否是 undefined
     * @param value
     * @returns {boolean}
     */
    isUndefined(value) {
        return typeof value === "undefined";
    },

    /**
     * 判读是否是function
     * @param value
     * @returns {boolean}
     */
    isFunction(value) {
        return typeof value === "function";
    },

    /**
     * 判断是否是数组
     * @param value
     * @returns {boolean}
     */
    isArray(value) {
        return Object.prototype.toString.call(value) === '[object Array]';
    },

    /**
     * 判断是否是对象
     * @param value
     * @returns {boolean}
     */
    isObject(value) {
        return Object.prototype.toString.call(value) === '[object Object]';
    },

    /**
     * 判断是否是null
     * @param value
     * @returns {boolean}
     */
    isNull(value) {
        return Object.prototype.toString.call(value) === '[object Null]';
    },


    /**
     * 判断值是否为空
     * @param value
     * @return {boolean}
     */
    isEmpty(value) {
        if (this.isObject(value) || this.isArray(value)) {
            return Object.keys(value).length === 0;
        }
        return value === "" || this.isNaN(value) || this.isUndefined(value) || this.isNull(value);
    },

};
/**
 *  获取对象或者数组的深值，避免空指针
 * @param obj 对象
 * @param valuePath exa:'detail.0.0' 对象值得路径
 */
export const getObjDeepValue = function (obj, valuePath) {
    if(/(undefind|null)/.test(getTypeof(obj))){
        return undefined;
    }
    const valuePathArr = valuePath.split('.');
    let curValue = obj;
    for (let pathItem of valuePathArr) {
        curValue = curValue[pathItem];
        if (!curValue) {
            return undefined;
        }
    }
    return curValue;
};

/**
 * 数组item remove方法
 * @param {Array} arr
 * @param {*} item [数组要删除的item]
 */
export const ArrayRemove = function (arr, item) {
    if (!arr.length) return [];
    var index = arr.indexOf(item);
    if (index > -1) {
        arr.splice(index, 1);
        return arr;
    }
    return arr;
};



/**
 * 新增计算页面白屏时间方法 
 */
export const pageInitTime = function () {
    // 在不支持getEntriesByType()的情况下，使用timing
    let whiteScreenTime = performance.timing.domInteractive - performance.timing.navigationStart
    // 支持getEntriesByType()，没有domLoading时机，所以实用domInteractive
    if (performance.getEntriesByType && performance.getEntriesByType('paint').length) {
        const paintList = performance.getEntriesByType('paint')
        paintList.map((item) => {
            if (item.name === 'first-contentful-paint') {
               whiteScreenTime = item.startTime
            }
        })
    }
    return whiteScreenTime;
};

// 16进制颜色和rgba互换
// 处理16进制的带有透明度的颜色格式在部分手机不支持的问题；
// css规范建议：带有透明度的16进制颜色格式通过 rgba 的形式处理；
export const colorConvert = function(color) {
    if(typeof color !=='string') return color;
    let r;
    let g;
    let b;
    let a;
    if (color.startsWith('#') && color.length === 9) {
        r = parseInt(color[1] + color[2], 16);
        g = parseInt(color[3] + color[4], 16);
        b = parseInt(color[5] + color[6], 16);
        a = parseFloat((parseInt(color[7] + color[8], 16) / 255).toFixed(2));
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    } else if (color.startsWith('rgba')) {
        const pColor = color.match(/(\d(\.\d+)?)+/g);
        if (pColor.length !== 4) { return color; }

        r = Number(pColor[0]).toString(16);
        g = Number(pColor[1]).toString(16);
        b = Number(pColor[2]).toString(16);
        a = Number(Math.round(Number(pColor[3]) * 255)).toString(16);
        r = r.length === 2 ? r : '0' + r;
        g = g.length === 2 ? g : '0' + g;
        b = b.length === 2 ? b : '0' + b;
        a = a.length === 2 ? a : '0' + a;
        return '#' + r + g + b + a;
    } else {
        return color;
    }
};
