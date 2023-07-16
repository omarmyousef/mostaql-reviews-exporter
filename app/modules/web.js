const fs = require("fs"),
    path = require("path"),
    express = require("express"),
    crypto = require("crypto"),
    http = require("http"),
    bodyParser = require('body-parser'),
    stream = require("stream");

class MODULE_WEB {

    constructor(app) {
        this.app = app;
    }

    async start() {
        const that = this;
        this.server = express();
        this.server.use("/public", express.static(path.join(this.app.dir.public)));
        this.server.use(bodyParser.json());
        this.server.use(bodyParser.urlencoded({
            extended: true
        }));

        this.server.get("/", (req, res) => {
            res.sendFile(path.join(this.app.dir.public, "./html/index.html"))
        });

        this.server.get("/submit", async (req, res) => {

            let data = await this.app.mostaql.get_reviews(req.query.username);

            if( data.status != 200 ){
                return res.json({success:false});
            }

            let excel = await this.app.excel.export( data.data );
            
            var fileContents = Buffer.from(excel, "base64");
  
            var readStream = new stream.PassThrough();
            readStream.end(fileContents);

            res.set('Content-disposition', 'attachment; filename=' + `mostaql/${req.query.username} - reviews.xlsx`);
            res.set('Content-Type', 'text/plain');

            readStream.pipe(res);
        });

        this.server.listen(this.app.config.port, () => {
            console.log(`[EXPRESS] server is listening to :${this.app.config.port}`)
        });
    }
}

module.exports = [MODULE_WEB];