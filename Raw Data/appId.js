const fs = require("fs");
var gplay = require("google-play-scraper");
let n = 1000;
const cat = require("./categories.json");

for (c in cat) {
  // if (c == 2) break;
  const CURR_CAT = cat[c];
  console.log(CURR_CAT);

  gplay
    .list({
      country: "in",
      category: CURR_CAT,
      collection: gplay.collection.TOP_FREE,
      num: n,
    })
    .then(function (info) {
      const id = [];
      // const name = [];
      for (let i = 0; i < n; ++i) {
        if (info[i] == undefined) continue;
        id.push(info[i].appId);
        // name.push(info[i].title);
        console.log(i);
      }

      var jsonContent = JSON.stringify(id);
      fs.writeFile(
        `./app_ids/${CURR_CAT}.json`,
        jsonContent,
        "utf8",
        function (err) {
          if (err) {
            return console.log(err);
          }
        }
      );
    })
    .catch(function (err) {
      console.error(err);
    });
}
