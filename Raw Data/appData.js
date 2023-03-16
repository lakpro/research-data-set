var requireDir = require("require-dir");
// change path
var dir = requireDir("./app_ids");
const start = Date.now();
var gplay = require("google-play-scraper");
const fs = require("fs");
var z = 1;
// console.log(dir);
async function main() {
  var index = 0;
  for (const key in dir) {
    console.log(key);
    index = index + 1;
    if (index < 48) continue;
    const ids = `${dir[key]}`;
    const myArray = ids.split(",");
    const n = myArray.length;
    console.log(n);

    // change path
    if (!fs.existsSync(`./apps_data/${key}`))
      fs.mkdirSync(`./apps_data/${key}`);

    for (let i = 0; i < n; ++i) {
      await gplay.datasafety({ appId: myArray[i] }).then(
        function x(y) {
          //   console.log(y);

          var jsonContent = JSON.stringify(y);
          //change path
          fs.writeFile(
            `./apps_data/${key}/${myArray[i]}.json`,
            jsonContent,
            "utf8",
            function (err) {
              if (err) {
                return console.log(err);
              }
            }
          );

          const end = Date.now();
          console.log(index, i);
          var number = (end - start) / 60000;
          number = Math.trunc(number * 100) / 100;
          var number2 = (number / z) * 60;
          number2 = Math.trunc(number2 * 100) / 100;
          console.log(`Execution time: ${number} min `);
          console.log(`Execution time per app: ${number2} sec `);
          z = z + 1;
          //   gplay.app({ appId: id[i] }).then(function (z) {
          //     cData[idx["App Name"]] = z.title;
          //     cData[idx["Genre"]] = z.genre;
          //   });
        }
        // final.push(`${user[key]}`);
      );
    }
  }
}

main();
