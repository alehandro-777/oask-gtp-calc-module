const db = require('../../db');
const Model = require('./forms-menu-model');
const base = require('../../shared')

exports.create = (body) => {
      
    const new_Object = new Model(body);

    return db.create(new_Object);
}

exports.deleteOne = (id) => {    
   
    return db.deleteOne(Model, {"_id": id});
}

exports.select = async  (query) => {
    return await base.getPageOfDocs(Model, query);
}

exports.update = (id, body) => {
       
    const newObject = new Model(body).toObject();
    delete newObject['_id'];
    return db.update(FormValue, {"_id": id}, newObject);
}

exports.findById = async (id) => {    
    let tree = {
        id : id,
        name: "",
        full_name: "",
        payload: {},
        children: [],
    }

    let r = await BuildTree(id, tree);
    return tree;
}

async function BuildTree(root_id, sub_tree) {
     let node = await db.findById(Model, {"_id": root_id});
     sub_tree.id = node['_id'];
     sub_tree.name = node.name;
     sub_tree.full_name = node.full_name;
     sub_tree.payload  = node.payload;

     let count = node.children.length;   
     if (count > 0) {
        sub_tree.children = [];

        for (let i = 0; i < count; i++) {            
            const child_id = node.children[i];
            let child = {}
            sub_tree.children.push(child)        

            let sub_node = await  BuildTree(child_id, child);                   
        } 
         
     }

}
