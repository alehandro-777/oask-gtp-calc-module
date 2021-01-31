const web_api = require('../../web_api')
const db = require('../../db')
const ReportSave = require('../report-save-model')
const Excel = require('exceljs');

const head = require('../header');

const moment = require('moment')
const config = require('config');

const objects = require('../objects')

exports.createReport = async (id, query) => {  
    let contr_hour = config.get('contract_hour')
    let req_data_from = GetStartGasDayStr(query.start, contr_hour);  
    let docs = await db.find(ReportSave, { 'report_id' : id, 'current_time' : req_data_from });

    return docs[0].doc;          
}

exports.createExcel = async (id, query) => {  
    let contr_hour = config.get('contract_hour')
    let req_data_from = GetStartGasDayStr(query.start, contr_hour);  

    return CreateExcelWorkBook(req_data_from, id)
}


function GetStartGasDayStr(time_str, contr_hour) {
    return moment.utc(time_str).startOf('day').add( contr_hour, 'h').format();
}
function GetEndGasDayStr(time_str, contr_hour) {
    return moment.utc(time_str).startOf('day').add( contr_hour, 'h').add(1, 'day').format();
}
function GetNowStr() {
   return moment.utc().format();
}

async function CreateExcelWorkBook(date,id) {

    let contr_hour = config.get('contract_hour')
    let req_data_from = GetStartGasDayStr(date, contr_hour);  
    let docs = await db.find(ReportSave, { 'report_id' : 1, 'current_time' : req_data_from });

    if (docs.length==0) {
        console.error(`Error creating xls report ${id} not'found`);
        return null;
    }

    //console.log(docs)

    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet(docs[0].doc.name);

    let complexHeader = docs[0].doc.header
    let rows = docs[0].doc.rows
    let footer = docs[0].doc.footer

    for (let i = 0; i < complexHeader.length; i++) {
        
        const row = complexHeader[i].map(e=>e.text);
        worksheet.getRow(i+1).values = row;
        // merge by start row, start column, end row, end column (equivalent to K10:M12)
        //worksheet.mergeCells(10,11,12,13);

    }

    let header = complexHeader[complexHeader.length - 1];
    worksheet.columns = header.map(e => ( { 'key': e.text, 'width': 10 } ))


    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        worksheet.addRow(row);    
    }

    worksheet.addRow(footer);

    return workbook   
}

async function TestExcel(date,id) {    
    let workbook = await CreateExcelWorkBook(date,id)
    return workbook.xlsx.writeFile('./temp.xlsx')
}

TestExcel('2021-01-01', 1).then(function() {
    // done
    console.log('file is written');
});