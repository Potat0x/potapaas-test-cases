docker stop nodejs_postgres_app
docker stop nodejs_postgres_db
docker rm nodejs_postgres_app
docker rm nodejs_postgres_db
docker rmi nodejs_postgres_app_image
docker network rm nodejs_postgres_network

docker build -t nodejs_postgres_app_image .

docker run --rm -d -p 5432 \
    --name nodejs_postgres_db \
    -e POSTGRES_PASSWORD=docker \
    -v $HOME/docker/volumes/nodejs_postgres_db_data:/var/lib/postgresql/data \
    postgres

docker run --rm -d \
    --name nodejs_postgres_app \
    -p 8080:8081 \
    -e PORT=8081 \
    -e POSTGRES_PORT=5432 \
    -e POSTGRES_HOST=nodejs_postgres_db \
    -e POSTGRES_PASSWORD=docker \
    nodejs_postgres_app_image


docker network create  nodejs_postgres_network --attachable
docker network connect nodejs_postgres_network nodejs_postgres_db
docker network connect nodejs_postgres_network nodejs_postgres_app

docker logs nodejs_postgres_db
docker logs nodejs_postgres_app
