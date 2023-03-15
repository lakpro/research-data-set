const fs = require("fs");
var gplay = require("google-play-scraper");
let n = 200;

gplay
  .list({
    country: "in",
    category: gplay.category.FAMILY,
    collection: gplay.collection.TOP_FREE,
    num: n,
  })
  .then(function (info) {
    const id = [];
    const name = [];
    for (let i = 0; i < n; ++i) {
      id.push(info[i].appId);
      name.push(info[i].title);
    }
  })
  .catch(function (err) {
    console.error(err);
  });
