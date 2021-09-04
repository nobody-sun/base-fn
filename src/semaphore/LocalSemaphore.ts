import {DEFAULT_LOCKER_NAME} from "./Canstant";
import AbstractSemaphore from "./AbstractSemaphore";


/**
 * 单实例信号量
 * 用实例变量来维持permits的数量
 */
export default class LocalSemaphore extends AbstractSemaphore {

    private readonly permits: number;
    private leftPermits: number;

    constructor(permits: number, name: string = DEFAULT_LOCKER_NAME, fair: boolean = false) {
        super(name, fair);
        this.permits = permits;
        this.leftPermits = permits;
    }

    protected doAcquire(permits: number): Promise<boolean> {
        if (this.leftPermits >= permits) {
            this.leftPermits = this.leftPermits - permits;
            // @ts-ignore
            return Promise.resolve(true);
        } else {
            // @ts-ignore
            return Promise.resolve(false);
        }
    }

    protected doRelease(permits: number): Promise<boolean> {
        this.leftPermits += permits;
        // @ts-ignore
        return Promise.resolve(true);
    }
}
