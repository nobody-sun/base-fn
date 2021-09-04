# 基础方法库

## `------------------ fn ------------------`
> 基础函数库

```js
import {fn} from '@wanwu/base-fn';
const {
    clone,
    merge,
    flatten,
    pick,
    omit,
    formatPrice,
    parse,
    stringify,
    stringifyUrl,
    formatTime,
    getFormatTime,
    throttle,
    debounce,
    compareVersion,
    getQueryString,
    setQueryString,
    removeQueryString,
    setCookie,
    getCookie,
    removeCookie,
    completeZero,
    getTypeof,
    typeYalidator,
    getObjDeepValue,
    ArrayRemove,
    pageInitTime,
    colorConvert,
    clientColor2webColor,
} = fn;
```

#### `clone`
> deep copy

```typescript
declare function clone(value: any): any;
```

#### `merge`
> deep merge

```typescript
declare function merge(dest?: {}, ...sources: any[]): {};
```

#### `flatten`
> 数组扁平化（1级）

```typescript
declare function flatten(array: any): any;
```

#### `pick`
> 选取对象中的值，返回选取的对象

```typescript
declare function pick(object: any, ...keys: any[]): {};
```

#### `omit`
> 删除对象中的值，返回删除之后的对象

```typescript
declare function omit(object: any, ...keys: any[]): {};
```

#### `formatPrice`
> 格式化价格，如果传入的是字符串，则原样返回，否则除以100，保留2位小数：例如 100066870 -> 1000668.70

```typescript
declare function formatPrice(price: any): string;
```

#### `parse`
>  解析query字符串，返回KV对象，比如传入a=1&b=2，返回{a:'1',b:'2'}

```typescript
declare function parse(queryString: any): {};
```

#### `stringify`
> 格式化对象，组成url的query，传入{a:'1',b:'2'}，返回a=1&b=2

```typescript
declare function stringify(url: string, params: any, encode?: boolean): string;
```

#### `stringifyUrl`
> 格式化URL，将对象拼到url上，例如 fn.stringifyUrl('https://baidu.com', {a: 1, b: 2}) -> https://baidu.com?a=1&b=2

```typescript
declare function stringifyUrl(url: string, prams: any, encode?: boolean): string;
```

#### `formatTime`
> 时间格式化（非日期），如果没有dd或者d，会将时间加到小时中，没有hh或者h，把时间加到分钟，以此类推
>
> formatTimeStamp(60, 'mm分ss秒') === 01分00秒
>
> formatTimeStamp(60, 'ss秒') === 60秒

```typescript
declare function formatTime(timeStamp: number, format?: string): string;
```

#### `throttle`
> 节流函数，保证方法至少间隔wait时间执行一次

```typescript
declare function throttle(func: any, wait: any, options: any): any;
```

#### `debounce`
> 防抖函数，保证方法在上次调用之后wait时间之后执行

```typescript
declare function debounce(func: any, wait: any, immediate: any): any;
```

#### `compareVersion`
> 语义化版本号比较（v1大于v2 -> 1; v1小于v2 -> -1; v1等于v2 -> 0; ）

```typescript
declare function compareVersion(v1: string, v2: string): 1 | 0 | -1;
```

#### `getQueryString`
> 取URL参数（name: 要获取的键值名; url: 默认为location.search）

```typescript
declare function getQueryString(name: string, url: string): string;
```

#### `setQueryString`
> 修改URL参数（uri: 要设置的链接; key: 要设置的参数; value: 要设置的值）

```typescript
declare function setQueryString(uri, key, value): string;
```

#### `removeQueryString`
> 删除URL参数（uri: 要操作的链接; key: 要删除的参数; ）

```typescript
declare function removeQueryString(uri, key): string;
```

#### `setCookie`
> 设置cookie
``` js
setCookie('__token', 'xxxxx', {expire: 1, path: '/'})
// options.expire: 过期时间，单位为天
// options.path:   cookie 存放路径
```
```typescript
declare function setCookie(name, value, options);
```

