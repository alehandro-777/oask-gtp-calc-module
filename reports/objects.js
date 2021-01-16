const web_api = require('../web_api')
const moment = require('moment')
const config = require('config');

let objects = [
    {fn:F1, args:'113; 184'},   //Богородчанське ПСГ, отбор/закачка
    {fn:F1, args:'115; 186'},   //Дашавське ПСГ, отбор/закачка
    {fn:F1, args:'110; 181'},   //Мринське ПСГ, отбор/закачка
    {fn:F1, args:'112; 183'},   //Олишівське ПСГ, отбор/закачка
    {fn:F1, args:'111; 182'},   //Солохівське ПСГ, отбор/закачка
    {fn:F1, args:'114; 185'},   //Опарське ПСГ, отбор/закачка
    {fn:F1, args:'125; 191'},   //Краснопопівське ПСГ, отбор/закачка
    {fn:F1, args:'123; 189'},   //Пролетарське ПСГ, отбор/закачка
    {fn:F1, args:'116; 187'},   //Угерське ПСГ, отбор/закачка
    {fn:F1, args:'124; 190'},   //Кегичівське ПСГ
    {fn:F2, args:'117;118; 188'},//Більче-Волицьке ПСГ, отбор/закачка
    {fn:F3, args:'0;1;2;3;4;5;6;7;8;9;10'},//ПАТ УТГ, отбор/закачка

    {fn:F4, args:'155;139;196'}, //КС Богородчани Режим Рвх вих є к-сть ГПА
    {fn:F4, args:'156;140;197'}, //ДКС-1 Опари Режим Рвх вих є к-сть ГПА
    {fn:F4, args:'101;102;198'}, //ДКС-2 Опари Режим Рвх вих є к-сть ГПА
    {fn:F4, args:'157;141;199'}, //ДКС Дашава Режим Рвх вих є к-сть ГПА
    {fn:F4, args:'158;142;200'}, //ДКС Угерсько Режим Рвх вих є к-сть ГПА

    {fn:F4, args:'159;143;201'}, //КЦ1 Більче-Волиця Режим Рвх вих є к-сть ГПА
    {fn:F4, args:'160;144;202'}, //КЦ1А Більче-Волиця Режим Рвх вих є к-сть ГПА
    {fn:F4, args:'161;145;203'}, //КЦ2 Більче-Волиця Режим Рвх вих є к-сть ГПА
    {fn:F4, args:'162;146;204'}, //КЦ3 Більче-Волиця Режим Рвх вих є к-сть ГПА
    {fn:F4, args:'163;147;205'}, //КЦ4 Більче-Волиця Режим Рвх вих є к-сть ГПА

    {fn:F4, args:'152;136;193'}, //ДКС Мрин Режим Рвх вих є к-сть ГПА
    {fn:F4, args:'153;137;194'}, //ДКС Солоха Режим Рвх вих є к-сть ГПА
    {fn:F4, args:'154;138;195'}, //КС Олишівка Режим Рвх вих є к-сть ГПА
    {fn:F4, args:'151;135;192'}, //КС Бобровницька Режим Рвх вих є к-сть ГПА

    {fn:F4, args:'165;149;207'}, //КС Кегичівка Режим Рвх вих є к-сть ГПА
    {fn:F4, args:'166;150;208'}, //КС Краснопопівка Режим Рвх вих є к-сть ГПА
    {fn:F4, args:'164;148;206'}, //КС Пролетарка Режим Рвх вих є к-сть ГПА

    {fn:F5, args:'0; 170'},   //29 Богородчанське ПСГ, отбор/закачка + кол-во скважин 
    {fn:F5, args:'1; 172'},   //30 Дашавське ПСГ, отбор/закачка + кол-во скважин 
    {fn:F5, args:'2; 167'},   //Мринське ПСГ, отбор/закачка + кол-во скважин 
    {fn:F5, args:'3; 169'},   //Олишівське ПСГ, отбор/закачка + кол-во скважин 
    {fn:F5, args:'4; 168'},   //Солохівське ПСГ, отбор/закачка + кол-во скважин 
    {fn:F5, args:'5; 171'},   //Опарське ПСГ, отбор/закачка + кол-во скважин 
    {fn:F5, args:'6; 180'},   //Краснопопівське ПСГ, отбор/закачка + кол-во скважин 
    {fn:F5, args:'7; 178'},   //Пролетарське ПСГ, отбор/закачка + кол-во скважин 
    {fn:F5, args:'8; 173'},   //Угерське ПСГ, отбор/закачка + кол-во скважин 
    {fn:F5, args:'9; 179'},   //Кегичівське ПСГ + кол-во скважин 
    {fn:F6, args:'10;174;175;176;177'},//39 Більче-Волицьке ПСГ, отбор/закачка + кол-во скважин 

    {fn:F1, args:'119; 188'},   //Більче-Волицьке ПСГ ГЗП-1, отбор/закачка
    {fn:F1, args:'120; 188'},   //Більче-Волицьке ПСГ ГЗП-2, отбор/закачка
    {fn:F1, args:'121; 188'},   //Більче-Волицьке ПСГ ГЗП-3, отбор/закачка
    {fn:F1, args:'122; 188'},   //Більче-Волицьке ПСГ ГЗП-4, отбор/закачка

    {fn:F7, args:'40; 174; 119'},   //Більче-Волицьке ПСГ ГЗП-1, отбор/закачка + кол-во скважин + Рвих
    {fn:F7, args:'41; 175; 120'},   //Більче-Волицьке ПСГ ГЗП-2, отбор/закачка + кол-во скважин + Рвих
    {fn:F7, args:'42; 176; 121'},   //Більче-Волицьке ПСГ ГЗП-3, отбор/закачка + кол-во скважин + Рвих
    {fn:F7, args:'43; 177; 122'},   //Більче-Волицьке ПСГ ГЗП-4, отбор/закачка + кол-во скважин + Рвих

    {fn:F101, args:`;11.1;11.0;12.0;12.1;12.3;12.2;29.1;29.0;29.4;13.0;13.1;13.3;13.2;14.0;14.1;14.3;14.2;34.1;34.0;34.4;15.0;15.1;15.3;15.2;30.1;30.0;30.4;16.0;16.1;16.3;16.2;37.1;37.0;37.4;;39.4;;39.5;17.0;17.1;17.3;17.2;18.0;18.1;18.3;18.2;19.0;19.1;19.3;19.2;20.0;20.1;20.3;20.2;21.0;21.1;21.3;21.2;39.1;39.0;39.8;44.6;44.1;44.0;44.4;45.6;45.1;45.0;45.4;46.6;46.1;46.0;46.4;47.6;47.1;47.0;47.4;25.0;25.1;25.3;25.2;22.0;22.1;22.3;22.2;31.1;31.0;31.4;23.0;23.1;23.3;23.2;33.1;33.0;33.4;24.0;24.1;24.3;24.2;32.1;32.0;32.4;28.0;28.1;28.3;28.2;36.1;36.0;36.4;27.0;27.1;27.3;27.2;38.1;38.0;38.4;26.0;26.1;26.3;26.2;35.1;35.0;35.4`},   //Report режим строка
    {fn:F101, args:`;11.3;11.2;12.4;12.5;12.7;12.6;29.3;29.2;29.5;13.4;13.5;13.7;13.6;14.4;14.5;14.7;14.6;34.3;34.2;34.5;15.4;15.5;15.7;15.6;30.3;30.2;30.5;16.4;16.5;16.7;16.6;37.3;37.2;37.5;;39.6;;39.7;17.4;17.5;17.7;17.6;18.4;18.5;18.7;18.6;19.4;19.5;19.7;19.6;20.4;20.5;20.7;20.6;21.4;21.5;21.7;21.6;39.3;39.2;39.9;44.7;44.3;44.2;44.5;45.7;45.3;45.2;45.5;46.7;46.3;46.2;46.5;47.7;47.3;47.2;47.5;25.4;25.5;25.7;25.6;22.4;22.5;22.7;22.6;31.3;31.2;31.5;23.4;23.5;23.7;23.6;33.3;33.2;33.5;24.4;24.5;24.7;24.6;32.3;32.2;32.5;28.4;28.5;28.7;28.6;36.3;36.2;36.5;27.4;27.5;27.7;27.6;38.3;38.2;38.5;26.4;26.5;26.7;26.6;35.3;35.2;35.5`},   //Report режим footer

    {fn:F102, args:`1;  РОЗБАЛАНС* ;51;52;53;54;55;56;57;58;59;60;61;62;63;64;65;66;67;68;69;70;71;72`},//summ 
    {fn:F103, args:`2;  Угерське ПСГ, відбір;8;1`},   //Контроль розбалансу доб данные 
    {fn:F103, args:`3;  Угерське ПСГ, закачка;8;2`},   //Контроль розбалансу доб данные
    {fn:F103, args:`4;  Більче-Волицьке ПСГ, відбір;10;1`},   //Контроль розбалансу доб данные
    {fn:F103, args:`5;  Більче-Волицьке ПСГ, закачка;10;2`},   //Контроль розбалансу доб данные
    {fn:F103, args:`6;  Дашавське ПСГ, відбір;1;1`},   //Контроль розбалансу доб данные
    {fn:F103, args:`7;  Дашавське ПСГ, закачка;1;2`},   //Контроль розбалансу доб данные
    {fn:F103, args:`8;  Опарське ПСГ, відбір;5;1`},   //Контроль розбалансу доб данные
    {fn:F103, args:`9;  Опарське ПСГ, закачка;5;2`},   //Контроль розбалансу доб данные
    {fn:F103, args:`10;  Богородчанське ПСГ, відбір;0;1`},   //Контроль розбалансу доб данные
    {fn:F103, args:`11;  Богородчанське ПСГ, закачка;0;2`},   //Контроль розбалансу доб данные
    {fn:F103, args:`12;  Олишівське ПСГ, відбір;3;1`},   //Контроль розбалансу доб данные
    {fn:F103, args:`13;  Олишівське ПСГ, закачка;3;2`},   //Контроль розбалансу доб данные
    {fn:F103, args:`14;  Мринське ПСГ, відбір;2;1`},   //Контроль розбалансу доб данные
    {fn:F103, args:`15;  Мринське ПСГ, закачка;2;2`},   //Контроль розбалансу доб данные
    {fn:F103, args:`16;  Солохівське ПСГ, відбір;4;1`},   //Контроль розбалансу доб данные
    {fn:F103, args:`17;  Солохівське ПСГ, закачка;4;2`},   //Контроль розбалансу доб данные
    {fn:F103, args:`18;  Пролетарське ПСГ, відбір;7;1`},   //Контроль розбалансу доб данные
    {fn:F103, args:`19;  Пролетарське ПСГ, закачка;7;2`},   //Контроль розбалансу доб данные
    {fn:F103, args:`20;  Кегичівське ПСГ, відбір;9;1`},   //Контроль розбалансу доб данные
    {fn:F103, args:`21;  Кегичівське ПСГ, закачка;9;2`},   //Контроль розбалансу доб данные
    {fn:F103, args:`22;  Краснопопівське ПСГ, відбір;6;1`},   //Контроль розбалансу доб данные
    {fn:F103, args:`23;  Краснопопівське ПСГ, закачка;6;2`},   //Контроль розбалансу доб данные

    {fn:F101, args:';11.0;11.1;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;'},   //Панорама режим строка
    {fn:F101, args:';11.2;11.3;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;'},   //Панорама режим footer

]

