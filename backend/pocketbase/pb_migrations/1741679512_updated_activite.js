/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("h7776q3039ai33f")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gtlbwyca",
    "name": "animateur",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "jjnaw3knk0xx0z7",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("h7776q3039ai33f")

  // remove
  collection.schema.removeField("gtlbwyca")

  return dao.saveCollection(collection)
})