#### `getCookie`
> 取cookie

```typescript
declare function getCookie(name): string;
```

#### `removeCookie`
> 删除cookie

```typescript
declare function removeCookie(name);
```

#### `completeZero`
> 补全两位数字
``` js
completeZero(6) -> '06'
completeZero(12) -> '12'
```

```typescript
declare function completeZero(val): string;
```

#### `getFormatTime`
> 获取格式化时间
``` js
fn.getFormatTime(100000, 'dd-hh-mm') -> {"dd":"00","hh":"00","mm":"01","ss":40,"zz":"00","zzz":"000","d":0,"h":0,"m":1,"s":40,"z":0}
```

```typescript
declare function getFormatTime(leftSecond: number, format: string): string;
```

#### `getTypeof`
> 获取数据类型
> fn.getTypeof('123') -> string
> fn.getTypeof(123) -> number

```typescript
declare function getTypeof(val): string;
```

#### `typeYalidator`
> 判断js数据类型
``` js
fn.typeYalidator.isString('123') -> true
fn.typeYalidator.isInt(123) -> true
...
```

> fnName:
> isString : 判断是否是字符串
> isNumber : 判断是否是number
> isNaN : 判断是否是isNaN
> isInt : 判断是否是整型数字
> isFloat : 判断是否是浮点数字
> isBool : 判断是否是isBool
> isUndefined : 判断是否是undefined
> isNull : 判断是否是null
> isEmpty : 判断是否是空值
> isFunction : 判断是否是function
> isArray : 判断是否是数组
> isObject : 判断是否是对象

```typescript
declare function typeYalidator.<fnName>(val): boolean;
```

#### `getObjDeepValue`
> 获取对象或者数组的深值，避免空指针
``` js
fn.getObjDeepValue({a: {b: {c : 1}}}, 'a.b.c') -> 1
fn.getObjDeepValue({a: {b: {c : 1}}}, 'a.b.c.d') -> undefined
```
```typescript
declare function getObjDeepValue(obj, valuePath): any;
```

#### `ArrayRemove`
> 数组item remove方法
``` js
fn.ArrayRemove([1,2,3,4], 2) -> [1,3,4];
fn.ArrayRemove([1,2,3,4,2], 2) -> [1,3,4,2];
```
```typescript
declare function ArrayRemove(arr, item): Array;
```

#### `pageInitTime`
> 获取页面的白屏时间

```typescript
declare function pageInitTime(): number;
```

#### `colorConvert`
> 处理16进制的带有透明度的颜色格式在部分手机不支持的问题；
> **css规范建议：带有透明度的颜色格式通过 rgba的形式处理；**

> 例：(非匹配到转换条件，返回原始值)
``` js
fn.colorConvert('#7bdf0b7d')  ->  'rgba(123, 223, 11, 0.49)'d
fn.colorConvert('rgba(123, 223, 11, 0.5)')  ->  '#7bdf0b80'

fn.colorConvert('#7bdf0b')  ->  '#7bdf0b'
fn.colorConvert('rgba(123, 223, 11)')  -> 'rgba(123, 223, 11)'
```
```typescript
declare function colorConvert(): string;
```

#### `clientColor2webColor`
> 客户端的16进制的颜色格式：前两位为透明度，后面跟的六位为色码；
> web端的颜色格式格式：前六位为色码，后两位为透明度；
> **带有透明度的16进制颜色格式通过 rgba 的形式处理；**

例：(非匹配到转换条件，返回原始值)
```js
fn.clientColor2webColor('#ff7bdf0b')  ->  'rgba(123, 223, 11, 1)'
```
```typescript
declare function clientColor2webColor(): string;
```


## `------------------ ua ------------------`
> ua函数库

