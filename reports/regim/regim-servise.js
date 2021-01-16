const web_api = require('../../web_api')
const markup = require('./header')
const head = require('../header');

const moment = require('moment')
const config = require('config');

const objects = require('../objects')

exports.createReport = async (id, query) => {    
    const header_cfg =[
        `Година;ОГСУ, усього;;ПСГ Богородчани;;;;;;;ПСГ Опарське;;;;;;;;;;;ПСГ Дашавське;;;;;;;ПСГ Угерське;;;;;;;ПСГ Більче-Волиця;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;ПСГ Мринське;;;;;;;;;;;ПСГ Солоха;;;;;;;ПСГ Олишівка;;;;;;;ПСГ Пролетарське;;;;;;;ПСГ Кегичівське;;;;;;;ПСГ Краснопопівське;;;;;;`,
        `;Q зак.;Q відб;ДКС Богородчани;;;;ПСГ;;;ДКС-1;;;;ДКС-2;;;;ПСГ;;;ДКС;;;;ПСГ;;;ДКС;;;;ПСГ;;;ВОГ Більче-Волиця;;;;КЦ1;;;;КЦ1А;;;;КЦ2;;;;КЦ3;;;;КЦ4;;;;ПСГ;;;ГЗП-1;;;;ГЗП-2;;;;ГЗП-3;;;;ГЗП-4;;;;КС-5 Бобровницька;;;;ДКС-Мрин;;;;ПСГ;;;ДКС Солоха;;;;ПСГ;;;ДКС Олишівка;;;;ПСГ;;;ДКС Пролетарка;;;;ПСГ;;;ДКС Кегичівка;;;;ПСГ;;;ДКС Краснопопівка;;;;ПСГ;;`,
        `;;;МК-8М;;;ххх;К-сть свердловин;;ххх;МК-8М;;;;МК-8М;;;;К-сть свердловин;;ххх;МК-8М;;;ххх;К-сть свердловин;;ххх;МК-8М;;;ххх;К-сть свердловин;;ххх;1200;;1400;;МК-8М;;;ххх;МК-8М;;;ххх;МК-8М;;;ххх;МК-8М;;;ххх;МК-8М;;;ххх;К-сть свердловин;;ххх;К-сть свердловин;;;ххх;К-сть свердловин;;;ххх;К-сть свердловин;;;ххх;К-сть свердловин;;;ххх;МК-8М;;;;МК-8М;;;;К-сть свердловин;;ххх;МК-8М;;;ххх;К-сть свердловин;;ххх;МК-8М;;;ххх;К-сть свердловин;;ххх;МК-8М;;;ххх;К-сть свердловин;;ххх;МК-8М;;;ххх;К-сть свердловин;;ххх;МК-8М;;;ххх;К-сть свердловин;;ххх`,
        `;;;Рвх;Рвих;є;ГПА;Q зак.;Q відб;с.роб;Рвх;Рвих;є;ГПА;Рвх;Рвих;є;ГПА;Q зак.;Q відб;с.роб;Рвх;Рвих;є;ГПА;Q зак.;Q відб;с.роб;Рвх;Рвих;є;ГПА;Q зак.;Q відб;с.роб;P;Q;P;Q;Рвх;Рвих;є;ГПА;Рвх;Рвих;є;ГПА;Рвх;Рвих;є;ГПА;Рвх;Рвих;є;ГПА;Рвх;Рвих;є;ГПА;Q зак.;Q відб;с.роб;Рвих;Q зак.;Q відб;с.роб;Рвих;Q зак.;Q відб;с.роб;Рвих;Q зак.;Q відб;с.роб;Рвих;Q зак.;Q відб;с.роб;Рвх;Рвих;є;ГПА;Рвх;Рвих;є;ГПА;Q зак.;Q відб;с.роб;Рвх;Рвих;є;ГПА;Q зак.;Q відб;с.роб;Рвх;Рвих;є;ГПА;Q зак.;Q відб;с.роб;Рвх;Рвих;є;ГПА;Q зак.;Q відб;с.роб;Рвх;Рвих;є;ГПА;Q зак.;Q відб;с.роб;Рвх;Рвих;є;ГПА;Q зак.;Q відб;с.роб`,
        `1;2;3;4;5;6;7;8;9;10;11;12;13;14;15;16;17;18;19;20;21;22;23;24;25;26;27;28;29;30;31;32;33;34;35;36;37;38;39;40;41;42;43;44;45;46;47;48;49;50;51;52;53;54;55;56;57;58;59;60;61;62;63;64;65;66;67;68;69;70;71;72;73;74;75;76;77;78;79;80;81;82;83;84;85;86;87;88;89;90;91;92;93;94;95;96;97;98;99;100;101;102;103;104;105;106;107;108;109;110;111;112;113;114;115;116;117;118;119;120;121;122;123;124`
    ]
    
    let contr_hour = config.get('contract_hour')

    let req_data_from = GetStartGasDayStr(query.start, contr_hour);
    let req_data_to = GetEndGasDayStr(query.start, contr_hour);

    let report_columns = [];
    let footer_columns = [];

    let obj = objects.getObject(48)
    report_columns = await obj.fn( req_data_from, req_data_to, obj.args)

    obj = objects.getObject(49)
    footer_columns = await obj.fn( req_data_from, req_data_to, obj.args)


    try {
    } 
    catch (error) {
        console.log(error)
    }  

    
    let footer = ConvertArrayToObject(footer_columns)
    //console.log( footer)

    //step 4 - convert columns to rows
    let rows = ConvertColumsToRows(report_columns)
 
    let header = head.parse(header_cfg)

    return {header, rows, footer};      
     
}

