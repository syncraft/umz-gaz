const fs = require('fs');
const util = require('util');
const mongoose = require('mongoose');

const unlink = util.promisify(fs.unlink);

const schema = new mongoose.Schema(
  {
    description: { type: String },
    name: { required: true, type: String },
    page: { ref: 'page', required: true, type: mongoose.Schema.Types.ObjectId },
    size: { required: true, type: Number },
    type: { required: true, type: String }
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

schema.path('page').validate(async value => {
  let page;

  try {
    page = await Page.findById(value);
  } catch(error) {
    return false;
  }

  if (!page) {
    return false;
  }

  return true;
}, 'Page not found');

schema.virtual('url').get(function() {
  return `${process.env.URL}/${process.env.ATTACHMENTS_DIRECTORY}/${this.id}/${this.name}`;
});

schema.virtual('url_thumbnail').get(function() {
  return `${process.env.URL}/${process.env.ATTACHMENTS_DIRECTORY}/${this.id}/${this.name}.thumbnail.jpg`;
});

schema.pre('remove', async function(next) {
  try {
    await unlink(`${process.env.ATTACHMENTS_DIRECTORY}/${this.id}`);
  } catch (error) {
    // throw new Error('Cannot remove attachment file');
  }

  next();
});

const Attachment = mongoose.model('attachment', schema);
module.exports = Attachment;
const Page = require('./Page');