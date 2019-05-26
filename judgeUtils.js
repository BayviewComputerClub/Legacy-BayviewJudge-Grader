// Node Modules
const fs = require("fs");
const { spawn, exec } = require('child_process');

// Cores
const CompileCore = require('./Core/Compile/CompileCore');
const PrepareCore = require('./Core/Prepare/PrepareCore');
const StageCore = require('./Core/Stage/StageCore');
const ExecCore = require('./Core/Execute/ExecCore');
const CleanupCore = require('./Core/Cleanup/CleanupCore');


function scoreOutput(output, expectedOutput, callback) {
    let score = 0;
    if (typeof output == 'undefined') {
        console.log('[Error] Output is undefined.');
        output = "error";
    }
    for(let i = 0; i < expectedOutput.length; i++) {
        // Ignore newlines in the test cases
        //console.log("*********LOOK AT THIS:" + typeof expectedOutput[i] + " - " + typeof output[i]);
        console.log("[Debug] Judge Iteration " + i);

        // Bug with C++ programs
        if (typeof output[i] == 'undefined') {
            console.log('[Error] Output[i] is undefined.');
            output = "error";
            break;
        }

        let strippedExpectedOuput = expectedOutput[i].replace(/(\r\n|\n|\r)/gm, "").trim();
        let strippedOutput = output[i].replace(/(\r\n|\n|\r)/gm, "").trim();
        if(strippedExpectedOuput === strippedOutput) {
            console.log("[Debug] Right answer! Expected: " + strippedExpectedOuput + " and got: " + strippedOutput);
            score++;
        } else {
            console.log("[Debug] Wrong answer! Expected: " + strippedExpectedOuput + " but got: " + strippedOutput);
            callback(score, false, i);
            return;
        }

    }
    callback(score, true, -1);
    return;
}

function judgeSubmission(problemID, userID, inputCode, lang, input, output, timelimit, callback) {
    console.log("[Info] Judging a submission.");
    let judgeResult = {accepted: false, time: -1, isTLE: false, isCompileError: false, otherError: false, errorAt: -1, score: -1};

    // Create a submission request object.
    // input & output are the expected test case

    input = input.replace('\r\n', '\n');
    output = output.replace('\r\n', '\n');

    let submissionRequest = {problemID: problemID, userID: userID, inputCode: inputCode, lang: lang, input: input, output: output, timelimit: timelimit};

    const problemRoot = './problems/' + problemID;

    // Load the problem metadata (Timemout and Mem Limit)
    //const problemMeta = JSON.parse(fs.readFileSync('1' + '/meta.json'));
    // Load the test cases
    //const testInput = fs.readFileSync(problemRoot + '/in.txt').toString().split("\n");
    //const testOutput = fs.readFileSync(problemRoot + '/out.txt').toString().split("\n");

    const testInput = new Buffer(input, 'base64').toString('ascii').split("\n");
    const testOutput = new Buffer(output, 'base64').toString('ascii').split("\n");

    // Place decoded JSON into request object
    submissionRequest.input = testInput;
    submissionRequest.output = testOutput;

    console.log('[Info] Parsed Input and Output Cases');
    console.log('[Debug] Input Cases: ' + testInput[0]);
    console.log('[Debug] Input Cases 2: ' + testInput[1]);
    console.log('[Debug] Output Cases: ' + testOutput[0]);


    // Please ignore callback hell

    // Execution Flow: Prepare -> Compile -> Stage -> Execute -> Cleanup
    // Then respond with the score.

    // decode and save the code.
    let buff = new Buffer(inputCode, 'base64');
    // Place into request
    submissionRequest.inputCode = buff.toString('ascii');

    if(submissionRequest.inputCode == "") {
        callback(judgeResult);
        return;
    }

    PrepareCore.prepareSubmission(submissionRequest, (prepareResult) => {

        // Compile the input code (Inside firejail)
        //firejail --apparmor --private --net=none --quiet


        CompileCore.compileSubmission(submissionRequest, (compileResult) => {
            console.log("***** We have compileda the file");
            if(!compileResult) {
                // Error in file compile (i.e CE), set it in the result object
                judgeResult.isCompileError = true;
                callback(judgeResult);
                return;
            }
            // Mark the file as executable
            StageCore.stageSubmission(submissionRequest, (stageResult) => {
                console.log("***** We have staged the file");

                ExecCore.execSubmission(submissionRequest, (execResult, inputProcessOutput) => {
                    console.log("***** We have exec the file");
                    console.log(inputProcessOutput[0]);
                    if(!execResult) {
                        judgeResult.isTLE = true;
                        callback(judgeResult);
                        return;
                    }

                    scoreOutput(inputProcessOutput, submissionRequest.output, function(score, isAccepeted, errorAt) {
                        if(isAccepeted === false) {
                            judgeResult.accepted = false;
                            judgeResult.errorAt = errorAt;
                            CleanupCore.cleanupSubmission(submissionRequest, (result) => {
                                callback(judgeResult);
                                return;
                            });

                        } else {
                            judgeResult.accepted = true;
                            judgeResult.score = score;
                            CleanupCore.cleanupSubmission(submissionRequest, (result) => {
                                callback(judgeResult);
                                return;
                            });
                        }
                    });
                });
            });
        });

    });



}

module.exports = {
    judgeSubmission: judgeSubmission
};
