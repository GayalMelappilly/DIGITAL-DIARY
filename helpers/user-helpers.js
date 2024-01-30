var db = require('../config/connection.js')
var colleciton = require('../config/collection.js')
var objectId = require('mongodb').ObjectId

module.exports = {
    addDiary: (data) => {
        return new Promise((resolve, reject) => {
            db.get().collection(colleciton.DIARY_COLLECTION).insertOne(data).then(() => {
                resolve(data)
            })
        })
    },

    getAllDiary: () => {
        return new Promise((resolve, reject) => {
            let diaries = db.get().collection(colleciton.DIARY_COLLECTION).find().toArray()
            resolve(diaries)
        })
    },

    removeDiary: (id)=>{
        return new Promise ((resolve,reject)=>{
            db.get().collection(colleciton.DIARY_COLLECTION).removeOne({_id: objectId(id)}).then((data)=>{
                resolve(data)
            })
        })
    }
}