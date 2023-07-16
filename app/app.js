const fs = require("fs"),
    path = require("path");

const initialize = require("./initialize");

class APP {
    dir = {
        data: path.join(__dirname,"./../data/"),
        public:  path.join(__dirname,"./../public/"),
        root:  path.join(__dirname,"./../"),
    }
    constructor(config) {
        this.config = config;
    };
    async start() {
        await initialize(this);
        this.web.start();
    }
}

module.exports = APP;