var db = require('../config/connection.js')
var collection = require('../config/collection.js')
var objectId = require('mongodb').ObjectId

module.exports = {
    addDiary: async (userEmail, DiaryContent) => {

        let user = {
            email: userEmail,
            diary: [DiaryContent]
        }

        let userFound = await db.get().collection(collection.DIARY_COLLECTION).findOne({ email : userEmail })

        if (!userFound) {
            console.log("USER NOT FOUND")
            return new Promise((resolve, reject) => {
                db.get().collection(collection.DIARY_COLLECTION).insertOne(user).then((data) => {
                    resolve(data)
                })
            })
        } else {
            console.log('USER FOUND')
            return new Promise((resolve, reject) => {
                db.get().collection(collection.DIARY_COLLECTION).updateOne({email: userEmail}, {
                    $push: {
                        diary: DiaryContent
                    }
                }).then((diary)=>{
                    resolve(diary)
                })
            })
        }
    },

    getAllDiary: (userEmail) => {
        return new Promise(async (resolve, reject) => {
            let diaries = await db.get().collection(collection.DIARY_COLLECTION).findOne({email: userEmail})
            resolve(diaries)
        })
    },

    removeDiary: (userEmail, diaryDate) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.DIARY_COLLECTION).updateOne({ email : userEmail }, {
                $pull: {
                    diary: {
                        date: diaryDate
                    }
                }
            })
        })
    },

    editDiary: (updatedDiary, diaryDate) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.DIARY_COLLECTION).updateOne({ diary : {$elemMatch : {date : diaryDate}}},
                {
                    $set: {
                        date: updatedDiary.date,
                        content: updatedDiary.content,
                        limitContent: updatedDiary.content.slice(0, 60)
                    }
                }).then((data) => {
                    resolve(data)
                })
        })
    },

    findDiary: (email, diaryDate) => {
        return new Promise(async (resolve, reject) => {
            let diary = await db.get().collection(collection.DIARY_COLLECTION).findOne({ diary: {$elemMatch : {date: diaryDate}} })
            resolve(diary)
        })
    },

    signupUser: (user) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).insertOne(user).then((data) => {
                resolve(data)
            })
        })
    },

    userCheck: (userEmail) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userEmail })
            resolve(user)
        })
    },

    loginCheck: (userEmail, userPassword) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userEmail, password: userPassword })
            resolve(user)
        })
    }
}