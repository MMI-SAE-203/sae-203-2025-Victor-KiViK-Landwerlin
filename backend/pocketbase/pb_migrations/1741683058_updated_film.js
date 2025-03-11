/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dlbor3v8bjkofw7")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "8ldxx82h",
    "name": "date_projection",
    "type": "date",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dlbor3v8bjkofw7")

  // remove
  collection.schema.removeField("8ldxx82h")

  return dao.saveCollection(collection)
})
