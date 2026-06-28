const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dns.resolveSrv(
  "_mongodb._tcp.sunrise-cluster.x3xnejd.mongodb.net",
  (err, records) => {
    if (err) {
      console.error("ERROR:", err);
    } else {
      console.log("SUCCESS:", records);
    }
  },
);
