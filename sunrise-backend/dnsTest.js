const dns = require("dns");

dns.resolveSrv(
  "_mongodb._tcp.sunrise-cluster.x3xnejd.mongodb.net",
  (err, records) => {
    if (err) {
      console.error("ERROR:", err);
    } else {
      console.log(records);
    }
  },
);
