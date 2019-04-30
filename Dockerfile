FROM phusion/baseimage:0.10.2

# Use baseimage-docker's init system.
CMD ["/sbin/my_init"]

# Install NodeJS
RUN curl -sSL https://deb.nodesource.com/gpgkey/nodesource.gpg.key | sudo apt-key add -
RUN export VERSION=node_10.x
RUN export DISTRO="$(lsb_release -s -c)"
RUN echo "deb https://deb.nodesource.com/$VERSION $DISTRO main" | sudo tee /etc/apt/sources.list.d/nodesource.list
RUN echo "deb-src https://deb.nodesource.com/$VERSION $DISTRO main" | sudo tee -a /etc/apt/sources.list.d/nodesource.list
RUN apt-get update
RUN apt-get install nodejs

# Copy the grader server files to the container
RUN mkdir -p /home/judge/grader
COPY --chown=judge:judge . /home/judge/grader

# Copy the runit file
RUN mkdir /etc/service/grader
COPY daemon.sh.sh /etc/service/grader/run
RUN chmod +x /etc/service/grader/run

# Clean up APT when done.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
