const fs = require("fs");
const { spawn, exec } = require('child_process');

function prepareSubmission(submissionRequest, callback) {
    // Write the submission to a file.
    switch(submissionRequest.lang) {
        case "c++":
            writeCppFile(submissionRequest, (result) => {
                callback(result);
                return;
            });
            break;
        case "java":
            writeJavaFile(submissionRequest, (result) => {
                callback(result);
                return;
            });
            break;
    }
}

function writeCppFile(submissionRequest, callback) {
    let directory = './tmp/' + submissionRequest.userID + '/' + submissionRequest.problemID;
    // Create directory first.
    fs.mkdir(directory, { recursive: true }, (err) => {
        if (err) throw err;
        //Write file to problem dir
        fs.writeFile(directory + '/source.cpp', submissionRequest.inputCode, (err) => {
            if (err) throw err;
            callback(true);
            return;
        });
    });


}

function writeJavaFile(submissionRequest, callback) {
    let directory = './tmp/' + submissionRequest.userID + '/' + submissionRequest.problemID;
    // Create directory first.
    fs.mkdir(directory, { recursive: true }, (err) => {
        if (err) throw err;
        //Write file to problem dir
        fs.writeFile(directory + '/Main.java', submissionRequest.inputCode, (err) => {
            if (err) throw err;
            callback(true);
            return;
        });
    });


}

module.exports = {
    prepareSubmission: prepareSubmission
};