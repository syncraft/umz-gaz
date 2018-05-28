const mongoose = require('mongoose');
const socket = require('./socket');

module.exports = function() {
  process.env.url = `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`;
  process.env.attachmentsDirectory = process.env.attachmentsDirectory || 'attachments';

  this.addServerMiddleware({
    path: '/attachments',
    handler: '~/modules/backend/attachments'
  });

  this.nuxt.hook('listen', async (server, { host, port }) => {
    try {
      await mongoose.connect('mongodb://localhost/umz2');
    } catch (error) {
      throw 'Could not connect to database';
    }

    socket(server);
  });
}