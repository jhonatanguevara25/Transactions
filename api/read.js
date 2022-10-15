const { MongoClient } = require("mongodb");
const express = require("express");
const routes = express.Router();

routes.get("/:id", (req, res) => {
  const id = req.params.id;
  async function seleccion() {
    const uri =
      "mongodb+srv://bratty289:YGTl63QI@pruebamongo.lnhsrdp.mongodb.net/test";
    const client = new MongoClient(uri);

    try {
      await client.connect();
      const resultado = await findOneListingByID(client, id);
      res.send(resultado);
    } finally {
      await client.close();
    }
  }
  seleccion().catch(console.error);
});

async function findOneListingByID(client, IdOfListing) {
  const result = await client
    .db("banking")
    .collection("accounts")
    .findOne({ _id: IdOfListing });

  if (result) {
    console.log(
      `Found a listing in the collection with the ID '${IdOfListing}':`
    );
    console.log(result);
    return result;
  } else {
    console.log(`No listings found with the ID '${IdOfListing}'`);
  }
}

module.exports = routes;
