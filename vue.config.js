const path = require('path');

module.exports = {
  lintOnSave: false,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', path.resolve(__dirname, 'src/'));
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/scss/_variables.scss";
          @import "@/scss/_mixins.scss";
        `
      }
    }
  }
};