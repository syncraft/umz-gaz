const mongoose = require('mongoose');
const Attachment = require('./models/Attachment');
const Page = require('./models/Page');
const Token = require('./models/Token');
const User = require('./models/User');
const fs = require('fs');
const util = require('util');
const sendmail = require('sendmail');
const url = require('url');

const exists = util.promisify(fs.exists);
const open = util.promisify(fs.open);
const mkdir = util.promisify(fs.mkdir);
const write = util.promisify(fs.write);
const close = util.promisify(fs.close);
const unlink = util.promisify(fs.unlink);

module.exports = function(server) {
  mongoose.connect(`mongodb://${process.env.MONGODB_HOST || 'localhost'}/${process.env.MONGODB_COLLECTION || 'umz'}`);
  const io = require('socket.io')(server);

  io.on('connection', (socket) => {
    let uploads = {};

    async function checkToken(token) {
      try {
        if (await Token.findById(token.id).where('expires').gt(new Date().getUTCMilliseconds())) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    }

    async function removeUpload(id) {
      if (id in uploads) {
        try {
          await unlink(`${process.env.ATTACHMENTS_DIRECTORY}/${id}`);
        } catch (error) {
          throw error;
        } finally {
          delete uploads[id];
        }
      }
    }

    socket.on('disconnect', () => {
      for (const id in uploads) {
        removeUpload(id);
      }
    });

    socket.on('searchPages', async ({ projection, id, parent, path, component, depth, limit = 50, skip = 0, sort = 'order', order = 'asc' } = {}, callback) => {
      let data = [];
      let error;

      try {
        data = await Page
          .find({
            ...id ? { _id: mongoose.Types.ObjectId(id) } : {},
            ...parent ? { parent } : {},
            ...component ? { component } : {},
          })
          .select(projection)
          .sort({ [sort]: order === 'desc' ? -1 : 1 });

        data = data.filter(page => {
          if (path && !RegExp(`^${path}$`).test(page.path)) {
            return false;
          }

          if (depth && page.depth !== depth) {
            return false;
          }

          return true;
        });

        data = data.slice(skip, skip + limit);
      } catch (e) {
        error = e.message;
      } finally {
        if (callback) {
          callback({ data, error });
        }
      }
    });

    socket.on('createPages', async ({ token, pages }, callback) => {
      let data = [];
      let error;

      try {
        if (await checkToken(token)) {
          for (const form of pages) {
            const page = new Page(form);
            await page.save();
            data.push(await Page.findById(page.id));
          }
        } else {
          throw new Error('Access denied');
        }
      } catch (e) {
        error = e.message;
      } finally {
        if (callback) {
          callback({ data, error });
        } else {
          socket.emit('createPages', { data, error });
        }

        socket.broadcast.emit('createPages', { data, error });
      }
    });

    socket.on('deletePages', async ({ token, pages }, callback) => {
      let data = [];
      let error;

      try {
        if (await checkToken(token)) {
          for (const form of pages) {
            let page = await Page.findById(form.id);
          
            if (page) {
              data.push({ id: form.id });
              await page.remove();
            }
          }
        } else {
          throw new Error('Access denied');
        }
      } catch (e) {
        error = e.message;
      } finally {
        if (callback) {
          callback({ data, error });
        } else {
          socket.emit('deletePages', { data, error });
        }

        socket.broadcast.emit('deletePages', { data, error });
      }
    });

    socket.on('updatePages', async ({ token, pages }, callback) => {
      let data = [];
      let error;

      try {
        if (await checkToken(token)) {
          for (let form of pages) {
            const page = await Page.findById(form.id);
            page.set(form);
            await page.save();
            data.push(await Page.findById(page.id));
          }
        } else {
          throw new Error('Access denied');
        }
      } catch (e) {
        error = e.message;
      } finally {
        if (callback) {
          callback({ data, error });
        } else {
          socket.emit('updatePages', { data, error });
        }

        socket.broadcast.emit('updatePages', { data, error });
      }
    });

    socket.on('uploadAttachment', async ({ token, name, size, type, page }, callback) => {
      let error;
      let id;

      try {
        if (await checkToken(token)) {
          id = mongoose.Types.ObjectId();

          uploads[id] = {
            name,
            size,
            type,
            page
          };
        } else {
          throw new Error('Access denied');
        }
      } catch (e) {
        error = e.message;
      } finally {
        if (callback) {
          callback({ id, error });
        }
      }
    });

    socket.on('uploadAttachmentData', async ({ token, id, data }, callback) => {
      let error;

      try {
        if (await checkToken(token)) {
          if (id in uploads) {
            const buffer = new Buffer(new Uint8Array(data));
    
            try {
              if (!(await exists(process.env.ATTACHMENTS_DIRECTORY))) {
                await mkdir(process.env.ATTACHMENTS_DIRECTORY);
              }
    
              const file = await open(`${process.env.ATTACHMENTS_DIRECTORY}/${id}`, 'a');
              await write(file, buffer);
              await close(file);
            } catch (e) {
              removeUpload(id);
              throw e;
            }
          } else {
            throw new Error('Attachment not found');
          }
        } else {
          throw new Error('Access denied');
        }
      } catch (e) {
        error = e;
      } finally {
        if (callback) {
          callback({ error });
        }
      }
    });

    socket.on('uploadAttachmentDone', async ({ token, id }, callback) => {
      let data = [];
      let error;

      try {
        if (await checkToken(token)) {
          const attachment = new Attachment({
            _id: id,
            ...uploads[id]
          });

          await attachment.save();
          data.push(await Page.findById(attachment.page));
          socket.broadcast.emit('updatePages', { data });
        } else {
          throw new Error('Access denied');
        }
      } catch (e) {
        error = e;
      } finally {
        delete uploads[id];

        if (callback) {
          callback({ data, error });
        } else {
          socket.emit('updatePages', { data });
        }
      }
    });

    socket.on('uploadAttachmentAbort', async ({ token, id }, callback) => {
      let error;

      try {
        if (await checkToken(token)) {
          removeUpload(id);
        } else {
          throw new Error('Access denied');
        }
      } catch (e) {
        error = e;
      } finally {
        if (callback) {
          callback({ error });
        }
      }
    });

    socket.on('deleteAttachments', async ({ token, attachments }, callback) => {
      let data = [];
      let error;

      try {
        if (await checkToken(token)) {
          for (const form of attachments) {
            let attachment = await Attachment.findById(form.id);
          
            if (attachment) {
              await attachment.remove();
              data.push(await Page.findById(attachment.page));
            }
          }

          socket.broadcast.emit('updatePages', { data });
        } else {
          throw new Error('Access denied');
        }
      } catch (e) {
        error = e.message;
      } finally {
        if (callback) {
          callback({ data, error });
        } else {
          socket.emit('updatePages', { data, error });
        }
      }
    });

    socket.on('sendEmail', async ({ form }, callback) => {
      sendmail({
        silent: true
      })(
        {
          from: `noreply@${url.parse(process.env.URL).hostname}`,
          to: 'zyxd@syncraft.ru',
          subject: 'Сообщение с сайта umz-gaz.ru',
          text: `
            Отправитель: ${form.name}
            Телефон: ${form.phone}
            E-mail: ${form.email}
            ${form.company ? `Компания: ${form.company}` : ''}
  
            Сообщение:
            ${form.message}
          `
        },
        
        function(error) {
          if (callback) {
            callback({ error });
          }
        }
      );
    });

    socket.on('login', async ({ username, password }, callback) => {
      let token;
      let error;

      try {
        const user = await User.findOne({ username });

        if (user && user.validatePassword(password)) {
          token = new Token({ user: user.id });      
          await token.save();
        } else {
          throw new Error('User does not exist or password is incorrect');
        }
      } catch (e) {
        error = e.message;
      } finally {
        if (callback) {
          callback({ token, error });
        }
      }
    });

    socket.on('logout', async ({ token }, callback) => {
      let error;

      try {
        if (await checkToken(token)) {
          const t = await Token.findById(token.id);
          
          if (t) {
            await t.revoke();
          }
        } else {
          throw new Error('Access denied');
        }
      } catch (e) {
        error = e.message;
      } finally {
        if (callback) {
          callback({ error });
        }
      }
    });
  });
}