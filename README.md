# API GoBarber

## Installing dependecies

Run `yarn install` or `npm install` to install all project dependencies.

## Starting application

To run this application you need to setup a postgress, a mongodb and a redis [Docker](https://www.docker.com/) container. If you have docker installed you can run `docker ps` to see the containers running on your machine.

## Running the containers

All 3 container can be run with the following commands:

`docker run --name postgres -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres`<br>
`docker run --name mongodb -p 27017:27017 -d -t mongo`<br>
`docker run --name redis -p 6379:6379 -d -t redis:alpine`

You can change the container name if you want and the port if you already have something running on this port.

Run `docker ps` to check if your containers are up. You will see something like this:

| CONTAINER ID | IMAGE        | COMMAND                  | CREATED     | STATUS     | PORTS                    | NAMES    |
| ------------ | ------------ | ------------------------ | ----------- | ---------- | ------------------------ | -------- |
| 55b6f0727b6c | redis:alpine | "docker-entrypoint.s..." | 2 hours ago | Up 2 hours | 0.0.0.0:6379->6379/tcp   | redis    |
| 00f13f8dda62 | mongo        | "docker-entrypoint.s..." | 2 hours ago | Up 2 hours | 0.0.0.0:27017->27017/tcp | mongodb  |
| e376cfb2b6c2 | postgres     | "docker-entrypoint.s..." | 2 hours ago | Up 2 hours | 0.0.0.0:5432->5432/tcp   | postgres |

## Running database migrations

With your container running you can initialize the tables of our database running the migration: `yarn sequelize db:migrate`

## Running the application

Run the command `yarn dev` to start our application, it will use the port `3333`. Once we use [nodemon](https://nodemon.io/), you don't need to reload when make a change.

## Running redis

For our queues, we have a redis database running in background for our jobs, run this with `yarn queue`
