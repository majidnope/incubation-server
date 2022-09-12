const { MongoClient, ObjectId } = require("mongodb");
const url = process.env.DATABASE_URL;
function setAppData(body) {
  return new Promise((resolve, rejects) => {
    MongoClient.connect(url).then((result) => {
      const {
        name,
        id,
        address,
        city,
        state,
        email,
        no,
        cname,
        name1,
        name2,
        name3,
        name4,
        name5,
        name6,
        name7,
        name8,
        name9,
      } = body;

      console.log(id);
      result
        .db("database")
        .collection("form")
        .insertOne({
          name: name,
          address: address,
          city: city,
          state: state,
          email: email,
          no: no,
          cname: cname,
          name1: name1,
          name2: name2,
          name3: name3,
          name4: name4,
          name5: name5,
          name6: name6,
          name7: name7,
          name8: name8,
          name9: name9,
          userId: id,
          status: "new",
          progress: 10
        })
        .then((res) => {
          result
            .db("database")
            .collection("userData")
            .updateOne(
              { _id: new ObjectId(id) },
              { $set: { submitted: true, progress: 10 } }
            )
            .then(resolve(res));
        });
    });
  });
}

function getAppData() {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url).then((result) => {
      result
        .db("database")
        .collection("form")
        .find()
        .toArray()
        .then((application) => {
          result
            .db("database")
            .collection("userData")
            .find()
            .toArray()
            .then((users) => {
              resolve({ app: application, users: users });
            });
        });
    });
  });
}

function updateApplication(id, type, index) {
  console.log(id);

  return new Promise((resolve, reject) => {
    MongoClient.connect(url).then((client) => {
      if (type == "booked") {
        client
          .db("database")
          .collection("form")
          .updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: type, slot: index, progress: 100 } }
          )
          .then((result) => {
            client
              .db("database")
              .collection("form")
              .findOne({ _id: new ObjectId(id) })
              .then((data) => {
                client
                  .db("database")
                  .collection("userData")
                  .updateOne(
                    { _id: new ObjectId(data.userId) },
                    { $set: { progress: 100 } }
                  );
              });
          });
      } else if (type=='remove') { 
        client.db('database').collection('form').findOne({ _id: new ObjectId(id) }).then(form => {
          client.db('database').collection('userData').updateOne({ _id: new ObjectId(form.userId) }, { $set: { submitted: false ,progress:0}}).then(() => {
            client.db('database').collection('form').deleteOne({_id:new ObjectId(id)})
          })
        })
      }
      else {
        client
          .db("database")
          .collection("form")
          .updateOne(
            { _id: new ObjectId(id) },
            {
              $set: {
                status: type,
                progress: (() => {
                  switch (type) {
                    case "pending":
                      return 40;
                    case "approved":
                      return 70;
                    default:
                      return "rejected";
                  }
                })(),
              },
            }
          )
          .then((result) => {
            console.log(result);
            switch (type) {
              case "pending":
                client
                  .db("database")
                  .collection("form")
                  .findOne({ _id: new ObjectId(id) })
                  .then((data) => {
                    client
                      .db("database")
                      .collection("userData")
                      .updateOne(
                        { _id: new ObjectId(data.userId) },
                        { $set: { progress: 40 } }
                      );
                  });

                break;
              case "approved":
                client
                  .db("database")
                  .collection("form")
                  .findOne({ _id: new ObjectId(id) })
                  .then((data) => {
                    client
                      .db("database")
                      .collection("userData")
                      .updateOne(
                        { _id: new ObjectId(data.userId) },
                        { $set: { progress: 70 } }
                      );
                  });
                break;
              default:
                client
                  .db("database")
                  .collection("form")
                  .findOne({ _id: new ObjectId(id) })
                  .then((data) => {
                    client
                      .db("database")
                      .collection("userData")
                      .updateOne(
                        { _id: new ObjectId(data.userId) },
                        { $set: { progress: "rejected" } }
                      );
                  });

                break;
            }
            resolve(result);
          });
      }
    });
  });
}

module.exports = { setAppData, getAppData, updateApplication };