exports.getObject = (i) =>{
    return objects[i];
}

//Withdraw-Injection
async function F1(start, end, args_str) {
    let result =[]
    let args = ParseArgs(args_str)
        //request all states up to current
        let state_resp = await web_api.getOaskGtpCurrPointValue(+args[1], '2010-01-01', GetNowStr());
        let vog_resp = await web_api.getOaskGtpCurrPointValue(+args[0], start, end );

        let vog_column = vog_resp.data.values;
        let state_column = state_resp.data.values;
        let sum_vog = vog_resp.data.group[0].sum;

        let withdr = Calc_WithdrawInjection_Column(vog_column, state_column, 1);
        let inj = Calc_WithdrawInjection_Column(vog_column, state_column, 2);
    
        let sum_w = SummColumn(withdr)
        let sum_i = SummColumn(inj)

    result.push(withdr)//0
    result.push(inj)//1
    result.push(sum_w)//2
    result.push(sum_i)//3

    result.push(vog_column)
    result.push(sum_vog)

    //console.log(result)
    return result
}
//Withdraw-Injection Більче-Волицьке ПСГ - 55 and 75 
async function F2(start, end, args_str) {
    let result =[]
    let args = ParseArgs(args_str)
        //request all states up to current
        let state_resp = await web_api.getOaskGtpCurrPointValue(+args[2], '2010-01-01', GetNowStr());
        let vog_resp = await web_api.getOaskGtpCurrPointValue(+args[0], start, end );
        let vog1_resp = await web_api.getOaskGtpCurrPointValue(+args[1], start, end );

        let state_intervals = state_resp.data.values

        let sum_vog1 = vog_resp.data.group[0].sum;
        let sum_vog2 = vog1_resp.data.group[0].sum;

        let vog1 = vog_resp.data.values;
        let vog2 = vog1_resp.data.values;

        let withdr2 = Calc_WithdrawInjection_Column(vog1, state_intervals, 1);
        let inj2 = Calc_WithdrawInjection_Column(vog1, state_intervals, 2);

        let withdr1 = Calc_WithdrawInjection_Column(vog2, state_intervals, 1);
        let inj1 = Calc_WithdrawInjection_Column(vog2, state_intervals, 2);

        let withdr = SummColumns([withdr1, withdr2])
        let inj = SummColumns([inj1, inj2])

        let sum_w = SummColumn(withdr)
        let sum_i = SummColumn(inj)

    result.push(withdr)
    result.push(inj)
    result.push(sum_w)
    result.push(sum_i)

    result.push(vog1)
    result.push(vog2)
    result.push(sum_vog1)
    result.push(sum_vog2)    

    //console.log(result)
    return result
}
//Withdraw-Injection ПАТ УТГ
async function F3(start, end, args_str) {
    let result =[]
    let promises =[]
    let responses;
    let args = ParseArgs(args_str)

    for (let i = 0; i < args.length; i++) {
        const obj = objects[ +args[i] ];
        let res = obj.fn( start, end, obj.args)
        promises.push(res)
    }    
    responses = await Promise.all(promises)

    let withdr = SummColumns(responses.map(resp=>resp[0])) //withdr column
    let inj = SummColumns(responses.map(resp=>resp[1]))    //inj  column
    let sum_w = SummColumn(withdr)
    let sum_i = SummColumn(inj)

    result.push(withdr)
    result.push(inj)
    result.push(sum_w)
    result.push(sum_i)

    return result
}

