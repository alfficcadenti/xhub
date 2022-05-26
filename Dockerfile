FROM kumorelease-docker-virtual.artylab.expedia.biz/stratus/app-node:14.7.0-alpine
COPY . /app

WORKDIR /app
RUN npm install

# When resulting image is run (with "docker run"):
# - Set $EXPEDIA_ENVIRONMENT to one of these values test, int, prod (defaults to "dev", set it with "-e EXPEDIA_ENVIRONMENT=<env>")

COPY .primer/ExpediaChain.pem /etc/ssl/certs/ExpediaChain.pem
ENV NODE_EXTRA_CA_CERTS="/etc/ssl/certs/ExpediaChain.pem"
RUN chmod +x /app/tools/docker/entrypoint.bash
ENTRYPOINT /app/tools/docker/entrypoint.bash