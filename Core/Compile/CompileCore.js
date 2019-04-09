// BayviewJudge Submission Compiling Core

const { spawn, exec } = require('child_process');

function compileSubmission(submissionRequest, callback) {

    switch(submissionRequest.lang) {
        case "c++":
            compileCppSubmission(submissionRequest, (result) => {
                callback(result);
                return;
            });
            break;
    }
}

function compileCppSubmission(submissionRequest, callback) {
    // Command Definitions
    let directory = './tmp/' + submissionRequest.userID + '/' + submissionRequest.problemID;
    let compileCommand = 'g++ ' + directory + '/source.cpp -o ' + directory + '/source.out';

    exec(compileCommand, (err, stdout, stderr) => {
        if (err) {
            console.log('File compile ERROR ' + err);
            callback(false);
            return;
        }
        callback(true);
        return;
    });
}

module.exports = {
    compileSubmission: compileSubmission
};