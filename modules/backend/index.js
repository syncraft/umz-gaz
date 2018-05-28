const mongoose = require('mongoose');
const socket = require('./socket');

module.exports = function() {
  process.env.URL = process.env.URL || `http://localhost:${process.env.PORT || 3000}`;
  process.env.MONGODB_HOST = process.env.MONGO_HOST || 'localhost';
  process.env.MONGODB_COLLECTION = process.env.MONGODB_COLLECTION || 'umz';
  process.env.ATTACHMENTS_DIRECTORY = process.env.ATTACHMENTS_DIRECTORY || 'attachments';

  this.addServerMiddleware({
    path: '/attachments',
    handler: '~/modules/backend/attachments'
  });

  this.nuxt.hook('listen', async (server, { host, port }) => {
    try {
      await mongoose.connect(`mongodb://${process.env.MONGODB_HOST}/${process.env.MONGODB_COLLECTION}`);
    } catch (error) {
      throw error;
    }

    socket(server);
  });
}