const GlobalTickerCache = {}

export class Ticker {
    private readonly fps: number
    private timer = null
    private startTime
    private lastTime
    private timeoutCallbacks = Object.create(null)
    private intervalCallbacks = Object.create(null)
    private count = 0
    private timerId = 0
    private isRun = false

    constructor(fps) {
        this.fps = fps
    }

    /**
     * 开始计时
     */
    public start() {
        this.startTime = new Date().getTime()
        this.count = 0
        this.isRun = true
        this.execute()
    }

    /**
     * 暂停
     */
    public pause() {
        clearTimeout(this.timer)
        this.isRun = false
    }

    /**
     * 停止
     */
    public stop() {
        clearTimeout(this.timer)
        this.isRun = false
    }

    /**
     * 恢复
     */
    public resume() {
        this.start()
    }

    /**
     * 清除所有任务
     */
    public clear() {
        this.timeoutCallbacks = Object.create(null)
        this.intervalCallbacks = Object.create(null)
    }

    /**
     * 定时执行，只执行一次
     * @param callback
     * @return {number}
     */
    public setTimeout(callback) {
        this.timeoutCallbacks[++this.timerId] = callback
        return this.timerId
    }

    /**
     * 定时执行，会重复执行
     * @param callback
     * @return {number}
     */
    public setInterval(callback) {
        this.intervalCallbacks[++this.timerId] = callback
        return this.timerId
    }

    /**
     * 移除定时器
     * @param timerId
     */
    public clearTimeout(timerId) {
        delete this.timeoutCallbacks[timerId]
    }

    /**
     * 移除定时器
     * @param timerId
     */
    public clearInterval(timerId) {
        delete this.intervalCallbacks[timerId]
    }

    private execute() {
        clearTimeout(this.timer)
        this.tick()
        if (this.isRun) {
            this.lastTime = new Date().getTime()
            const nextFps = this.startTime + ++this.count * this.fps - this.lastTime
            this.timer = setTimeout(this.execute.bind(this), nextFps)
        }
    }

    private tick() {
        // 遍历timeout
        for (let timerId of Object.keys(this.timeoutCallbacks)) {
            const callback = this.timeoutCallbacks[timerId]
            try {
                typeof callback === 'function' && callback()
            } catch (error) {
                console.error(error)
            }
            delete this.timeoutCallbacks[timerId]
        }

        // 遍历interval
        for (let timerId of Object.keys(this.intervalCallbacks)) {
            const callback = this.intervalCallbacks[timerId]
            try {
                typeof callback === 'function' && callback()
            } catch (error) {
                console.error(error)
            }
        }
    }
}

export function createTicker(fps: number = 1000) {
    let ticker: Ticker = GlobalTickerCache[fps]
    if (!ticker) {
        ticker = new Ticker(fps)
        GlobalTickerCache[fps] = ticker
    }

    ticker.start()

    return ticker
}
