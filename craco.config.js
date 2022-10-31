/* craco.config.js */
const path = require('path');
module.exports = {
  webpack: {
    // 别名
    alias: {
      "@": path.resolve(__dirname,"src"),
      "@utils": path.resolve("src/utils"),
    }
  },
}
