var express = require("express");
var router = express.Router();
const { getAppData, updateApplication } = require("../model/appli");
const { getUserData, removeUser, updateUserData } = require("../model/sign");

/* GET users listing. */
router.get("/adminhome", function (req, res, next) {
  getAppData().then((data) => {
    res.json(data);
  });
});

router.delete("/userRemove", function (req, res, next) {
  console.log("from user", req.body);
  removeUser(req.body).then((data) => {
    res.json(data);
    console.log(data);
  });
});

router.delete("/updateUser", function (req, res, next) {
  updateUserData(req.body).then((data) => {
    res.json(data);
    console.log(data);
  });
});

router.get("/open", function (req, res, next) {
  console.log(req.body, "from open");
  getAppData(req.body).then((data) => {
    res.json(data);
    console.log(data);
  });
});

router.put("/form-update", (req, res) => {
  updateApplication(req.body.id, req.body.type, req.body.index).then(
    res.json({ done: true })
  );
});

module.exports = router;
