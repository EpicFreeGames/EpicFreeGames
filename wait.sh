#!/bin/bash

# wait for port to be ready
# usage: wait.sh <port> <timeout>
# example: wait.sh 8080 10

port=$1
timeout=$2

echo "Waiting for port $port to be ready"

for i in `seq 1 $timeout`; do
    nc -z localhost $port && break
    sleep 1
done

if [ $i -eq $timeout ]; then
    echo "Port $port not ready after $timeout seconds"
    exit 1
fi

echo "Port $port is ready"
exit 0

# end of file