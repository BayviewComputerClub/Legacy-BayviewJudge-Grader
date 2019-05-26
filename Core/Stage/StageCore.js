// Step 3, Stage the input code.
const fs = require("fs");
const { spawn, exec } = require('child_process');

function stageSubmission(submissionRequest, callback) {
    // Write the submission to a file.
    switch(submissionRequest.lang) {
        case "c++":
            chmodCppFile(submissionRequest, (result) => {
                callback(result);
                return;
            });
            break;
        case "java":
            // There is nothing to do here.
            callback(true);
            return;
            break;
        case "python":
            // There is nothing to do here.
            callback(true);
            return;
            break;
    }
}

function chmodCppFile(submissionRequest, callback) {
    let directory = './tmp/' + submissionRequest.userID + '/' + submissionRequest.problemID + '/source.out';

    // Create directory first.
    exec('chmod +x ' + directory, (err, stdout, stderr) => {
        if (err) {
            console.log('chmod compile ERROR' +err);

        }
        callback(true);
    });

}

module.exports = {
    stageSubmission: stageSubmission
};