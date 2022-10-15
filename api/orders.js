const { MongoClient } = require("mongodb");
const express = require("express");
const routes = express.Router();

routes.get("/:id", (req, res) => {
  var id = req.params.id;
  var id = id * 1.0;
  async function ventasInventario() {
    const uri =
      "mongodb+srv://bratty289:YGTl63QI@pruebamongo.lnhsrdp.mongodb.net/test";

    const client = new MongoClient(uri);

    try {
      await client.connect();

      await comprar(client, "User1", "leche", id, "paid");
      res.send("Operacion exitosa");
    } finally {
      await client.close();
    }
  }

  ventasInventario().catch(console.error);
});

async function comprar(client, userId, productID, quantity, status) {
  const ordersCollection = client.db("yarashop-products").collection("orders");

  const inventoryCollection = client
    .db("yarashop-products")
    .collection("inventory");

  const session = client.startSession();

  const transactionOptions = {
    readPreference: "primary",
    readConcern: { level: "local" },
    writeConcern: { w: "majority" },
  };

  try {
    const transactionResults = await session.withTransaction(async () => {
      const updateInventoryResults = await inventoryCollection.updateOne(
        { _id: productID },
        { $inc: { numberInStock: quantity * -1 } },
        { session }
      );
      console.log(
        `${updateInventoryResults.matchedCount} document(s) found in the inventory collection with _id ${productID}.`
      );
      console.log(
        `${updateInventoryResults.modifiedCount} document(s) was/were updated.`
      );
      if (updateInventoryResults.modifiedCount !== 1) {
        await session.abortTransaction();
        return;
      }

      const insertOrderResults = await ordersCollection.insertOne(
        {
          userId: userId,
          productID: productID,
          quantity: quantity,
          status: status,
        },
        { session }
      );
      console.log(
        `New order recorded with the following id: ${insertOrderResults.insertedId}`
      );
    }, transactionOptions);

    if (transactionResults) {
      console.log(
        "The order was successfully processed. Database operations from the transaction are now visible outside the transaction."
      );
    } else {
      console.log(
        "The order was not successful. The transaction was intentionally aborted."
      );
    }
  } catch (e) {
    console.log(
      "The order was not successful. The transaction was aborted due to an unexpected error: " +
        e
    );
  } finally {
    await session.endSession();
  }
}

module.exports = routes;
