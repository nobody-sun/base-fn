export default interface PromiseResolve<T> {
    (value?: T | PromiseLike<T>): void;
}
