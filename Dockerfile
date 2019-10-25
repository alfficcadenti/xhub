FROM kumorelease-docker-virtual.artylab.expedia.biz/stratus/primer-base-expressjs:10.15.1-1.0.0

# When this Dockerfile is built (with "docker build .") the base "primer-base-expressjs" image will:
# - Copy files from this directory into /app on the image
# - Run npm install from /app

# When resulting image is run (with "docker run"):
# - Set $EXPEDIA_ENVIRONMENT to one of these values test, int, prod (defaults to "dev", set it with "-e EXPEDIA_ENVIRONMENT=<env>")
# - Start the app with "node ."

CMD ["/bin/bash", "-c", "npm run prod"]