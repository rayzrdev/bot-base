# Bot Base

> A simple Discord.js bot base.

This is an extremely simple Discord.js bot base with a config loader / validator, a command handler, and a simple ping command. All code should be pretty self-explanatory.

## Hack the source, Luke!

1. Fork the repo
2. Clone your newly made fork
3. Run `npm ci` to install all dependecies
4. Copy the `.env.example` file that is provided to `.env` and fill out all provided variables
5. Run the bot with `npm start`

It should be pretty simple to make your own commands, expand the command handler, etc.

It would be appreciated if you would provide a link back to this original version though, as well as an optional link to [Rayzr's Discord server](https://rayzr.dev/join).

## Building docker images

You can pretty easily build a docker image out of your bot using the provided `Dockerfile` and `Dockerfile-native`. To build your docker image, run the following inside your project:

```bash
docker build . -t myname/my-cool-bot
```

If you have native dependencies that require a full node environment to install, either replace `Dockerfile` with `Dockerfile-native` or run the following:

```bash
docker build -f Dockerfile-native . -t myname/my-cool-bot
```

Then to run the built docker image, attach to its virtual terminal, and read from your `.env` file, run the following:

```bash
docker run -it --env-file .env myname/my-cool-bot
```

Hit <kbd>^C</kbd> to kill the bot while it's running. See more about running docker images on the official docs for [docker run](https://docs.docker.com/engine/reference/commandline/run/).

## Using docker-compose to run multiple instances

I've included a sample `docker-compose-example.yml` file which you can use to set up a `docker-compose.yml` file to use with, well, docker-compose. This allows you to easily run a number of instances of the same bot with different tokens, prefixes, etc, which is great if you want to do things like managed hosting for customers who pay you to host bots for them.

Just copy `docker-compose-example.yml` to `docker-compose.yml`, tweak the environment variables and service names for each instance you want to run, and then use the following for reference:

```bash
# if you want to see terminal output:
docker-compose up
# otherwise, run this to create the containers detached:
docker-compose up -d
# to start/stop:
docker-compose start
docker-compose stop
# to remove the containers:
docker-compose down
```

## Join Me

[![Discord Badge](https://github.com/Rayzr522/ProjectResources/raw/master/RayzrDev/badge-small.png)](https://rayzr.dev/join)
