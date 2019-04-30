#!/bin/sh
cd /home/judge/grader
exec /sbin/setuser judge /usr/bin/node index.js 2>&1 | logger
