/**
 * 信号量
 */
export default interface InterfaceSemaphore {

    /**
     * 需要指定总资源数量，也就是同时有几项任务能同时进行
     */
    // new (permits: number, fair?: boolean): any;

    /**
     * 获取资源
     */
    acquire(permits?: number): Promise<boolean>;

    /**
     * 获取资源，中断等待中的任务，进程中断之后，会throw error
     * 貌似不需要
     */
    // acquireUninterruptibly(permits?: number): void;

    /**
     * 尝试获取资源，如果成功，return true
     * 失败，return false
     */
    tryAcquire(permits?: number, timeout?: number): Promise<boolean>;

    /**
     * 释放资源
     */
    release(permits?: number, timeout?: number): Promise<boolean>;
}
