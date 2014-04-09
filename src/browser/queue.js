window.csscritic = window.csscritic || {};

window.csscritic.queue = (function () {
    var module = {};

    var jobQueue = [],
        busy = false;

    var nextInQueue = function () {
        var func;
        if (jobQueue.length > 0) {
            busy = true;
            func = jobQueue.shift();
            func(nextInQueue);
        } else {
            busy = false;
        }
    };

    module.execute = function (func) {
        jobQueue.push(func);
        if (!busy) {
            nextInQueue();
        }
    };

    module.clear = function () {
        jobQueue = [];
        busy = false;
    };

    return module;
}());