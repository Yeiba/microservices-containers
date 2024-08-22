rsconf = {
    _id: "my-mongo-set",
    members: [
        { _id: 0, host: "mongo-one:30001" },
        { _id: 1, host: "mongo-two:30002" },
        { _id: 2, host: "mongo-three:30003" }
    ]
}

rs.initiate(rsconf)
