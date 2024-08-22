FROM mongo

WORKDIR /user/src/configs

COPY replicaSet.js .
COPY setup.sh .

RUN chmod +x setup.sh
CMD ["./setup.sh" ]
# CMD [ "chmod +x /setup.sh", "&&", "./setup.sh" ]