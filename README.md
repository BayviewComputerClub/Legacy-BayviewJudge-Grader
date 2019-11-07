> This was part of our original attempt to write an online judge. This is the grader server, which recieves submissions requests from the websites and grades the submission.

# BayviewJudge-Grader
Grader for BayviewJudge, Don't forget to run a Web UI!


### Docker:

Build: `sudo docker build . -t bayviewjudge:grader`

Run: `sudo docker run -d -p 3000:3000 --name GraderServer bayviewjudge:grader`

Set Restart: `sudo docker update --restart=always GraderServer`
