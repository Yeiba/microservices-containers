FROM mongo

WORKDIR /user/src/configs

COPY add-shard1.js .
COPY add-shard2.js .
COPY setup.sh .

RUN chmod +x setup.sh
CMD ["./setup.sh" ]
# CMD [ "chmod +x /setup.sh", "&&", "./setup.sh" ]