const mongoose = require('mongoose');
const crypto = require('crypto');

const schema = new mongoose.Schema(
  {
    _id: { type: String, default: () => {
      return crypto.createHash('sha512').update(`${Math.random()}${new Date()}`).digest('hex');
    }},
    created: { type: Date, default: () => new Date() },
    expires: { type: Date, default: () => {
      const date = new Date();
      date.setHours(date.getHours() + 1);
      return date;
    }},
    user: { ref: 'user', required: true, type: mongoose.Schema.Types.ObjectId }
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

// Validate user exists
schema.path('user').validate(async (value) => {
  try {
    return await User.findById(value);
  } catch(error) {
    return false;
  }
}, 'User not found');

// Revoke old tokens of token.user
schema.pre('save', async function(next) {
  try {
    await this.revoke();
  } catch (error) {
    throw new Error('Cannot revoke old tokens');
  }

  next();
});

schema.methods.revoke = async function() {
  await Token.update(
    { user: this.user },
    { expires: new Date(null) },
    { strict: true, runValidators: true, multi: true }
  );
};

const Token = mongoose.model('token', schema);
module.exports = Token;
const User = require('./User');