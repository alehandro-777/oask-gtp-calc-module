const regim_services = require('./regim/regim-servise')

exports.getRegim = (req, res) => {  

    regim_services.createReport(req.params.id, req.query)

    .then( (result) => {
            res.send(result);    
        }
    )
    .catch( (error) => {
        res.status(500).send(error)
        }   
    );    
}
