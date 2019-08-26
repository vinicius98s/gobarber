# API GoBarber

## Installing dependecies

Run `yarn install` or `npm install` to install all project dependencies.

## Starting application

To run this application you need to setup a postgress [Docker](https://www.docker.com/) container. If you have docker installed you can run `docker ps` to see the containers running on your machine.

## Running the container

Once you have it installed, run the following command:

`docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres`.

You can change the container name if you want and the port if you already have something running on this port.

Run `docker ps` to check if your container is up. You will see something like this:

`e376cfb2b6c2 postgres "docker-entrypoint.s…" 34 minutes ago Up 34 minutes 0.0.0.0:5432->5432/tcp database`

## Running the Users migration

With your container running you can initialize the tables of our database running the migration:
`yarn sequelize db:migrate`

## Running the application

Run the command `yarn run dev` to start our application, it will use the port `3333`. Once we use [nodemon](https://nodemon.io/), you don't need to reload when make a change.