//---------------------- панорама

exports.createReport1 = async (id, query) => {    
    const header_cfg =[
        'година/ режим/Ask;"АТ ""Укртрансгаз""";;;Мринське ВУПЗГ;;;;;;;;;;;;;;Пролетарське ВУПЗГ;;;;;;;;;;;;;;;;;;Богородчанське ВУПЗГ;;;;;;Дашавське ВУПЗГ;;;;;;Опарське ВУПЗГ;;;;;;Стрийське ВУПЗГ;;;;;;;;;;;;;',
        ';ВІДБІР;ЗАКАЧКА;ВТВ;КС-5 Бобровницька;;;;;;ДКС Олишівка;;ДКС Солоха;;;;;;ДКС Пролетарка;;;;;;ДКС Кегичівка;;;;;;ДКС Червонопопівка;;;;;;ДКС Богородчани;;;;;;ДКС Дашава;;;;;;ДКС Опари;;;;;;ДКС Угерсько;;;;;;ДКС Більче-Волиця;;;;;;;',
        ';ВОГ псг(в);ВОГ псг(з);ВОГ втв;ВОГ псг;ВОГ псг(в);ВОГ псг(з);ВОГ втв;режим (в);режим (з);ВОГ псг;ВОГ втв;ВОГ псг;ВОГ псг(в);ВОГ псг(з);ВОГ втв;режим (в);режим (з);ВОГ псг;ВОГ псг(в);ВОГ псг(з);ВОГ втв;режим (в);режим (з);ВОГ псг;ВОГ псг(в);ВОГ псг(з);ВОГ втв;режим (в);режим (з);ВОГ псг;ВОГ псг(в);ВОГ псг(з);ВОГ втв;режим (в);режим (з);ВОГ псг;ВОГ псг(в);ВОГ псг(з);ВОГ втв;режим (в);режим (з);ВОГ псг;ВОГ псг(в);ВОГ псг(з);ВОГ втв;режим (в);режим (з);ВОГ псг;ВОГ псг(в);ВОГ псг(з);ВОГ втв;режим (в);режим (з);ВОГ псг;ВОГ псг(в);ВОГ псг(з);ВОГ втв;режим (в);режим (з);ВОГ псг (сум);ВОГ 5,5;ВОГ 7,5;ВОГ псг(в);ВОГ псг(з);ВОГ втв;режим (в);режим (з)',
        '1;2;3;4;5;6;7;8;9;10;11;12;13;14;15;16;17;18;19;20;21;22;23;24;25;26;27;28;29;30;31;32;33;34;35;36;37;38;39;40;41;42;43;44;45;46;47;48;49;50;51;52;53;54;55;56;57;58;59;60;61;62;63;64;65;66;67;68'
    ]

    let contr_hour = config.get('contract_hour')

    let req_data_from = GetStartGasDayStr(query.start, contr_hour);
    let req_data_to = GetEndGasDayStr(query.start, contr_hour);

    let report_columns = [];
    let footer_columns = [];

    let obj = objects.getObject(73)
    report_columns = await obj.fn( req_data_from, req_data_to, obj.args)

    obj = objects.getObject(74)
    footer_columns = await obj.fn( req_data_from, req_data_to, obj.args)


    try {
    } 
    catch (error) {
        console.log(error)
    }  

    
    let footer = ConvertArrayToObject(footer_columns)
    //console.log( footer)

    //step 4 - convert columns to rows
    let rows = ConvertColumsToRows(report_columns)
 
    let header = head.parse(header_cfg)

    return {header, rows, footer};     
}