////КС Режим Рвх вих є к-сть ГПА
async function F4(start, end, args_str) {
    let result =[]
    let promises =[]
    let args = ParseArgs(args_str)

    for (let i = 0; i < args.length; i++) {
        let res = web_api.getOaskGtpCurrPointValue(+args[i], start, end );
        promises.push(res)
    }    
    responses = await Promise.all(promises)

    let p_in_column = responses[0].data.values;
    let p_out_column = responses[1].data.values;
    let n_gpa_column = responses[2].data.values;    
    let e_column = DivideColumns(p_in_column, p_out_column)

    let avg_p_in = AverageColumn(p_in_column)
    let avg_p_out = AverageColumn(p_out_column)
    let avg_n_gpa = LastInColumn(n_gpa_column)
    let avg_e = AverageColumn(e_column)

    result.push(p_in_column)
    result.push(p_out_column)
    result.push(n_gpa_column)
    result.push(e_column)

    result.push(avg_p_in)
    result.push(avg_p_out)
    result.push(avg_n_gpa)
    result.push(avg_e)

    return result
}
// отбор/закачка + кол-во скважин
async function F5(start, end, args_str) {
    let result =[]
    let args = ParseArgs(args_str)
    const obj = objects[ +args[0] ];
    let res = await obj.fn( start, end, obj.args)
    let number_resp = await web_api.getOaskGtpCurrPointValue(+args[1], start, end );

    let num_column = number_resp.data.values;
    let num_last = number_resp.data.group[0].last;

    result = [...res, num_column, num_last];

    //console.log(result)
    return result
}
//режим для бильче волицы сумма скважин 4 ГЗП
async function F6(start, end, args_str) {
    let result =[]
    let args = ParseArgs(args_str)
    const obj = objects[ +args[0] ];
    let res = await obj.fn( start, end, obj.args)
    let number1_resp = await web_api.getOaskGtpCurrPointValue(+args[1], start, end );
    let number2_resp = await web_api.getOaskGtpCurrPointValue(+args[2], start, end );
    let number3_resp = await web_api.getOaskGtpCurrPointValue(+args[3], start, end );
    let number4_resp = await web_api.getOaskGtpCurrPointValue(+args[4], start, end );

    let num_column1 = number1_resp.data.values;
    let num_column2 = number2_resp.data.values;
    let num_column3 = number3_resp.data.values;
    let num_column4 = number4_resp.data.values;

    let num_column = SummColumns([num_column1,num_column2,num_column3,num_column4]);
    let num_last = LastInColumn(num_column)

    result = [...res, num_column, num_last];
    
    //console.log(result)
    return result
}
//Більче-Волицьке ПСГ ГЗП-1, отбор/закачка + кол-во скважин + Рвих
async function F7(start, end, args_str) {
    let result =[]
    let args = ParseArgs(args_str)
    const obj = objects[ +args[0] ];
    let res = await obj.fn( start, end, obj.args)
    let number_resp = await web_api.getOaskGtpCurrPointValue(+args[1], start, end );
    let p_resp = await web_api.getOaskGtpCurrPointValue(+args[2], start, end );

    let num_column = number_resp.data.values;
    let p_column = p_resp.data.values;

    let num_last = number_resp.data.group[0].last;
    let p_last = number_resp.data.group[0].avg;

    result = [...res, num_column, num_last, p_column, p_last];

    console.log(result)
    return result
}

