const services = require('./user-service')

exports.postUser = (req, res) => {  

    services.createNewUser(req.body)

    .then( (result) => {
            res.send(result);    
        }
    )
    .catch( (error) => {
        res.status(500).send(error)
        }   
    );    
}

    //Link header example
    //Link: <https://api.github.com/user/repos?page=3&per_page=100>; rel="next", <https://api.github.com/user/repos?page=50&per_page=100>; rel="last"
    //next	The link relation for the immediate next page of results.
    //last	The link relation for the last page of results.
    //first	The link relation for the first page of results.
    //prev	The link relation for the immediate previous page of results.

exports.selectUsers = (req, res) => {  
    services.getPageOfUsers(req.query)    
    .then( (result) => {
            res.send(result);    
        }
    )
    .catch( (error) => {
        res.status(500).send(error)
        }   
    );    
}
exports.deleteUser = (req, res) => {  
    
    services.deleteOneUser(req.params.id)    

    .then( (result) => {
            res.send(result);    
        }
    )
    .catch( (error) => {
        res.status(500).send(error)
        }   
    );    
}
exports.updateUser = (req, res) => {  
    
    services.updateUser(req.params.id, req.body)    

    .then( (result) => {
            res.send(result);    
        }
    )
    .catch( (error) => {
        res.status(500).send(error)
        }   
    );    
}

exports.testFreeLogin = (req, res) => {  

    services.testfreelogin(req.params.login)    
    .then( (result) => {
        if (result) {
            res.send(result);    
        }
    }
    )
    .catch( (error) => {
        res.status(500).send(error)
        }   
    );    
}

exports.findOneUser = (req, res) => {  
    const currentUser = req.user;

    // only allow admins to access other user records
    //if (id !== currentUser.sub && currentUser.role !== 'admin') {
    //    return res.status(401).json({ message: 'Unauthorized' });
    //}

    services.findUserById(req.params.id)    
    .then( (result) => {
        if (result) {
            res.send(result);    
        }
        else {
            res.status(404).send('Object not found')
        }
    }
    )
    .catch( (error) => {
        res.status(500).send(error)
        }   
    );    
}
exports.login = (req, res) => {
       
    services.login(req.body).then( 
        (jwtBearerToken) => {
            if (jwtBearerToken) {
                res.status(200).json(jwtBearerToken)
            }
            else {
                // send status 401 Unauthorized
                res.sendStatus(401); 
            }
    }
    ).catch( 
        (error) => {
            res.status(500).send(error)
        }   
    );    
}