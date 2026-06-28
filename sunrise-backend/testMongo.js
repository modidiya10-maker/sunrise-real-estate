const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://modidiya10_db_user:sunrise7590pass@sunrise-cluster.x3xnejd.mongodb.net/?appName=sunrise-cluster";

async function test() {
  const client = new MongoClient(uri);

  try {
    console.log("Connecting...");
    await client.connect();

    console.log("✅ Connected successfully");

    const result = await client.db("admin").command({ ping: 1 });

    
    console.log("✅ Ping successful:", result);
  } catch (err) {
    console.error("❌ Error:");
    console.error(err);
  } finally {
    await client.close();
  }
}

test();
