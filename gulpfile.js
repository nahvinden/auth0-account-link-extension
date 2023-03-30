const gulp = require('gulp');
const util = require('gulp-util');
const ngrok = require('ngrok');
const nodemon = require('gulp-nodemon');
const { install } = require('./modifyRule');
const managementAdapter = require('./lib/managementAdapter');

const { ManagementClientAdapter, getCurrentConfig } = managementAdapter;

gulp.task('run', async () => {
  try {
    const url = await ngrok.connect(3002);

    nodemon({
      script: './index.js',
      ext: 'js json',
      env: {
        EXTENSION_SECRET: 'a-random-secret',
        AUTH0_RTA: 'https://auth0.auth0.com',
        NODE_ENV: 'development',
        WT_URL: url,
        PUBLIC_WT_URL: url
      },
      ignore: [
        'assets/app/',
        'build/webpack',
        'server/data.json',
        'client/',
        'tests/',
        'node_modules/'
      ]
    });

    setTimeout(() => {
      const publicUrl = url;
      util.log('Public Url:', publicUrl);

      util.log('Patching rule on tenant.');
      getCurrentConfig().then((config) => {
        const adapter = new ManagementClientAdapter(config);
        install(adapter, {
          extensionURL: publicUrl,
          username: 'Development',
          clientID: config.AUTH0_CLIENT_ID,
          clientSecret: config.AUTH0_CLIENT_SECRET
        })
          .then(() => {
            util.log('Rule patched on tenant.');
          })
          .catch((error) => {
            util.log("Couldn't patch rule in tenant:", error);
          });
      });
    }, 4000);
  } catch (e) {
    throw e;
  }

});
