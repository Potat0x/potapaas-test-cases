sleep = (milliseconds) => {
    return new Promise((resolve, reject) => {
        setTimeout(reject(new Error(`rejected after ${milliseconds} ms`)), milliseconds);
    });
};

describe("test", function () {
    it("test fail with delay", function () {
        return sleep(2000);
    });
});
