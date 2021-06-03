const Attachment = require('./Attachment');
const mongoose = require('mongoose');

function transform(doc, ret) {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;

  // Depopulate 'parent'
  if (ret.parent) {
    ret.parent = ret.parent.id;
  }
}

const schema = new mongoose.Schema(
  {
    content: { type: String },
    component: { default: 'v-article', type: String },
    datePublished: { required: true, default: Date.now, type: Date },
    disabled: { default: false, type: Boolean },
    image: { ref: 'attachment', type: mongoose.Schema.Types.ObjectId },
    order: { type: Number },
    parent: { ref: 'page', type: mongoose.Schema.Types.ObjectId },
    redirect: { type: String },
    slug: { type: String },
    source: { type: String },
    title: { required: true, type: String },
    titleSubmenu: { type: String },
    description: { type: String }
  },
  {
    toJSON: {
      transform,
      virtuals: true
    },
    toObject: {
      transform,
      virtuals: true
    },
    versionKey: false
  }
);

schema.virtual('attachments', {
  ref: 'attachment',
  localField: '_id',
  foreignField: 'page',
  justOne: false
});

schema.virtual('path').get(function() {
  if (this.parent && this.parent.path) {
    return `${this.parent.path}/${this.slug}`;
  } else {
    return `/${this.slug || ''}`;
  }
});

schema.virtual('breadcrumbs').get(function() {
  if (this.parent && this.parent.breadcrumbs) {
    return [ ...this.parent.breadcrumbs, this._id ];
  } else {
    return [ this._id ];
  }
});

schema.virtual('depth').get(function() {
  if (this.breadcrumbs) {
    return this.breadcrumbs.length;
  }
});

schema.pre('find', function() {
  this.populate({ path: 'attachments', options: { sort: { name: 1 } } });
  this.populate('parent');
});

schema.pre('findOne', function() {
  this.populate({ path: 'attachments', options: { sort: { name: 1 } } });
  this.populate('parent');
});

schema.path('parent').validate(async parent => {
  let page;

  try {
    page = await Page.findById(parent);
  } catch(error) {
    return false;
  }

  if (!page) {
    return false;
  }

  return true;
});

schema.path('slug').validate(async value => {
  return /^[a-z0-9-/]*$/.test(value);
});

schema.pre('remove', async function(next) {
  // Find and remove attachments
  try {
    const attachments = await Attachment.find({ page: this.id });

    for (const attachment of attachments) {
      await attachment.remove();
    }
  } catch (error) {
    // Cannot remove attachments
  }

  // Find and remove page children
  try {
    const pages = await Page.find({ parent: this.id });

    for (const page of pages) {
      await page.remove();
    }
  } catch (error) {
    throw error;
  }

  next();
});

schema.pre('save', async function(next) {
  if (!this.slug) {
    throw new Error('Page must have a slug');
  }

  try {
    const page = await Page.findOne({ parent: this.parent, slug: this.slug });

    if (page && page.id !== this.id) {
      throw new Error('Duplicate path');
    }

    // Calculate order
    if (this.isNew) {
      const page = await Page.findOne({ parent: this.parent, order: { $gte: 0 } }).sort({ order: -1 }).limit(1);
      
      if (page) {
        this.order = page.order + 1;
      } else {
        this.order = 0;
      }
    }
  } catch (error) {
    throw error;
  }

  next();
});

const Page = mongoose.model('page', schema);
module.exports = Page;