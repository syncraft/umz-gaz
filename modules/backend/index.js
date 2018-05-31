module.exports = async function() {
  process.env.URL = process.env.URL || `http://localhost:${process.env.PORT || 3000}`;
  process.env.ATTACHMENTS_DIRECTORY = process.env.ATTACHMENTS_DIRECTORY || 'attachments';

  this.addServerMiddleware({
    path: '/attachments',
    handler: '~/modules/backend/attachments'
  });
}