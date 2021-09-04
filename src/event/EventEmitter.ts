interface ListenerFunction {
    (...args: any[]): any
}

interface Events {
    [key: string]: ListenerFunction[]
}

export default class EventEmitter {
    protected _events: Events

    constructor() {
        this._events = Object.create(null)
    }

    public $on(event: string, callback: ListenerFunction): this {
        if (!this._events[event]) {
            this._events[event] = []
        }

        this._events[event].push(callback)
        return this
    }

    public $once(event: string, callback: ListenerFunction): this {
        const on = (...args) => {
            this.$off(event, on)

            callback.apply(this, args)
        }

        return this.$on(event, on)
    }

    public $off(event: string, callback: ListenerFunction): this {
        if (arguments.length === 0) {
            this._events = Object.create(null)
            return this
        }

        const callbacks = this._events[event]
        if (!callbacks) {
            return this
        }

        if (arguments.length === 1) {
            this._events[event] = null
            return
        }

        for (let i = callbacks.length - 1; i >= 0; i--) {
            if (callbacks[i] === callback) {
                callbacks.splice(i, 1)
                break
            }
        }
        return this
    }

    public $clear(): this {
        this._events = Object.create(null)
        return this
    }

    public $emit(event: string, ...args: any[]): this {
        const callbacks = this._events[event]
        if (callbacks) {
            for (let i = 0, len = callbacks.length; i < len; i++) {
                try {
                    callbacks[i].apply(this, args)
                } catch (error) {
                    console.error('fail to execute event handler of', event, error.stack)
                }
            }
        }
        return this
    }
}