```js
import {ua} from '@wanwu/base-fn';
const {
    getUserAgent,
    isIOS,
    isAndroid,
    isWechat,
    isWechatMiniProgram,
    isQQ,
    isQQBrowser,
    isWeibo,
    isIPhoneX,
    getAndroidSystemVersion,
    getIosSystemVersion,
    getAndroidSystemVersionString,
    getIosSystemVersionString,
    isTikTok,
    isPC,
} = ua;
```

#### `getUserAgent`
> 用户代理头的值
> mozilla/5.0 (iphone; cpu iphone os 13_2_3 like mac os x) applewebkit/605.1.15 (khtml, like gecko) version/13.0.3 mobile/15e148 safari/604.1

```typescript
declare function getUserAgent(): string;
```

#### `getAppName`
> 获取app名称（wwdz、wwdz_b2b ...）

```typescript
declare function getAppName(): string;
```

#### `getAppVersion`
> 获取app版本号

```typescript
declare function getAppVersion(): string;
```


#### `isIOS`
> 判断是否是在IOS机

```typescript
declare function isIOS(): boolean;
```


#### `isAndroidApp`
> 判断是否是在Android的app环境中

```typescript
declare function isAndroidApp(): boolean;
```

#### `isWechat`
> 判断是否是在微信浏览器环境中

```typescript
declare function isWechat(): boolean;
```

#### `isWechatMiniProgram`
> 判断是否是在微信小程序环境中

```typescript
declare function isWechatMiniProgram(): boolean;
```

#### `isQQ`
> 判断是否是在QQ环境中

```typescript
declare function isQQ(): boolean;
```

#### `isQQBrowser`
> 判断是否是在qq浏览器环境中

```typescript
declare function isQQBrowser(): boolean;
```

#### `isWeibo`
> 判断是否是在微博环境中

```typescript
declare function isWeibo(): boolean;
```

#### `isIPhoneX`
> 是否是IPhoneX手机环境

```typescript
declare function isIPhoneX(): boolean;
```

#### `getAppPlatform`
> 获取平台类型（android，ios，xcx，h5）

```typescript
declare function getAppPlatform(): string;
```

#### `getAndroidSystemVersion`
> 获取安卓系统版本

```typescript
declare function getAndroidSystemVersion(): number;
```

#### `getIosSystemVersion`
> 获取ios系统版本

```typescript
declare function getIosSystemVersion(): number;
```

#### `getAndroidSystemVersionString`
> 获取安卓系统版本号

```typescript
declare function getAndroidSystemVersionString(): string;
```

#### `getIosSystemVersionString`
> 获取ios系统版本号

```typescript
declare function getIosSystemVersionString(): string;
```

#### `isLowVersionDevice`
> 判断低版本设备（安卓：<9； ios：<11； 其他：true）

```typescript
declare function isLowVersionDevice(): boolean;
```

#### `isTikTok`
> 是否是抖音手机环境

```typescript
declare function isTikTok(): boolean;
```

#### `isKuaiShou`
> 是否是快手手机环境

```typescript
declare function isKuaiShou(): boolean;
```

#### `isPC`
> 是否是PC环境

```typescript
declare function isPC(): boolean;
```
## `------------------ Ticker ------------------`
> 计时器

#### Basic Usage

```js
import {createTicker} from '@wanwu/base-fn';

// 设置一个全局的计时器，间隔时间为1秒
const ticker = createTicker(1000);

// 开始计时
ticker.start();
// 暂停
ticker.pause();
// 恢复
ticker.resume();

// 定时执行，类似setTimeout和clearTimeout
const timer1 = ticker.setTimeout(() => {
    // do something
});
ticker.clearTimeout(timer1);

// 循环执行，类似setInterval和clearInterval
const timer2 = ticker.setInterval(() => {
    // do something
});
ticker.clearInterval(timer2);

```

## `------------------ ImageUtils ------------------ `
> 图片CDN处理

```js
import {ImageUtils} from '@wanwu/base-fn';
const {
    checkSupportWebP,
    getSquareImage,
    getRectangleImage,
    getRectangleImageWithWidth,
    getRectangleImageWithHeight,
    getOriginImage,
    getImageWithWatermark,
    checkIsCdnUrl,
} = ImageUtils;
```

