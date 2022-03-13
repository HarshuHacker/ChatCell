const env = require("./environment")
const fs = require("fs")
const path = require("path")

module.exports = function(app){
  app.locals.assetPath = function(filePath){
    if(env.name == "development"){
      return "/" + filePath
    }
    return '/' + JSON.parse(fs.readFileSync(path.join(__dirname,"../Public/Assets/rev-manifest.json")))[filePath]
  }
}