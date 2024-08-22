
# run docker dev env composer file
docker-compose -f docker-compose.yml -f config-server/docker-compose.yml -f shard1/docker-compose.yml -f shard2/docker-compose.yml -f mongos/docker-compose.yml up -d --build
docker-compose -f docker-compose.yml -f config-server/docker-compose.yml -f shard1/docker-compose.yml -f shard2/docker-compose.yml -f mongos/docker-compose.yml up -d --build down -v 
