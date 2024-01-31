var db = require('../config/connection.js')
var collection = require('../config/collection.js')
var objectId = require('mongodb').ObjectId

module.exports = {
    addDiary: (data) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.DIARY_COLLECTION).insertOne(data).then(() => {
                resolve(data)
            })
        })
    },

    getAllDiary: () => {
        return new Promise(async(resolve, reject) => {
            let diaries = await db.get().collection(collection.DIARY_COLLECTION).find().toArray()
            resolve(diaries)
        })
    },

    removeDiary: (id)=>{
        return new Promise ((resolve,reject)=>{
            db.get().collection(collection.DIARY_COLLECTION).deleteOne({_id: new objectId(id)}).then((data)=>{
                resolve(data)
            })
        })
    },

    editDiary: (id, updatedDiary)=>{
        return new Promise ((resolve,reject)=>{
            db.get().collection(collection.DIARY_COLLECTION).updateOne({_id: new objectId(id)},
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
        return new Promise (async(resolve, reject)=>{
            let diary = await db.get().collection(collection.DIARY_COLLECTION).findOne({_id: new objectId(id)})
            resolve(diary)
        })
    },

    signupUser: (user)=>{
        return new Promise ((resolve, reject)=>{
            db.get().collection(collection.USER_COLLECTION).insertOne(user).then((data)=>{
                resolve(data)
            })
        })
    },

    userCheck: (userEmail)=>{
        return new Promise (async (resolve, reject)=>{
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({email: userEmail})
            resolve(user)
        })
    },

    loginCheck: (userEmail, userPassword)=>{
        return new Promise (async(resolve, reject)=>{
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({email: userEmail, password: userPassword})
            resolve(user)
        })
    }
}