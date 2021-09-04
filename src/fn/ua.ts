export function getUserAgent() {
    return navigator.userAgent.toLowerCase()
}

let isIOSCache = null
export function isIOS() {
    if (isIOSCache === null) {
        isIOSCache = /iphone|ipad|ipod/.test(getUserAgent())
    }
    return isIOSCache
}

let isAndroidCache = null
export function isAndroid() {
    if (isAndroidCache === null) {
        isAndroidCache = getUserAgent().indexOf('android') > -1
    }
    return isAndroidCache
}

let isPCCache = null
export function isPC() {
    if (isPCCache === null) {
        isPCCache = !/iphone|ipad|ipod|android|blackberry|iemobile|harmonyos/.test(getUserAgent())
    }
    return isPCCache
}

export function isWechat() {
    return getUserAgent().indexOf('micromessenger') > -1
}

export function isTieba() {
    return getUserAgent().indexOf('tieba') > -1
}

// 抖音环境判断
export function isTikTok() {
    return getUserAgent().indexOf('aweme') > -1
}

// 快手环境判断
export function isKuaiShou() {
    return getUserAgent().indexOf('KsWebView') > -1
}

export function isIPhoneX() {
    const screen = window.screen
    return (
        isIOS() &&
        ((screen.height == 812 && screen.width == 375) ||
            (screen.height == 896 && screen.width == 414) ||
            (screen.height == 844 && screen.width == 390))
    )
}

export function isWechatMiniProgram() {
    return isWechat() && getUserAgent().indexOf('miniprogram') > -1
}

export function isQQ() {
    return getUserAgent().indexOf('qq') > -1
}

export function isQQBrowser() {
    return getUserAgent().indexOf('mqqbrowser') > -1
}

export function isWeibo() {
    return getUserAgent().indexOf('weibo') > -1
}

export function getAndroidSystemVersion() {
    return (
        getAndroidSystemVersionString() && parseInt(getAndroidSystemVersionString().split('.')[0])
    )
}

export function getIosSystemVersion() {
    return getIosSystemVersionString() && parseInt(getIosSystemVersionString().split('.')[0])
}

export function getIosSystemVersionString() {
    const reg = /os [\d._]+/gi
    return (
        isIOS() &&
        getUserAgent()
            .match(reg)
            .toString()
            .replace(/[^0-9|_.]/gi, '')
            .replace(/_/gi, '.')
    )
}

export function getAndroidSystemVersionString() {
    const reg = /android [\d._]+/gi
    return (
        isAndroid() &&
        getUserAgent()
            .match(reg)
            .toString()
            .replace(/[^0-9|_.]/gi, '')
            .replace(/_/gi, '.')
    )
}

let isLowVersionIOSCache = null
export function isLowVersionIOS() {
    if (isLowVersionIOSCache === null) {
        isLowVersionIOSCache = getIosSystemVersion() < 11
    }
    return isLowVersionIOSCache
}

let isLowVersionAndroidCache = null
export function isLowVersionAndroid() {
    if (isLowVersionAndroidCache === null) {
        isLowVersionAndroidCache = getAndroidSystemVersion() < 9
    }
    return isLowVersionAndroidCache
}

// 判断低版本设备 (非安卓/IOS系统会返回true)
export function isLowVersionDevice() {
    if (isIOS()) {
        return isLowVersionIOS()
    }
    if (isAndroid()) {
        return isLowVersionAndroid()
    }
    return true
}
