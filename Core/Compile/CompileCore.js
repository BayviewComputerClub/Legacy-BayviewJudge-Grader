// BayviewJudge Submission Compiling Core

const { spawn, exec } = require('child_process');

function compileSubmission(submissionRequest, callback) {

    switch(submissionRequest.lang) {
        case "c++":
            compileCppSubmission(submissionRequest, (result, err) => {
                callback(result, err);
                return;
            });
            break;
        case "java":
            compileJavaSubmission(submissionRequest, (result, err) => {
                callback(result, err);
                return;
            });
            break;
        case "python":
            // There is nothing to do here.
            callback(true);
            return;
            break;
    }
}

// C++
function compileCppSubmission(submissionRequest, callback) {
    // Command Definitions
    let directory = './tmp/' + submissionRequest.userID + '/' + submissionRequest.problemID;
    let compileCommand = 'g++ ' + directory + '/source.cpp -o ' + directory + '/source.out';

    exec(compileCommand, (err, stdout, stderr) => {
        if (err) {
            console.log('File compile ERROR ' + err);
            callback(false, err);
            return;
        }
        callback(true, "None");
        return;
    });
}

// Java
function compileJavaSubmission(submissionRequest, callback) {
    // Command Definitions
    let directory = './tmp/' + submissionRequest.userID + '/' + submissionRequest.problemID;
    let compileCommand = 'cd ' + directory + ' && javac Main.java';

    exec(compileCommand, (err, stdout, stderr) => {
        if (err) {
            console.log('File compile ERROR ' + err);
            callback(false, err);
            return;
        }
        callback(true, "None");
        return;
    });
}



module.exports = {
    compileSubmission: compileSubmission
};