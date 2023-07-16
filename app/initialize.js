const fs = require("fs"),
    path = require("path");

function walk(dir, done) {
    var results = [];
    fs.readdir(dir, function (err, list) {
        if (err) return done(err);
        var pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function (file) {
            file = path.resolve(dir, file);
            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function (err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    results.push(file);
                    if (!--pending) done(null, results);
                }
            });
        });
    });
};

async function initialize( app ){
    let module_files = await new Promise((resolve,reject)=>{
        walk( path.join(__dirname, "./modules"), ( err, files ) => {
            if( err ){
                reject( err );
            }else{
                resolve( files );
            }
        })
    });
    let modules = module_files.filter(m => !path.basename(m).startsWith(".")).map(m => require(m));
    for (let m of modules) {
        let ms;
        if (Array.isArray(m)) {
            ms = m;
        } else {
            ms = [m];
        }
        for (let i = 0; i < ms.length; i++) {
            let name = ms[i].name.split("MODULE_")[1];
            app[name.toLowerCase()] = new ms[i](app);
            console.log(`[INIT] module class ${ms[i].name} is loaded as APP.${name.toUpperCase()}`)
        }
    };
}

module.exports = initialize;