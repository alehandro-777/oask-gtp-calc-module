const regim_services = require('./regim/regim-servise')

exports.getRegim = (req, res) => {  
switch (req.params.id) {
    case "1":
        regim_services.createReport(req.params.id, req.query)
        .then( (result) => {
                res.send(result);    
            }
        )
        .catch( (error) => {
            res.status(500).send(error)
            }   
        );    
            
        break;
        case "2":
            regim_services.createReport1(req.params.id, req.query)
            .then( (result) => {
                    res.send(result);    
                }
            )
            .catch( (error) => {
                res.status(500).send(error)
                }   
            );    
                
            break;
            case "3":
                regim_services.createReport3(req.params.id, req.query)
                .then( (result) => {
                        res.send(result);    
                    }
                )
                .catch( (error) => {
                    res.status(500).send(error)
                    }   
                );    
                    
                break;
        
    default:
        res.status(404).send()
        break;
}

}
