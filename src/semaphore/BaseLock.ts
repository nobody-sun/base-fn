import PromiseCallback from "./PromiseCallback";

export default class BaseLock {

    protected readonly taskQueue: PromiseCallback<boolean>[] = [];

    protected insertTask(promiseCallback: PromiseCallback<boolean>, index: number): void {
        if (index > -1 && index < this.getTaskLength()) {
            this.taskQueue.splice(index, 0, promiseCallback);
        } else {
            this.pushTask(promiseCallback);
        }
    }

    protected pushTask(promiseCallback: PromiseCallback<boolean>): void {
        this.taskQueue.push(promiseCallback);
    }

    protected shiftTask(): PromiseCallback<boolean> | undefined {
        return this.taskQueue.shift();
    }

    protected getTaskLength(): number{
        return this.taskQueue.length;
    }

}
