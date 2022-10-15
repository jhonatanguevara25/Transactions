const { MongoClient } = require("mongodb");
const express = require("express");
const routes = express.Router();

routes.get("/:id", (req, res) => {
  const id = req.params.id;
  async function ventasInventario() {
    const uri =
      "mongodb+srv://bratty289:YGTl63QI@pruebamongo.lnhsrdp.mongodb.net/test";

    const client = new MongoClient(uri);

    try {
      // Connect to the MongoDB cluster
      await client.connect();

      // User1 purchases 1 copy of parks-rec-book
      await purchaseBook(client, "User1", "leche", 4, "paid");
    } finally {
      // Close the connection to the MongoDB cluster
      await client.close();
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
