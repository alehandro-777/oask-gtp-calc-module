const web_api = require('../../web_api')
const moment = require('moment')
const config = require('config');
const header = require('../header');

function Generate() {
    const csv_separ = ";";
    const contr_hour = config.get('contract_hour')

    let req_data_from = '2021-01-01';
    let req_data_to = '2021-01-02';

    const header_cfg =[
        `;Назва;Обсяг газу за добу, тис. м3;;;Обсяг газу з початку місяця, тис. м3;;`,
        `;;"План(заявки та ВТП)";Факт;Відхилення;"План 68(заявки та ВТП)";Факт 67;Відхилення 89`,
        `;1;2;3;4;5;6;7`
    ]

    const rows_cfg =[
        `1;РОЗБАЛАНС* ;sum;sum;sum;sum;sum;sum`,
        `2;  Угерське ПСГ, відбір;113;F2(110,181,1);;113;120;`,
        `3;  Угерське ПСГ, закачка;114;F2(110,181,2);;114;121;`,
        `4;  Більче-Волицьке ПСГ, відбір;115;F2(110,181,1);;115;122;`,
        `5;  Більче-Волицьке ПСГ, закачка;116;F2(110,181,2);;116;123;`,
        `6;  Дашавське ПСГ, відбір;117;F2(110,181,1);;117;124;`,
        `7;  Дашавське ПСГ, закачка;118;F2(110,181,2);;118;125;`,
        `8;  Опарське ПСГ, відбір;119;F2(110,181,1);;119;126;`,
        `9;  Опарське ПСГ, закачка;120;F2(110,181,2);;120;127;`,
        `10;  Богородчанське ПСГ, відбір;121;F2(110,181,1);;121;128;`,
        `11;  Богородчанське ПСГ, закачка;122;F2(110,181,2);;122;129;`,
        `12;  Олишівське ПСГ, відбір;123;F2(110,181,1);;123;130;`,
        `13;  Олишівське ПСГ, закачка;124;F2(110,181,2);;124;131;`,
        `14;  Мринське ПСГ, відбір;125;F2(110,181,1);;125;132;`,
        `15;  Мринське ПСГ, закачка;126;F2(110,181,2);;126;133;`,
        `16;  Солохівське ПСГ, відбір;127;F2(110,181,1);;127;134;`,
        `17;  Солохівське ПСГ, закачка;128;F2(110,181,2);;128;135;`,
        `18;  Пролетарське ПСГ, відбір;129;F2(110,181,1);;129;136;`,
        `19;  Пролетарське ПСГ, закачка;130;F2(110,181,2);;130;137;`,
        `20;  Кегичівське ПСГ, відбір;131;F2(110,181,1);;131;138;`,
        `21;  Кегичівське ПСГ, закачка;132;F2(110,181,2);;132;139;`,
        `22;  Краснопопівське ПСГ, відбір;133;F2(110,181,1);;133;140;`,
        `23;  Краснопопівське ПСГ, закачка;134;F2(110,181,2);;134;141;`
       
    ]

    let head = header.parse(header_cfg, csv_separ)


//console.log(head)

    for (let i = 0; i < rows_cfg.length; i++) {
        let columns = rows_cfg.split(csv_separ);
        ProcessRowObject(columns, req_data_from, req_data_to)
    }
}

async function ProcessRowObject(args, req_data_from, req_data_to) {
    // step 1 query all api data columns (number in binding !!!)
    for (let i = 1; i < args.length; i++) {
        if (typeof +args[i] == 'number') {
            args[i] = web_api.getOaskGtpCurrPointValue(args[i], req_data_from, req_data_to );
        }    
    }
    try {
        args = await Promise.all(args)
    } 
    catch (error) {
        console.log(error)
    } 

}





function GetStartGasMonthStr(time_str, contr_hour) {
    return moment.utc(time_str).startOf('month').add( contr_hour, 'h').format();
}

function GetStartGasYearStr(time_str, contr_hour) {
    return moment.utc(time_str).startOf('year').add( contr_hour, 'h').format();
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




Generate()