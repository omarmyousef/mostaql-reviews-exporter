const fs = require("fs"),
    path = require("path");

// Require library
var xl = require('excel4node');

class MODULE_EXCEL {
    constructor(app) {
        this.app = app;
    }
    
    async export( data ){
        var wb = new xl.Workbook();
        var ws = wb.addWorksheet('Reviews');

        ws.cell(1, 1).string("تاريخ التقييم");
        ws.cell(1, 2).string("مالك المشروع");
        ws.cell(1, 3).string("عنوان المشروع");
        ws.cell(1, 4).string("التعليق");
        ws.cell(1, 5).string("التقييم");
        ws.cell(1, 6).string("الاحترافية بالتعامل");
        ws.cell(1, 7).string("التواصل والمتابعة");
        ws.cell(1, 8).string("جودة العمل المسلّم");
        ws.cell(1, 9).string("الخبرة بمجال المشروع");
        ws.cell(1, 10).string("التسليم فى الموعد");
        ws.cell(1, 11).string("التعامل معه مرّة أخرى");
        ws.column(3).setWidth(20);
        ws.column(4).setWidth(40);
        ws.column(6).setWidth(16);
        ws.column(7).setWidth(16);
        ws.column(8).setWidth(16);
        ws.column(9).setWidth(16);
        ws.column(10).setWidth(16);
        ws.column(11).setWidth(16);

        for( let i = 2; i <= data.length+1; i++ ){
            let review = data[i-2];
            ws.cell(i, 1).date(new Date(review.date));
            ws.cell(i, 2).string(review.owner);
            ws.cell(i, 3).string(review.title);
            ws.cell(i, 4).string(review.details.replaceAll("<br>","\n"));
            ws.cell(i, 5).number(review.rating_total);
            ws.cell(i, 6).number(review.ratings["الاحترافية بالتعامل"]);
            ws.cell(i, 7).number(review.ratings["التواصل والمتابعة"]);
            ws.cell(i, 8).number(review.ratings["جودة العمل المسلّم"]);
            ws.cell(i, 9).number(review.ratings["الخبرة بمجال المشروع"]);
            ws.cell(i, 10).number(review.ratings["التسليم فى الموعد"]);
            ws.cell(i, 11).number(review.ratings["التعامل معه مرّة أخرى"]);
        }

        let buffer = await wb.writeToBuffer();

        return buffer;

        console.log(" DONE ! ");
    }
}

module.exports = [MODULE_EXCEL];