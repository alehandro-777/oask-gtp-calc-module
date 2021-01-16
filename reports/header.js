/*
let arr = [
    'година/ режим/Ask;"АТ ""Укртрансгаз""";;;Мринське ВУПЗГ;;;;;;;;;;;;;;Пролетарське ВУПЗГ;;;;;;;;;;;;;;;;;;Богородчанське ВУПЗГ;;;;;;Дашавське ВУПЗГ;;;;;;Опарське ВУПЗГ;;;;;;Стрийське ВУПЗГ;;;;;;;;;;;;;',
    ';ВІДБІР;ЗАКАЧКА;ВТВ;КС-5 Бобровницька;;;;;;ДКС Олишівка;;ДКС Солоха;;;;;;ДКС Пролетарка;;;;;;ДКС Кегичівка;;;;;;ДКС Червонопопівка;;;;;;ДКС Богородчани;;;;;;ДКС Дашава;;;;;;ДКС Опари;;;;;;ДКС Угерсько;;;;;;ДКС Більче-Волиця;;;;;;;',
    ';ВОГ псг(в);ВОГ псг(з);ВОГ втв;ВОГ псг;ВОГ псг(в);ВОГ псг(з);ВОГ втв;режим (в);режим (з);ВОГ псг;ВОГ втв;ВОГ псг;ВОГ псг(в);ВОГ псг(з);ВОГ втв;режим (в);режим (з);ВОГ псг;ВОГ псг(в);ВОГ псг(з);ВОГ втв;режим (в);режим (з);ВОГ псг;ВОГ псг(в);ВОГ псг(з);ВОГ втв;режим (в);режим (з);ВОГ псг;ВОГ псг(в);ВОГ псг(з);ВОГ втв;режим (в);режим (з);ВОГ псг;ВОГ псг(в);ВОГ псг(з);ВОГ втв;режим (в);режим (з);ВОГ псг;ВОГ псг(в);ВОГ псг(з);ВОГ втв;режим (в);режим (з);ВОГ псг;ВОГ псг(в);ВОГ псг(з);ВОГ втв;режим (в);режим (з);ВОГ псг;ВОГ псг(в);ВОГ псг(з);ВОГ втв;режим (в);режим (з);ВОГ псг (сум);ВОГ 5,5;ВОГ 7,5;ВОГ псг(в);ВОГ псг(з);ВОГ втв;режим (в);режим (з)',
    '1;2;3;4;5;6;7;8;9;10;11;12;13;14;15;16;17;18;19;20;21;22;23;24;25;26;27;28;29;30;31;32;33;34;35;36;37;38;39;40;41;42;43;44;45;46;47;48;49;50;51;52;53;54;55;56;57;58;59;60;61;62;63;64;65;66;67;68'
]
*/

exports.parse = (header_config, separator) => {
    let rows =[];
    let result =[];

    for (let i = 0; i < header_config.length; i++) {
        const row = header_config[i];
        let columns = row.split(separator);
        rows.push(columns)
    }

    for (let i = 0; i < rows.length; i++) {
        let columns = rows[i];
        let new_row = [];
        for (let j = 0; j < columns.length; j++) {
            let column = columns[j];
            if( column =='') continue;
            let col_obj = {};
            col_obj['text'] = column;
            
            let rs = GetRowSpan(rows, i, j, rows.length);
            let cs = GetColSpan(columns, j, columns.length);

            if (rs > 1) col_obj['rowspan'] = rs;
            if (cs > 1) col_obj['colspan'] = cs;
            if (i==rows.length-1) col_obj['key'] = j+1;

            new_row.push(col_obj)
        }    
        result.push(new_row)
    }

    return result;
}

function GetRowSpan(array, row,  col, length) {
    let res =1;
    for (let i = row+1; i < length; i++) {
        const element = array[i][col];

        if(element =='') {
            res +=1;
        }            
        else {
            return res
        }        
    }
    return res
}

function GetColSpan(array, col, length) {
    let res =1;
    for (let i=col+1 ; i < length; i++) {
        const element = array[i];        
        if(element =='') {
            res +=1;
        }            
        else {
            return res
        }        
    }
    return res    
}