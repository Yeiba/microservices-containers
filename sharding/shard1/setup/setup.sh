#!/bin/bash
echo =====================================
echo Starting the replica Set
echo =====================================

sleep 10 | echo sleeping

mongosh mongodb://shard1svr1:27017 --eval "rs.status();" 2> /dev/null 

if [ ! $? -eq 0 ]; then
    echo =====================================
    echo seting up replicaSet ...
    echo =====================================
    mongosh mongodb://shard1svr1:27017 replicaSet.js
    sleep 5
    echo =====================================
    echo reconfiguring replica
    echo =====================================
    mongosh mongodb://mongo-rs0-1:27017 reconfig_replicaSet.js
    sleep 5
    echo =====================================
    echo Printing the replica
    echo =====================================
    mongosh mongodb://shard1svr1:27017 --eval "rs.status();" 
else 
    echo =====================================
    echo replicaSet already exists
    echo =====================================
fi


