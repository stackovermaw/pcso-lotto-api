# PCSO Lotto Results Scrapper API

> [!NOTE]  
> ~~If loading takes too long when you access the URL from the description, it is probably because the Render free tier services go into sleep mode during inactivity.~~

A small lotto results scrapper that can scrape lotto results ranging from August 26, 2020, until present as of writing.

## Motivation

- ~~I want to try redis, but I haven't implemented it yet.~~
- ~~I want to try release-it~~

## Features

- Get results today
- Get results today by gameId
- Get results by date
- Get results by date and by gameId

## Run Locally

Clone the project

```bash
  git clone https://github.com/Jiseeeh/pcso-lotto-api
```

Go to the project directory

```bash
  cd pcso-lotto-api
```

Start docker and run

```bash
  docker compose up
```

## Environment Variables

This is only used for logging.

`NODE_ENV=dev`

This is only used for releasing.

`GITHUB_TOKEN`

To connect with redis

`REDIS_URL`

To what port the server will listen

`PORT`

## API Reference

versions: [v1,v2]
> or see /api/:version/docs


### Get results today

```http
  GET /api/v1/results/today
```

### Get results by gameId

```http
  GET /api/v1/results/today/:gameId
```

| Parameter | Type     | Description                       | Sample Value |
|:----------|:---------|:----------------------------------|:-------------|
| `gameId`  | `string` | **Required**. The gameId to fetch | 2d-lotto     |

```http
  GET /api/results/:date
```

### Get results by date

| Parameter | Type     | Description                             | Sample value |
|:----------|:---------|:----------------------------------------|:-------------|
| `date`    | `string` | **Required**. The date to fetch results | april-6-2022 |

```http
  GET /api/results/:date/:gameId
```

### Get results by date and gameId

| Parameter | Type     | Description                             | Sample value |
|:----------|:---------|:----------------------------------------|:-------------|
| `date`    | `string` | **Required**. The date to fetch results | 2d-lotto     |
| `gameId`  | `string` | **Required**. The gameId to fetch       | april-6-2022 |

#### All possible values of gameId

- 6-58-ultra-lotto
- 6-55-grand-lotto
- 6-49-super-lotto
- 6-45-mega-lotto
- 6-42-lotto
- 6d-lotto
- 4d-lotto
- 2d-lotto
- stl-swer3

#### These are for old results dating from june 2, 2022, and below

- swertres
- ez2
- stl-pares
- stl-swer2
- stl-swer4

#### Old gameIds dating from August 20, 2020

- grand-lotto-6-55
- mega-lotto-6-45
- lotto-6-42
- ultra-lotto-6-58
- super-lotto-6-49

## Contributing

Contributions are always welcome!

## License

[MIT](https://choosealicense.com/licenses/mit/)