async function F8(start, end, args_str) {
    let result =[]
    let args = ParseArgs(args_str)

    return result
}
async function F9(start, end, args_str) {
    let result =[]
    let args = ParseArgs(args_str)

    return result
}
async function F10(start, end, args_str) {
    let result =[]
    let args = ParseArgs(args_str)

    return result
}

//-----------------------------------------------------------------------------------------------------------------------------------------------
//selector
async function F101(start, end, args_str) {
    let result =[]
    let promises =[]
    let responses;

    let args = ParseArgs(args_str)

    for (let i = 0; i < args.length; i++) {

        console.log(args[i])

        if (args[i]=='') continue;
        let cmd = args[i].split(".");
        const obj = objects[ +cmd[0] ];
        let res = obj.fn( start, end, obj.args)
        promises[+cmd[0]] = res;
    }    

    responses = await Promise.all(promises)

    for (let i = 0; i < args.length; i++) {
        if (args[i]=='') {
            result[i] = null;
            continue;
        }
        let cmd = args[i].split(".");
        const obj_index = +cmd[0] ;
        const par_index = +cmd[1] ;        
        result[i] = responses[obj_index][par_index]
    }    
    return result
}
//ОГСУ. Добові дані Контроль розбалансу тотал
async function F102(start, end, args_str) {
    let result =[]
    let promises =[]
    let responses;
    let args = ParseArgs(args_str)

    let num = args[0]       //1
    let name = args[1]      //2
    let plan_vtv =0      //3
    let fact=0                //4
    let vidhil=0              //5
    let plan68 = 0       //6
    let fact67=0              //7
    let vidhil89=0            //8

    for (let i = 2; i < args.length; i++) {
        const obj = objects[ +args[i] ];
        let prms = obj.fn( start, end, obj.args)
        promises.push(prms)            
    }
    responses = await Promise.all(promises)

    for (let i = 0; i < responses.length; i++) {
        const row = responses[i];
        plan_vtv +=  row[2]     //3
        fact  += row[3]         //4
        vidhil += row[4]        //5
        plan68 += row[5]        //6
        fact67  += row[6]       //7
        vidhil89  += row[7]     //8    
    }

    result.push(num)
    result.push(name)
    result.push(plan_vtv)
    result.push(fact)
    result.push(vidhil)
    result.push(plan68)
    result.push(fact67)
    result.push(vidhil89)

    return result
}
//ОГСУ. Добові дані Контроль розбалансу
async function F103(start, end, args_str) {
    let result =[]
    let promises =[]
    let responses;
    let args = ParseArgs(args_str)

    let num = args[0]       //1
    let name = args[1]      //2
    let plan_vtv =1000      //3
    let fact                //4
    let vidhil              //5
    let plan68 = 1000       //6
    let fact67              //7
    let vidhil89            //8

    const obj = objects[ +args[2] ];
    let withdr_inj = await obj.fn( start, end, obj.args)
    
    if (+args[3] == 1) {fact = withdr_inj[2]}
    if (+args[3] == 2) {fact = withdr_inj[3]}
    
    vidhil = fact - plan_vtv

    let withdr_inj_start_month = await obj.fn( GetStartGasMonthStr(start), end, obj.args)
    if (+args[3] == 1) {fact67 = withdr_inj_start_month[2]}
    if (+args[3] == 2) {fact67 = withdr_inj_start_month[3]}
    vidhil89 = fact67 - plan68
 
    result.push(num)
    result.push(name)
    result.push(plan_vtv)
    result.push(fact)
    result.push(vidhil)
    result.push(plan68)
    result.push(fact67)
    result.push(vidhil89)

    return result
}


