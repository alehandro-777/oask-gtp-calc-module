const db = require('../db')
const ReportSave = require('./report-save-model')
const Report = require('./report-model')
const moment = require('moment')
const config = require('config');
const head = require('./header');
const objects1 = require('./objects')
const objects = require('./objects1')


exports.createReports = async () => { 
    let contr_hour = config.get('contract_hour')

    let reports =[1,2,3]
    let init_history_day_count =27;

    const end_date = moment().startOf('day');
    end_date.add(contr_hour, 'h')
    const start_date = end_date.clone().subtract(init_history_day_count, 'day'); 

    await objects.Init()
/*
    //.format('YYYY-MM-DDTHH:mm')
    let date = '2021-01-05'
    let req_data_from = GetStartGasDayStr(date, contr_hour);
    let req_data_to = GetEndGasDayStr(date, contr_hour);
    let res = await createReport1( 1, req_data_from, req_data_to)
    res = await createReport1( 2, req_data_from, req_data_to)
    res = await createReport1( 3, req_data_from, req_data_to)
*/

   let res = await RequestManyDays(reports, start_date, end_date, contr_hour)
}

async function RequestManyDays(reports, start_date, end_date, contr_hour) {    
    let index = start_date.clone();
    while (index <= end_date) {
        let req_data_from = GetStartGasDayStr(index.format('YYYY-MM-DD'), contr_hour);
        let req_data_to = GetEndGasDayStr(index.format('YYYY-MM-DD'), contr_hour);        
        for (let i = 0; i < reports.length; i++) {
            const rep = reports[i];
            //console.log("Create report ", rep, req_data_from, req_data_to)
            let res = await createReport1( rep, req_data_from, req_data_to)
        }
      index.add(1, 'days')
    }
}


async function createReport1(id, req_data_from, req_data_to) {    

    let report = await db.findById(Report, {"_id": id});    
    let report_save = await db.find(ReportSave, { 'report_id' : id, 'current_time' : req_data_from });
    
    if (report_save.length > 0 ) {
        console.log(`Report: ${id} saved on ${req_data_from} exists - dont need update`)
        return
    } 

    if (report.rows.length == 1) {
        //columns report
        return await CreateColumnedReport(id, report.header, report.rows, report.footer, req_data_from, req_data_to)
    }
    else {
        //rows report
        return await CreateRowedReport(id, report.header, report.rows, req_data_from, req_data_to)
    }
}

async function CreateColumnedReport(id, header_cfg, rows_objects, footer_object, req_data_from, req_data_to) {
    let report_columns = [];
    let footer_columns = [];

    try {
        let obj = objects.getObject(rows_objects[0])
        //report_columns = await obj.fn( req_data_from, req_data_to, obj.args)
        report_columns = await obj( req_data_from, req_data_to, obj.args)
        //console.log(report_columns)
        obj = objects.getObject(footer_object)
        //footer_columns = await obj.fn( req_data_from, req_data_to, obj.args)
        footer_columns = await obj( req_data_from, req_data_to, obj.args)
        //console.log(footer_columns)
    } 
    catch (error) {
        console.error(error)
        return
    }  
    
    let footer = ConvertArrayToObject(footer_columns)
    //console.log( footer)

    //step 4 - convert columns to rows
    let rows = ConvertColumsToRows(report_columns)
 
    let header = head.parse(header_cfg, ";")

    let newSave = new ReportSave({ report_id :id, current_time:req_data_from,  doc: {header, rows, footer} } ) ;      
    return db.create(newSave) 
}

async function CreateRowedReport(id, header_cfg, rows_objects, req_data_from, req_data_to) {
    let promises = [];
    let report_rows = [];
    let rows = [];

    for (let i = 0; i < rows_objects.length; i++) {
        const obj_id = rows_objects[i];
        let obj = objects.getObject(obj_id)
        //let prms =  obj.fn( req_data_from, req_data_to, obj.args)
        let prms =  obj( req_data_from, req_data_to, obj.args)
        promises.push(prms)            
    }

    try {
        report_rows = await Promise.all(promises)
    } 
    catch (error) {
        console.error(error)
    }  

    for (let i = 0; i < report_rows.length; i++) {
        const row_arr = report_rows[i];
        let row = ConvertArrayToObject(row_arr)
        rows.push(row)
    }

    let header = head.parse(header_cfg, ";")

    let newSave = new ReportSave({ report_id :id, current_time:req_data_from,  doc: {header, rows} } ) ;      
    return db.create(newSave) 
}



//support functions

function ConvertArrayToObject(footer_arr, dec=1) {
    return footer_arr.reduce( (acc, curr, i) => {
        if (typeof curr == 'number') {
            acc[i+1] = Number(curr.toFixed(dec) )           
        }
        else {
            acc[i+1] = curr
        }        
        return acc
    }, {})
}
function ConvertColumsToRows(columns, dec=1) {
    let big_arr =[];
    for (let i = 0; i < columns.length; i++) {   
        const column = columns[i];
        if (!column) continue;        

        for (let j = 0; j < column.length; j++) {
            const value = column[j];
            value['column_id'] = i+1;
            big_arr.push(value);
        }
    }
    SortValuesByCurrentTime(big_arr);    
    let rows = ConverValuesToRows(big_arr, dec);
    return rows;
}
function SortValuesByCurrentTime(values) {
    return values.sort((a,b) => (a.current_time > b.current_time) ? 1 : ((b.current_time > a.current_time) ? -1 : 0)); 
}
function ConverValuesToRows(values, dec=1) {
    let result = [];
    let obj;

    let current_time;
    for (let i = 0; i < values.length; i++) {
        const value = values[i];
        //test for bad object
        if (!value.current_time) {
            console.error("ConverValuesToRows", value)
            continue
        }
        
        if (current_time != value.current_time) {
            if (obj) result.push(obj);            
            //new row
            current_time = value.current_time;
            obj = {};
            let t = current_time.split('T');
            let t2 = t[1].split(':');
            obj['1'] = t2[0] + ":" + t2[1];
        }
        obj[value.column_id] = value.num_value.toFixed(dec);
    }
    //push last row
    if (obj) result.push(obj);
    return result;
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