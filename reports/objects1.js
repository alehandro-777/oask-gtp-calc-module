const web_api = require('../web_api')
const moment = require('moment')
const config = require('config');
const db = require('../db')
const Object = require('./object-model')


let objects = [

]

exports.getObject = (i) =>{
    let cmd = `${objects[i].fn}`
    let res = eval(cmd);
    res.args = objects[i].args
    return res
}
//simple column
async function F1(start, end, args_str) {
    let result =[]
    let args = ParseArgs(args_str)

    try {
        //request point
        let resp = await web_api.getOaskGtpCurrPointValue(+args[0], start, end );
        let column = resp.values;
        let sum = resp.group[0].sum;
        let avg = resp.group[0].avg;
        let min = resp.group[0].min;
        let max = resp.group[0].max;
        let last = resp.group[0].last;

    result.push(column)//0
    result.push(sum)
    result.push(avg)
    result.push(min)
    result.push(max)
    result.push(last)

} catch (error) {
    console.error("F1", error)
    return result
}

    //console.log(result)
    return result
}
//summ objects columns
async function F2(start, end, args_str) {
    let result =[]
    let args = ParseArgs(args_str)
    let promises = []

    try {
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            const obj = objects[ +arg ];
            let cmd = `${obj.fn}('${start}', '${end}', '${obj.args}')`
            let promise = eval(cmd)
            promises.push(promise)    
        }

        let res = await Promise.all(promises)
        let res_column = SummColumns(res.map(e=>e[0]));
        let summ = SummColumn(res_column)
    
        result = [ res_column, summ];        

    } catch (error) {
        console.error("F2", error)
        return result
    }
    
    //console.log(result)
    return result
}
//Withdraw-Injection
async function F3(start, end, args_str) {
    let result =[]
    let args = ParseArgs(args_str)
    try {
        let wi_selector = +args[2];
        //request all states up to current
        let state_resp = await web_api.getOaskGtpCurrPointValue(+args[1], '2010-01-01', GetNowStr());
        const obj = objects[ +args[0] ];
        let cmd = `${obj.fn}('${start}', '${end}', '${obj.args}')`
        let vog_resp = await eval(cmd)

        let vog_column = vog_resp[0];
        let state_column = state_resp.values;

        let withdr = Calc_WithdrawInjection_Column(vog_column, state_column, wi_selector);
        let sum_w = SummColumn(withdr)

    result.push(withdr)     //0
    result.push(sum_w)      //1
        
    } catch (error) {
        console.error("F3", error)
        return result
    }

    //console.log(result)
    return result
}
//Divide columns
async function F4(start, end, args_str) {
    let result =[]
    let promises =[]
    let args = ParseArgs(args_str)
    try {
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            const obj = objects[ +arg ];
            let cmd = `${obj.fn}('${start}', '${end}', '${obj.args}')`
            let promise = eval(cmd)
            promises.push(promise)  
        }    
        responses = await Promise.all(promises)
    
        let p_in_column = responses[0][0];
        let p_out_column = responses[1][0];
        let e_column = DivideColumns(p_in_column, p_out_column)
    
        let avg_e = AverageColumn(e_column)
        let sum_e = SummColumn(e_column)

        result.push(e_column) 
        result.push(sum_e)      
        result.push(avg_e)    

    } catch (error) {
        console.error("F4", error)
        return result
    }
    //console.log(result)
    return result
}
//ОГСУ. Добові дані Контроль розбалансу тотал
async function F5_1(start, end, args_str) {
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
        const arg = args[i];
        const obj = objects[ +arg ];
        let cmd = `${obj.fn}('${start}', '${end}', '${obj.args}')`
        let promise = eval(cmd)
        promises.push(promise)            
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

    //console.log(result)
    return result
}
//ОГСУ. Добові дані Контроль розбалансу
async function F5_2(start, end, args_str) {
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
    let cmd = `${obj.fn}('${start}', '${end}', '${obj.args}')`
    let withdr_inj = await eval(cmd)
    
    fact = withdr_inj[1] 
    vidhil = fact - plan_vtv

    let cmd_m = `${obj.fn}(GetStartGasMonthStr('${start}'), '${end}', '${obj.args}')`
    let withdr_inj_start_month = await eval(cmd_m)

    fact67 = withdr_inj_start_month[1]
    vidhil89 = fact67 - plan68
 
    result.push(num)
    result.push(name)
    result.push(plan_vtv)
    result.push(fact)
    result.push(vidhil)
    result.push(plan68)
    result.push(fact67)
    result.push(vidhil89)

    //console.log(result)
    return result
}
//selector for columned reports
async function F6(start, end, args_str) {
    let result =[]
    let promises =[]
    let responses;

    let args = ParseArgs(args_str)

    try {
        for (let i = 0; i < args.length; i++) {

            //console.log(args[i])
    
            if (args[i]=='') continue;
            let cmd = args[i].split(".");
            const obj = objects[ +cmd[0] ];
            let script = `${obj.fn}('${start}', '${end}', '${obj.args}')`
            let res = eval(script)
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
            
    } catch (error) {
        console.error("F6", error)
        return result
    }

    //console.log(result)
    return result
}







//--------------------------------------------------------------------------------------------------------------------------------------------
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

    let obj_cfg = await db.find(Object,{});
    obj_cfg.forEach( (el,i) => {
        objects[el._id] = el
    });

    let req_data_from = '2021-01-01';
    let req_data_to = '2021-01-02';

    for (let i = 196; i < 197; i++) {
        const obj = objects[i];
        let cmd = `${obj.fn}('${req_data_from}', '${req_data_to}', '${obj.args}')`
        //console.log(cmd)
       let res = await  eval(cmd)
       //console.log(res)
    }

}

exports.Init = async () => {

    let obj_cfg = await db.find(Object,{});
    obj_cfg.forEach( (el,i) => {
        objects[el._id] = el
    });
}

//Test();