
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
let saltRound = 10;
const url = process.env.DATABASE_URL
function sign(body) {
    return new Promise((resolve, rejects) => {
        MongoClient.connect(url).then(result => {
            const { name, email, password, num } = body

            bcrypt.hash(password, saltRound).then((hash, err) => {
                result.db("database").collection('userData').findOne({ username: email })
                    .then((res) => {
                        if (res) {
                            console.log("already exist")
                            resolve({ status: 409, data: res });
                        } else {
                            result.db("database").collection('userData').insertOne({ username: email, password: hash, name: name, num: num,submitted:false,progress:0 })
                                .then(() => {

                                    console.log(res);
                                    resolve({ status: 200, data: null });
                                })
                        }

                    })
            })
        })
    })
}

function getData(body) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url).then(result => {
            const { email, password } = body
            console.log(email,password)
            result.db('database').collection('userData').findOne({ username: email }).then(doc => {
                if (doc) {
                    bcrypt.compare(password, doc.password).then((state) => {
                        if (state) {
                            resolve({ data: doc, status: 200 })
                            console.log('password is correct');
                        } else {
                            resolve({ data: null, status: 206 })
                            console.log("password mismatch");
                        }
                    })
                } else {
                    resolve({ data: doc, status: 204 })
                }
            })
        })
    })
}
function userDataIsThere(body) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url).then(result => {
            const { username } = body
            result.db('database').collection('userData').findOne({ username: username }).then(res => {
                resolve(res)
            })
        })
    })
}


function getUserData() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url).then(result => {
            result.db('database').collection('userData').find().toArray().then(result => {

                resolve(result)

            })

        })

    })
}



function removeUser(body) {


    return new Promise((resolve, reject) => {
        MongoClient.connect(url).then(client => {
            const { Id } = body
            console.log(Id, "from server")


            client.db('database').collection('userData').deleteOne({ _id: new ObjectId(Id) }).then(() => {
                return client.db('database').collection('form').deleteOne({userId:Id})
            }).then(()=>resolve())
        })
    })
}




function updateUserData(name, username, Id) {

    return new Promise((resolve, reject) => {
        MongoClient.connect(url).then(client => {


            return client.db('database').collection('userData').updateOne({ _id: new ObjectId(Id) }, { $set: { name: name, username: username } })
        }).then(() => {
            resolve()
        })
    })
}





module.exports = { sign, getData, getUserData, removeUser, updateUserData, userDataIsThere };