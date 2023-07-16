const fs = require("fs"),
    path = require("path");
const axios = require("axios").default,
    JSDOM = require("jsdom").JSDOM;

    const crypto = require('crypto');

    axios.defaults.headers.common['User-Agent'] = "";

class MODULE_MOSTAQL {
    constructor(app) {
        this.app = app;
    }

    async get_reviews( username ) {
        let website_icon;
        let get_page_reviews = async ( page ) => {
            let doc = await (async () => {
                let req;
                try {
                    req = await axios.get(`https://mostaql.com/u/${username}/reviews?order=latest&page=${page}`);
                    return req.data;
                }catch( e ){
                    return e.response.status;
                }
            })();

            if( typeof doc != "string" ){
                return {
                    status: 404,
                    data: []
                };
            }
    
            let jsdom = new JSDOM(doc);

            if( !website_icon ){
                website_icon = jsdom.window.document.querySelector(`link[rel="icon"]`).href;
            }

            let result = Array.from(jsdom.window.document.querySelectorAll(".review")).map(r => {
                var format_textContent = (content) => {
                    return content.split("\n").map(s => s.trim()).filter(s => s).join("")
                };
                return {
                    title: format_textContent(r.querySelector(`h5.project__title`).textContent),
                    owner: r.querySelector("div.profile-details bdi").textContent,
                    pfp: r.querySelector("img.uavatar").src,
                    details: format_textContent(r.querySelector("div.review__details div").innerHTML),
                    date: new Date(r.querySelector("ul.profile__meta time").getAttribute("datetime")).toString(),
                    rating_total: parseFloat(((r.querySelectorAll("div.review-factors i.clr-amber").length / 6)+0.001).toFixed(1)),
                    ratings: {
                        "الاحترافية بالتعامل":r.querySelectorAll("div.review-factors > div:nth-child(1) i.clr-amber").length,
                        "التواصل والمتابعة":r.querySelectorAll("div.review-factors > div:nth-child(2) i.clr-amber").length,
                        "جودة العمل المسلّم":r.querySelectorAll("div.review-factors > div:nth-child(3) i.clr-amber").length,
                        "الخبرة بمجال المشروع":r.querySelectorAll("div.review-factors > div:nth-child(4) i.clr-amber").length,
                        "التسليم فى الموعد":r.querySelectorAll("div.review-factors > div:nth-child(5) i.clr-amber").length,
                        "التعامل معه مرّة أخرى":r.querySelectorAll("div.review-factors > div:nth-child(6) i.clr-amber").length,
                    },
                    website: "mostaql.com",
                    icon: website_icon
                }
            });
            return result;
        }
        let results = [];
        for( let i = 1; true; i++ ){
            let rev = await get_page_reviews( i );
            if( rev.length ){
                results.push(...rev);
            }else{
                break;
            }
        }        
        return {
            status: 200,
            data: results.map( r => {
                return {
                    ...r,
                    id: crypto.createHash('md5').update(`mostaql-${r.title}-${r.date}`).digest('hex')
                }
            })
        };
    }
}

module.exports = [MODULE_MOSTAQL];