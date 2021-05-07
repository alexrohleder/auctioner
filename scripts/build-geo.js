const fs = require("fs");
const path = require("path");
const https = require("https");
const zlib = require("zlib");
const tar = require("tar");

const url =
  "https://raw.githubusercontent.com/GitSquared/node-geolite2-redist/master/redist/GeoLite2-Country.tar.gz";
const dest = path.resolve(__dirname, "../.geolocalization");

if (!fs.existsSync(dest)) {
  fs.mkdirSync(dest);
}

const download = (url) =>
  new Promise((resolve) => {
    https.get(url, (res) => {
      resolve(res.pipe(zlib.createGunzip({})).pipe(tar.t()));
    });
  });

download(url).then(
  (res) =>
    new Promise((resolve, reject) => {
      res.on("entry", (entry) => {
        if (entry.path.endsWith(".mmdb")) {
          const filename = path.join(dest, path.basename(entry.path));
          entry.pipe(fs.createWriteStream(filename));
          console.log("Saved geo database:", filename);
        }
      });

      res.on("error", (e) => {
        reject(e);
      });

      res.on("finish", () => {
        resolve();
      });
    })
);
