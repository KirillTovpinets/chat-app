const User = require('../models/user.model');
const getChatUsers = function(req, res, next){
  User.find({ _id: { $ne: req.user._id }}, function(err, list) {
    if(err){
      console.log(err);
      res.status(500).send();
      return;
    }
    res.send(list);
  })
}

module.exports = {
  getChatUsers
}