#### Basic Usage

图片处理原理，请查看[七牛云文档](https://developer.qiniu.com/dora/manual/1279/basic-processing-images-imageview2)

```js
import {ImageUtils} from '@wanwu/base-fn';
const image = 'https://cdn.wanwudezhi.com/seller-admin/image/MTU1MjU2NTU4MDczMg==.png';

ImageUtils.getSquareImage(image, 400);
// https://cdn.wanwudezhi.com/seller-admin/image/MTU1MjU2NTU4MDczMg==.png?imageView2/1/w/400/h/400/format/jpg

ImageUtils.getRectangleImageWithWidth(image, 400);
// https://cdn.wanwudezhi.com/seller-admin/image/MTU1MjU2NTU4MDczMg==.png?imageView2/2/w/400/format/jpg

ImageUtils.getRectangleImageWithHeight(image, 400);
// https://cdn.wanwudezhi.com/seller-admin/image/MTU1MjU2NTU4MDczMg==.png?imageView2/2/h/400/format/jpg

ImageUtils.getRectangleImage(image, {width: 400, height: 400, format: 'png', cut: true});
// https://cdn.wanwudezhi.com/seller-admin/image/MTU1MjU2NTU4MDczMg==.png?imageView2/1/w/400/h/400/format/png
```

#### API

```typescript
namespace ImageUtils {
    /**
     * 是否支持webp格式图片
     * @return {Boolean}
     */
    export declare function checkSupportWebP();

    /**
     * 取变成一样的图
     * @param url 图片地址
     * @param length 边长
     * @param {string} format 默认转成jpg
     * @return {string}
     */
    export declare function getSquareImage(url, length, format = 'jpg'): string;

    /**
     * 取矩形图，需要传长宽
     * @param url 图片地址
     * @param {Object} options 选项
     * @param {boolean} options.cut 是否需要裁剪
     * @param {number} options.width 宽度
     * @param {number} options.height 高度
     * @param {string} options.format 图片后缀，默认jpg
     * @return {string}
     */
    export declare function getRectangleImage(url, options): string;

    /**
     * 取矩形图，制定宽度，不裁剪
     * @param url 图片url
     * @param width 宽度
     * @param {string} format 后缀
     * @return {string}
     */
    export declare function getRectangleImageWithWidth(url, width, format = 'jpg'): string;

    /**
     * 取矩形图，制定宽度，不裁剪
     * @param url 图片url
     * @param height 高度
     * @param {string} format 后缀
     * @return {string}
     */
    export declare function getRectangleImageWithHeight(url, height, format = 'jpg'): string;

    /**
     * 获取原始图片
     * @param url 图片url
     * @param watermark 水印
     * @return {string}
     */
    export declare function getOriginImage(url, watermark = false): string;

    /**
     * 获取带水印图片
     * @param url 图片url
     * @param watermarkString 水印
     * @return {string}
     */
    export declare function getImageWithWatermark(url, watermarkString): string;

    /**
     * 是否是cdn图片
     * @param url 图片url
     * @return {Boolean}
     */
    export declare function checkIsCdnUrl(url): Boolean;
}
```

## `------------------ semaphore ------------------`
> 信号量

信号量本质上是一个非负的整数计数器，它被用来控制对公共资源的访问。信号量定义了同时有多少个进程或者任务能访问同一资源。

信号量常用于资源访问规模的控制，比如控制并行的请求的数量。

```js
import {Semaphore} from '@wanwu/base-fn';

// 新建一个10个总数的池子
const semaphore = new Semaphore(10);
```
async/await

```js
// 占用了2个
await semaphore.acquire(2);
// do something

// 释放了2个
await semaphore.release(2);
```
Promise

```js
semaphore.acquire(2).then(() => {
    // do something

    semaphore.release(2);
})
```

### CHANGELOG

