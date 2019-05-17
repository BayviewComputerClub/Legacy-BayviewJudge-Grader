# BayviewJudge-Grader
Grader for BayviewJudge, Don't forget to run a Web UI!


### Docker:

Build: `sudo docker build . -t bayviewjudge:grader`

Run: `sudo docker run -d -p 3000:3000 --name GraderServer bayviewjudge:grader`

Set Restart: `sudo docker update --restart=always GraderServer`
