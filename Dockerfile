# Docker Container for Bayview Judge's Grader Server
# Make sure to "npm install" before building the container

FROM phusion/baseimage:0.11

# Use baseimage-docker's init system.
CMD ["/sbin/my_init"]

# Pull the latest Ubuntu updates
RUN apt-get update && apt-get upgrade -y -o Dpkg::Options::="--force-confold"

# Install sudo
RUN apt-get install -y sudo

# Install NodeJS
RUN curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
RUN apt-get update
RUN apt-get install -y nodejs

# Install build support for C/C++
RUN apt-get install -y build-essential

# Install OpenJDK build support for Java
RUN apt-get install -y default-jdk

# Create judge user
RUN useradd judge

# Copy the grader server files to the container
RUN mkdir -p /home/judge/grader
COPY --chown=judge:judge . /home/judge/grader
# Run npm to install the packages.
run cd /home/judge/grader && npm install

# Copy the runit file
RUN mkdir /etc/service/grader
COPY daemon.sh /etc/service/grader/run
RUN chmod +x /etc/service/grader/run


# Clean up APT when done.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
