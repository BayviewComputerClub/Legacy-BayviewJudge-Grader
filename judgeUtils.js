// Node Modules
const fs = require("fs");

function judgeSubmission(problemID, userID, inputCode) {
    console.log("[Info] Judging a submission.");
    let result = {accepted: true, time: 10, isTLE: false, isCompileError: false, otherError: false, errorAt: -1};

    const problemRoot = './problems' + problemID;

    // Load the problem metadata (Timemout and Mem Limit)
    const problemMeta = JSON.parse(fs.readFileSync(problemRoot + '/meta.json'));
    // Load the test cases
    const testInput = fs.readFileSync(problemRoot + '/in.txt');
    const testOutput = fs.readFileSync(problemRoot + '/out.txt');

    //

    return result;

}

module.exports = {
    judgeSubmission: judgeSubmission
};
