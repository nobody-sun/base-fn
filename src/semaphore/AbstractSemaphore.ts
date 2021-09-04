import BaseLock from './BaseLock';
import InterfaceSemaphore from './InterfaceSemaphore';
import { DEFAULT_LOCKER_NAME } from './Canstant';
import PromiseResolve from './PromiseResolve';
import PromiseReject from './PromiseReject';

export default abstract class AbstractSemaphore extends BaseLock implements InterfaceSemaphore {
    private readonly fair: boolean;
    protected readonly name: string;


    protected constructor(name: string = DEFAULT_LOCKER_NAME, fair: boolean = false) {
        super();
        this.fair = fair;
        this.name = name;
    }

    public acquire(permits: number = 1, index: number = -1): Promise<boolean> {
        // @ts-ignore
        return new Promise((resolve, reject) => {

            if (this.fair) {
                this.insertTask({ resolve, reject, permits }, index);
                this.executeTaskQueue();
            } else {
                this.acquireUnfair(permits, resolve, reject, index);
            }
        });
    }

    private acquireUnfair(permits: number, resolve: PromiseResolve<boolean>, reject: PromiseReject, index: number) {
        this.doAcquire(permits).then((success) => {
            if (success) {
                resolve(true);
            } else {
                this.insertTask({ resolve, reject, permits }, index);
                // this.executeTaskQueue();
            }
        }).catch((error) => {
            reject(error);
        });
    }

    protected abstract doAcquire(permits: number): Promise<boolean>;

    protected abstract doRelease(permits: number): Promise<boolean>;

    public release(permits: number = 1): Promise<boolean> {
        return this.doRelease(permits).then(() => {
            this.executeTaskQueue();
            return true;
        });
    }

    public tryAcquire(permits: number = 1, timeout?: number): Promise<boolean> {
        // @ts-ignore
        return new Promise(async (resolve, reject) => {
            try {
                if (timeout > 0) {
                    let endTime = new Date().getTime() + timeout;
                    let success = false;
                    // 期间一直重试
                    do {
                        success = await this.doAcquire(permits);
                    } while (new Date().getTime() <= endTime && !success);
                    resolve(success);
                } else {
                    resolve(await this.doAcquire(permits));
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    private executeTaskQueue() {
        // 按序执行之前缓存的任务
        if (this.getTaskLength() > 0) {
            const { resolve, reject, permits } = this.shiftTask();
            this.acquireUnfair(permits, resolve, reject, 0);
        }
    }

}