//-----------------------------------------------------------------------------------------------------------------------------------------------

function ParseArgs(args) {
    let csv_separ = config.get('csv_separ')
    return args.split(csv_separ)
}

//state == 2 injection Закачка  1== withdr Отбор
//формирование расчетной колонки "Отбор-Закачка"
function Calc_WithdrawInjection_Column(q_vog_arr, psg_state_arr, active_state) { 

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
function SummColumns(arrays) {
    let big_array =[]
    let result =[]
    let curr_time_index;
    let acc =0;                

    big_array = ConcatArrays(arrays)
    SortValuesByCurrentTime(big_array)

    //sum values is equal curr_time
    for (let i = 0; i < big_array.length; i++) {       
        let value_obj = big_array[i];
        //console.log(value_obj)

        if(value_obj.current_time != curr_time_index) {
            if (curr_time_index) {
                result.push({ ...big_array[i-1], num_value: acc, str_value:''+ acc});
            }            
            curr_time_index = value_obj.current_time;
            acc=0;            
        }
        acc = acc + value_obj.num_value;
    }
    //last value
    if (curr_time_index) {
        result.push({ ...big_array[big_array.length-1], num_value: acc, str_value:''+ acc});
    }
    //console.log(result)
    
    return result;
}
function DivideColumns(a_arr, b_arr) {
    let result = a_arr.map( a => {
        let b =  b_arr.find( b => b.current_time == a.current_time )

        let c = a.num_value / b.num_value; 

        return {...a, num_value:c, str_value:''+c.toFixed(2)}
    })

    //console.log( result )

    return  result;
}
function SortValuesByCurrentTime(values) {
    return values.sort((a,b) => (a.current_time > b.current_time) ? 1 : ((b.current_time > a.current_time) ? -1 : 0)); 
}

function ConcatArrays(arrays) {
    let big_array =[]
    for (let i = 0; i < arrays.length; i++) {
        let one_array = arrays[i];
        big_array = big_array.concat(one_array);
    }
    return big_array;
}
function SummColumn(column) {
    return column.reduce( (acc,curr)=> acc+curr.num_value, 0 )
}

function AverageColumn(column) {
    let r = column.reduce( (acc,curr)=> acc+curr.num_value, 0 ) / column.length;
    return r;
}
function LastInColumn(column) {
    return column[column.length-1].num_value;
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

async function Test() {
    let req_data_from = '2021-01-01';
    let req_data_to = '2021-01-02';

    for (let i = 50; i < 51; i++) {
        const obj = objects[i];
       let res = await  obj.fn(req_data_from, req_data_to, obj.args)
       //console.log(res)
    }

}

//Test();