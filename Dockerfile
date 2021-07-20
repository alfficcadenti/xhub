FROM kumorelease-docker-virtual.artylab.expedia.biz/stratus/primer-base-expressjs:10.15.1-1.0.0

# When this Dockerfile is built (with "docker build .") the base "primer-base-expressjs" image will:
# - Copy files from this directory into /app on the image
# - Run npm install from /app

# When resulting image is run (with "docker run"):
# - Set $EXPEDIA_ENVIRONMENT to one of these values test, int, prod (defaults to "dev", set it with "-e EXPEDIA_ENVIRONMENT=<env>")
# - Start the app with "node ."

COPY .primer/ExpediaChain.pem /etc/ssl/certs/ExpediaChain.pem
ENV NODE_EXTRA_CA_CERTS="/etc/ssl/certs/ExpediaChain.pem"
CMD ["/bin/bash", "-c", "node ./build/server/index.js > ${APP_LOGS}/${APP_NAME}.log 2>&1"]