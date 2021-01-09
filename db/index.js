const mongoose = require('mongoose');

exports.create = (model) => {
    return model.save();    
}

exports.createMany = (Model, data) => {
    return Model.insertMany(data);   
}

exports.upsert = (Model, query, newDoc) => {
    return Model.findOneAndUpdate(query, newDoc, {upsert: true})
}

exports.find = (Model, filter , projection, options) => {
    return Model.find(filter , projection, options);
}

exports.findOneAndUpdate = (Model, filter, update) => {
    return Model.findOneAndUpdate(filter , update, {new:true, upsert:true});
}

exports.deleteOne = (Model, conditions ) => {
    return Model.deleteOne(conditions);   
}

exports.count = (Model, filter ) => {
    return Model.countDocuments(filter);   
} 

exports.update = (Model, filter, doc, options ) => {
    return Model.updateOne(filter, doc, options);   
} 


exports.findById = (Model, id ) => {
    return Model.findById(id);   
}

exports.findOne = (Model, conditions, projection, options ) => {
    return Model.findOne(conditions, projection, options )   
}
