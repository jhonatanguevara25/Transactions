const { MongoClient } = require("mongodb");
const express = require("express");
const routes = express.Router();

routes.get("/:id", (req, res) => {
  const id = req.params.id;
  async function ventasInventario() {
    const uri =
      "mongodb+srv://bratty289:YGTl63QI@pruebamongo.lnhsrdp.mongodb.net/test";
    const client = new MongoClient(uri);
    if (id == 1) {
      //Izquierda a Derecha
      try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Transfer $100 from "account1" to "account2"
        await transferMoney(client, "account1", "account2", 100);
        res.send("Execution Correct");
      } catch (e) {
        res.send("Unexpected Error: ", e);
      } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
      }
    } else if (id == 2) {
      // Derecha a Izquierda
      try {
        // Connect to the MongoDB cluster
        await client.connect();
        // Transfer $100 from "account2" to "account1"
        await transferMoney(client, "account2", "account1", 100);
        res.send("Execution Correct");
      } catch (e) {
        res.send("Unexpected Error: ", e);
      } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
      }
    }
  }

  ventasInventario().catch(console.error);
});

async function transferMoney(client, account1, account2, amount) {
  const accountsCollection = client.db("banking").collection("accounts");
  const session = client.startSession();

  const transactionOptions = {
    readPreference: "primary",
    readConcern: { level: "local" },
    writeConcern: { w: "majority" },
  };

  try {
    const transactionResults = await session.withTransaction(async () => {
      const subtractMoneyResults = await accountsCollection.updateOne(
        { _id: account1 },
        { $inc: { balance: amount * -1 } },
        { session }
      );
      console.log(
        `${subtractMoneyResults.matchedCount} document(s) found in the accounts collection with _id ${account1}.`
      );
      console.log(
        `${subtractMoneyResults.modifiedCount} document(s) was/were updated to remove the money.`
      );
      if (subtractMoneyResults.modifiedCount !== 1) {
        await session.abortTransaction();
        return;
      }

      // Add the money to the second account
      const addMoneyResults = await accountsCollection.updateOne(
        { _id: account2 },
        { $inc: { balance: amount } },
        { session }
      );
      console.log(
        `${addMoneyResults.matchedCount} document(s) found in the accounts collection with _id ${account2}.`
      );
      console.log(
        `${addMoneyResults.modifiedCount} document(s) was/were updated to add the money.`
      );
      if (addMoneyResults.modifiedCount !== 1) {
        await session.abortTransaction();
        return;
      }
    }, transactionOptions);

    if (transactionResults) {
      console.log(
        "The money was successfully transferred. Database operations from the transaction are now visible outside the transaction."
      );
    } else {
      console.log(
        "The money was not transferred. The transaction was intentionally aborted."
      );
    }
  } catch (e) {
    console.log(
      "The money was not transferred. The transaction was aborted due to an unexpected error: " +
        e
    );
  } finally {
    // Step 4: End the session
    await session.endSession();
  }
}

module.exports = routes;
