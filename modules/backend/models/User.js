const mongoose = require('mongoose');
const crypto = require('crypto');

const schema = new mongoose.Schema(
  {
    username: { required: true, type: String, unique: true },
    password: { required: true, type: String }
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
      virtuals: true
    },
    toObject: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
      virtuals: true
    },
    versionKey: false
  }
);

schema.methods.validatePassword = function(password) {
  if (this.password === crypto.createHash('sha512').update(password).digest('hex')) {
    return true;
  } else {
    return false;
  }
};

const User = mongoose.model('user', schema);
module.exports = User;