const path = require('path');
const etag = require('etag');
const gm = require('gm');
const ffmpeg = require('fluent-ffmpeg');
const Attachment = require('./models/Attachment');
const app = require('express')();

app.get('/:id/:name.thumbnail.jpg', async (request, response, next) => {
  try {
    const attachment = await Attachment.findOne({ _id: request.params.id, name: request.params.name });
    const file = `${process.env.ATTACHMENTS_DIRECTORY}/${attachment.id}`;

    if (attachment) {
      const etagGenerated = etag(attachment.url + JSON.stringify(request.query));
      let width = request.query.width ? parseInt(request.query.width) : 200;
      let height = request.query.height ? parseInt(request.query.height) : 200;
      let written = false;

      if (width > 500) {
        width = 500;
      }
    
      if (height > 500) {
        height = 500;
      }

      response.setHeader('Cache-Control', 'public, max-age=0');
      response.setHeader('ETag', etagGenerated);

      if (request.headers['if-none-match'] && request.headers['if-none-match'] === etagGenerated) {
        response.sendStatus(304);
      } else {
        switch(attachment.type) {
        case 'video/mpeg':
        case 'video/mp4':
          try {
            ffmpeg(path.resolve(file))
              .format('mjpeg')
              .frames(1)
              .size(width > height ? `?x${height}` : `${width}x?`)
              .on('error', (error) => next({ code: 500, message: error.message }))
              .on('progress', () => written = true)
              .on('end', () => {
                if (!written) {
                  response.sendFile(path.resolve(__dirname, '../../assets/images/no-image.jpg'));
                } else {
                  response.end();
                }
              })
              .pipe(response, { end: false });
          } catch (error) {
            return next({ code: 500, message: error.message });
          }
            
          break;
  
        default:
          try {
            gm(path.resolve(file))
              .resize(width, height)
              .noProfile()
              .scene(1)
              .flatten()
              .stream('jpg')
              .on('error', (error) => next({ code: 500, message: error.message }))
              .on('data', () => written = true)
              .on('end', () => {
                if (!written) {
                  response.sendFile(path.resolve(__dirname, '../../assets/images/no-image.jpg'));
                } else {
                  response.end();
                }
              })
              .pipe(response, { end: false });
          } catch (error) {
            return next({ code: 500, message: error.message });
          }
  
          break;
        }
      }
    } else {
      return next({ code: 404 });
    }
  } catch (error) {
    return next(error);
  }
});

app.get('/:id/:name', async (request, response, next) => {
  try {
    const attachment = await Attachment.findOne({
      _id: request.params.id,
      name: request.params.name
    });

    if (attachment) {
      response.contentType(attachment.type);
      response.sendFile(path.resolve(`${process.env.ATTACHMENTS_DIRECTORY}/${attachment.id}`));
    } else {
      return next({ code: 404 });
    }
  } catch (error) {
    return next(error);
  }
});

module.exports = app;