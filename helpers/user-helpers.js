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
            db.get().collection(colleciton.DIARY_COLLECTION).deleteOne({_id: new objectId(id)}).then((data)=>{
                resolve(data)
            })
        })
    },

    editDiary: (id, updatedDiary)=>{
        return new Promise ((resolve,reject)=>{
            db.get().collection(colleciton.DIARY_COLLECTION).updateOne({_id: new objectId(id)},
            {
                $set: {
                    date: updatedDiary.date,
                    content: updatedDiary.content,
                    limitContent: updatedDiary.content.slice(0,60)
                }
            }).then((data)=>{
                resolve(data)
            })
        })
    },

    findDiary: (id)=>{
        return new Promise ((resolve, reject)=>{
            let diary = db.get().collection(colleciton.DIARY_COLLECTION).findOne({_id: new objectId(id)})
            resolve(diary)
        })
    }
}