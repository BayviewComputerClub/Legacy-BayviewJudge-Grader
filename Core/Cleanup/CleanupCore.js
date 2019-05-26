const fs = require("fs");
const { spawn, exec } = require('child_process');
var rimraf = require("rimraf");

function cleanupSubmission(submissionRequest, callback) {
    // Write the submission to a file.
    switch(submissionRequest.lang) {
        case "c++":
            cleanupCppFile(submissionRequest, (result) => {
                callback(result);
                return;
            });
            break;
        case "java":
            cleanupCppFile(submissionRequest, (result) => {
                callback(result);
                return;
            });
            break;
        case "python":
            /*cleanupCppFile(submissionRequest, (result) => {
                callback(result);
                return;
            });*/
            callback(true);
            break;


    }
}

function cleanupCppFile(submissionRequest, callback) {
    let directory = './tmp/' + submissionRequest.userID + '/' + submissionRequest.problemID;

    rimraf(directory, (err) => {
        if (err) throw err;
        callback(true);
    });


}

module.exports = {
    cleanupSubmission: cleanupSubmission
};