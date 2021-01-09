const web_api = require('../../web_api')

exports.createReport = async (id, query) => {    
let responses=[];
let promises =[];
let points =[110, 109]
let rows;
//generate 100 points
//for (let i = 0; i < 100; i++) {
//    points.push(i+101);
//}

for (let i = 0; i < points.length; i++) {
    const point_id = points[i];

    //web api request
    let promise = web_api.getOaskGtpCurrPointValue(point_id, query.start, query.end);

    promises.push(promise);
}

try {
    responses = await Promise.all(promises)
} 
catch (error) {
    console.log(error)
}

rows = TestWithdrawInjectionCalculations(responses)

//    let big_array = ConcatResponses(responses);
//    SortValuesByCurrentTime(big_array);
//    let rows = ConverValuesToRows(big_array);

    return rows;   
}

function ConcatResponses(responses) {
    let result =[];
    responses.forEach(response => {

        response.data.values.forEach(value => {
            value['id'] = response.data._id;
            result.push(value); 
        });        
    });
    return result;
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
        obj[value.id] = value.str_value;
    }
    //push last row
    if (obj) result.push(obj);
    return result;
}

function TestWithdrawInjectionCalculations(responses) {
    let result;
    let states = [];
    let vog = [];

    responses.forEach(response => {

        if (response.data._id == 110) vog = response.data.values;
        if (response.data._id == 109) states = response.data.values;
    });

    //result = CalcWithdrawInjectionColumn( vog, states, 1 )
    result = CalcDivisionColumn( vog, states, -1)

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

    //console.log( result )

    return  result;
}

function CalcAddSubColumn(a_arr, b_arr, k=1) {
    let result = a_arr.map( a => {

        let b =  b_arr.find( b => b.current_time == a.current_time )

        let c = a.num_value + b.num_value*k; 

        return {...a, num_value:c, str_value:''+c}
    })

    //console.log( result )

    return  result;
}

function CalcDivisionColumn(a_arr, b_arr) {
    let result = a_arr.map( a => {

        let b =  b_arr.find( b => b.current_time == a.current_time )

        let c = a.num_value / b.num_value; 

        return {...a, num_value:c, str_value:''+c}
    })

    //console.log( result )

    return  result;
}