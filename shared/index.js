const db = require('../db');
const config = require('config');

const defaultPageLimit = config.get('paginator.limit');;

translateQuery2findOptions = (query) => {
    const projection = query.fields ? query.fields.replace(/,/g, " "): null;
    const {page, per_page, sort, ...filter} = query;
    const options = {};

    for (const [key, value] of Object.entries(filter)) {
        filter[key] = new RegExp(value, 'i')
    }

    options.limit = parseInt(per_page) || defaultPageLimit;
    options.skip = (parseInt(page) -1)*options.limit || 0;
    
    //... birthdate_date:asc
    const sort_params = sort ? sort.split(':') : null;

    if (sort_params) {
        const sort_params_obj = {};
        sort_params_obj[sort_params[0]] = sort_params[1].toLowerCase() ==='desc' ? -1 : 1;  
        options.sort = sort_params_obj || null;    
    }

    return {page, per_page, filter, projection, options};
}

createLinkHeader = (page, per_page, count)=>{
    const header = {}
    header.page = parseInt(page) || 1;
    header.per_page = per_page;
    header.prev = (header.page > 1) ? header.page-1 : null;
    header.next = (header.per_page*header.page < count) ? header.page + 1 : null;
    header.last = Math.ceil(count / header.per_page);
    return header;
}

exports.getPageOfDocs = async (Model, query) => {

    const find_spec = translateQuery2findOptions(query);

    const list = await db.find(Model, find_spec.filter , find_spec.projection, find_spec.options);

    const total = await db.count(Model, find_spec.filter);

    const link = createLinkHeader(find_spec.page, find_spec.options.limit, total)

    return {data : list, total_count: total, link}

}