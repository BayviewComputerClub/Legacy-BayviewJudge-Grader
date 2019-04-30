# Docker Container for Bayview Judge's Grader Server
# Make sure to "npm install" before building the container

FROM phusion/baseimage:0.10.2

# Use baseimage-docker's init system.
CMD ["/sbin/my_init"]

RUN apt-get update
RUN apt-get install -y sudo

# Install NodeJS
RUN curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
RUN apt-get update
RUN apt-get install -y nodejs

# Create judge user
RUN useradd judge

# Copy the grader server files to the container
RUN mkdir -p /home/judge/grader
COPY --chown=judge:judge . /home/judge/grader

# Copy the runit file
RUN mkdir /etc/service/grader
COPY daemon.sh /etc/service/grader/run
RUN chmod +x /etc/service/grader/run

# Install build support for C/C++
RUN apt-get install -y build-essential

# Clean up APT when done.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
