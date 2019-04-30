#!/bin/sh
cd /home/judge/grader
exec /sbin/setuser judge /usr/bin/node index.js >>/var/log/grader.log 2>&1