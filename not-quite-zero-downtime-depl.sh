#!/bin/bash

service_name=api
old_container_id=$(docker ps -f name=$service_name -q | tail -n1)

docker compose up -d --no-deps --scale $service_name=2 --no-recreate $service_name

new_container_id=$(docker ps -f name=$service_name -q | head -n1)
new_container_ip=$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $new_container_id)

curl --silent --include --retry-connrefused --retry 30 --retry-delay 1 --fail http://$new_container_ip:3000/api/status || exit 1

docker stop $old_container_id
docker rm $old_container_id

docker compose up -d --no-deps --scale $service_name=1 --no-recreate $service_name