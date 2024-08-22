rsconf = {
    _id: "cfgrs",
    configsvr: true,
    members: [
        { _id: 0, host: "cfgsvr1:40001" },
        { _id: 1, host: "cfgsvr2:40002" },
        { _id: 2, host: "cfgsvr3:40003" }
    ]
}

rs.initiate(rsconf)

rs.status()