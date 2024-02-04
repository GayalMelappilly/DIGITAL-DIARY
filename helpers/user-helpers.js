var db = require('../config/connection.js')
var collection = require('../config/collection.js')
var objectId = require('mongodb').ObjectId

module.exports = {
    addDiary: async (userEmail, DiaryContent) => {

        let user = {
            email: userEmail,
            diary: [{
                _id: new objectId(),
                date: DiaryContent.date,
                content: DiaryContent.content,
                limitContent: DiaryContent.limitContent
            }]
        }

        let userFound = await db.get().collection(collection.DIARY_COLLECTION).findOne({ email: userEmail })

        if (!userFound) {
            console.log("USER NOT FOUND")
            return new Promise((resolve, reject) => {
                db.get().collection(collection.DIARY_COLLECTION).insertOne(user).then((data) => {
                    console.log("DATA: "+data)
                    resolve(data)
                })
            })
        } else {
            console.log('USER FOUND')
            return new Promise((resolve, reject) => {
                db.get().collection(collection.DIARY_COLLECTION).updateOne({ email: userEmail }, {
                    $push: {
                        diary: {
                            _id: new objectId(),
                            date: DiaryContent.date,
                            content: DiaryContent.content,
                            limitContent: DiaryContent.limitContent
                        }
                    }
                }).then((diary) => {
                    resolve(diary)
                })
            })
        }
    },

    getAllDiary: (userEmail) => {
        return new Promise(async (resolve, reject) => {
            let diaries = await db.get().collection(collection.DIARY_COLLECTION).findOne({ email: userEmail })
            resolve(diaries)
        })
    },

    removeDiary: (userEmail, diaryDate) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.DIARY_COLLECTION).updateOne({ email: userEmail }, {
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
            db.get().collection(collection.DIARY_COLLECTION).updateOne({ diary: { $elemMatch: { date: diaryDate } } },
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

    findDiary: (email, id) => {
        return new Promise(async (resolve, reject) => {
            let diary = await db.get().collection(collection.DIARY_COLLECTION).aggregate([
                {
                    $match : {
                        email : email
                    }
                },
                {
                    $unwind: "$diary"
                },
                {
                    $match: {
                        "diary._id" : new objectId(id)
                    }
                },
                {
                    $project: {
                        _id: 0,
                        "diary._id": 1,
                        "diary.date": 1,
                        "diary.content": 1,
                        "diary.limitContent": 1
                    }
                }
            ]).toArray()
            console.log(diary)
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