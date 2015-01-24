describe("Workarounds", function () {
    "use strict";

    var main, reporting;

    var aOnceAutoAcceptingReporter = function () {
            var onceAutoAcceptingReporterCalled = false;
            return {
                reportComparison: function (result) {
                    if (!onceAutoAcceptingReporterCalled) {
                        onceAutoAcceptingReporterCalled = true;
                        result.acceptPage();
                    }
                }
            };
        };

    beforeEach(function () {
        var util = csscriticLib.util(),
            browserRenderer = csscriticLib.browserRenderer(util, csscriticLib.jobQueue, rasterizeHTML),
            domstorage = csscriticLib.domstorage(util, localStorage),
            regression = csscriticLib.regression(browserRenderer, util, imagediff);

        reporting = csscriticLib.reporting(browserRenderer, domstorage, util);

        main = csscriticLib.main(
            regression,
            reporting,
            util,
            domstorage);
    });

    afterEach(function () {
        localStorage.clear();
    });

    ifNotInWebkitIt("should work around transparency making pages non-comparable", function (done) {
        // Create reference image first
        reporting.addReporter(aOnceAutoAcceptingReporter());
        main.add({url: testHelper.fixture("transparencyBug.html")});
        main.execute().then(function () {

            // Now test against the reference
            main.add({url: testHelper.fixture("transparencyBug.html")});
            main.execute().then(function (passed) {
                expect(passed).toBe(true);

                done();
            });
        });
    });
});