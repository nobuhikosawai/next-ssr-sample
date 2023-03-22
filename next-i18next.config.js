const path = require('path');
module.exports = {
  i18n: {
    defaultLocale: "ja",
    locales: ["ja", "en"],
    localePath: path.resolve("./public/locales"),
  },
};
