#!/bin/bash
echo =====================================
echo Starting the Shards setup
echo =====================================

sleep 10 | echo sleeping

mongosh mongodb://mongos:60000 --eval "sh.status();" 2> /dev/null 

if [ ! $? -eq 0 ]; then
    echo =====================================
    echo seting up Shard one ...
    echo =====================================
    mongosh mongodb://mongos:60000 add-shard1.js
    sleep 5
    echo =====================================
    echo seting up Shard two ...
    echo =====================================
    mongosh mongodb://mongos:60000 add-shard2.js
    sleep 5
    echo =====================================
    echo Printing the shards ...
    echo =====================================
    mongosh mongodb://mongos:60000 --eval "sh.status();" 
else 
    echo =====================================
    echo Shards already exists
    echo =====================================
fi


