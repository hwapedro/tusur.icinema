module.exports = {
  presets: ["@vue/cli-plugin-babel/preset", {
    exclude: [
      'transform-async-to-generator',
      'transform-regenerator',
      'proposal-async-generator-functions'
    ]
  }]
};