exports.createReport3 = async (id, query) => {    
    const header_cfg =[
        `;Назва;Обсяг газу за добу, тис. м3;;;Обсяг газу з початку місяця, тис. м3;;`,
        `;;"План(заявки та ВТП)";Факт;Відхилення;"План 68(заявки та ВТП)";Факт 67;Відхилення 89`,
        `1;2;3;4;5;6;7;8`
    ]

    let contr_hour = config.get('contract_hour')

    let req_data_from = GetStartGasDayStr(query.start, contr_hour);
    let req_data_to = GetEndGasDayStr(query.start, contr_hour);

    let promises = [];
    let report_rows = [];
    let rows = [];
    let footer_row;



    obj = objects.getObject(50)
    footer_row = await obj.fn( req_data_from, req_data_to, obj.args)
    let footer = ConvertArrayToObject(footer_row)

    rows.push(footer)

    for (let i = 51; i < 73; i++) {
        let obj = objects.getObject(i)
        let prms =  obj.fn( req_data_from, req_data_to, obj.args)
        promises.push(prms)            
    }

    report_rows = await Promise.all(promises)


    try {
    } 
    catch (error) {
        console.log(error)
    }  

    for (let i = 0; i < report_rows.length; i++) {
        const row_arr = report_rows[i];
        let row = ConvertArrayToObject(row_arr)
        rows.push(row)
    }

    let header = head.parse(header_cfg)

    return {header, rows};      
     
}
//--------------- END report END report END report END report



//support functions

function ConvertArrayToObject(footer_arr) {
    return footer_arr.reduce( (acc, curr, i) => {
        acc[i+1] = curr
        return acc
    }, {})
}


function ConvertColumsToRows(columns) {
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
    let rows = ConverValuesToRows(big_arr);
    return rows;
}

function SortValuesByCurrentTime(values) {
    return values.sort((a,b) => (a.current_time > b.current_time) ? 1 : ((b.current_time > a.current_time) ? -1 : 0)); 
}

function ConverValuesToRows(values) {
    let result = [];
    let obj;

    let current_time;
    for (let i = 0; i < values.length; i++) {
        const value = values[i];
        if (current_time != value.str_current_time) {
            if (obj) result.push(obj);            
            //new row
            current_time = value.str_current_time;
            obj = {};
            obj['1'] = current_time;
        }
        obj[value.column_id] = value.str_value;
    }
    //push last row
    if (obj) result.push(obj);
    return result;
}


//state == 2 injection Закачка  1== withdr Отбор
//формирование расчетной колонки "Отбор-Закачка"
function CalcWithdrawInjectionColumn(q_vog_arr, psg_state_arr, active_state) { 

  let result = q_vog_arr.map( vog_value => {

        let state_interval =  psg_state_arr.find( (interval, i, array) => {
            //state unknown - return safe 0 value
            if (i == 0 && interval.current_time > vog_value.current_time) {
                return false;
            }
            //in last -> infinite interval
            if (i == (psg_state_arr.length-1) && interval.current_time <= vog_value.current_time) {
                //hit interval
                return true; 
            }
            if (interval.current_time <= vog_value.current_time && array[i+1].current_time > vog_value.current_time) {
                //hit interval
                return true;
            }
            return false;
        } )

        if(!state_interval)  return false;
        let v = ( state_interval.num_value === active_state ? {...vog_value} : {...vog_value, num_value:0, str_value:"0"} )
        //console.log( v )
        return v
    })

    return  result;
}

function AdditionColumns(a_arr, b_arr, k=1) {
    let result = a_arr.map( a => {

        let b =  b_arr.find( b => b.current_time == a.current_time )

        let c = a.num_value + b.num_value*k; 

        return {...a, num_value:c, str_value:''+c}
    })
    //console.log( result )
    return  result;
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