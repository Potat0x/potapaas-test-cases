sleep = (milliseconds) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve(), milliseconds);
    });
};

describe("test", function () {
    it("test pass with delay", function () {
        return sleep(2000);
    });
});
