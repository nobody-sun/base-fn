import PromiseResolve from "./PromiseResolve";
import PromiseReject from "./PromiseReject";

export default interface PromiseCallback<T> {
    resolve: PromiseResolve<T>;
    reject: PromiseReject;
    permits?: number;
}
