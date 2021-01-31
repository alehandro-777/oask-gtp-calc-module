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

exports.getExcel = (req, res) => {  

    regim_services.createExcel(req.params.id, req.query)
    .then( (workbook) => {
        let fileName = 'FileName.xlsx';
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
            workbook.xlsx.write(res).then(() => {
                res.end();
            });
        }
    )
    .catch( (error) => {
        res.status(500).send(error)
        }   
    );
}