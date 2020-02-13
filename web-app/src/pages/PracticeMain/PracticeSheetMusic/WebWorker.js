export default class WebWorker {
    constructor(worker) {
        let code = worker;//worker.toString();
        //code = "() => " + code.substring(code.indexOf("{"), code.length);
        const blob = new Blob(['('+code+')()']);
        return new Worker(URL.createObjectURL(blob));
    }
}