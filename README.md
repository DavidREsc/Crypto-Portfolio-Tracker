# Crypto-Portfolio-Tracker
![Sample App Image](./imgs/Demo.jpg)
![Sample App Image 2](./imgs/Demo2.jpg)

## Requirements

- Docker
- Docker Compose

## Usage

Clone the repository

```
git clone https://github.com/DavidREsc/Crypto-Portfolio-Tracker.git
```

1. Find the example.env file within the directory server/config
2. Enter your own environment variables for the Coinranking api key and jwt secret
3. Rename the file to dev.env

In the root of the project enter the command:

```
docker-compose up --build
```

Open project on http://localhost:3000

