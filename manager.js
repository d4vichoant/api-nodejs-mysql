const express = require('express');
const routes = express.Router();

routes.get('/',(req,res)=>{
    req.getConnection((err,conn)=>{
        if(err) return res.send(err)
        conn.query(`
        SELECT 
        p.IDPERSONA, e.IDENTRENADOR, p.IDGENERO, p.IDROLUSUARIO, p.NOMBREPERSONA,
        p.APELLDOPERSONA, p.CORREOPERSONA, p.NICKNAMEPERSONA, p.FECHANACIMIENTOPERSONA,
        e.EXPERIENCIAENTRENADOR, e.DESCRIPCIONENTRENADOR, e.TARIFASENTRENADOR,
        e.CERTIFICACIONESENTRENADOR,e.ACTIVACIONENTRENADOR, GROUP_CONCAT(ex.tituloESPECIALIDADENTRENADOR) AS tituloESPECIALIDADENTRENADOR,
        p.ESTADOPERSONA
        FROM persona p
        JOIN entrenador e ON p.IDPERSONA = e.IDPERSONA
        JOIN especialidadentrenadorentrenador es ON e.IDENTRENADOR = es.IDENTRENADOR
        JOIN especialidadentrenador ex ON es.idespecialidadentrenador = ex.idespecialidadentrenador
        WHERE e.ACTIVACIONENTRENADOR = false or true
        GROUP BY p.IDPERSONA, e.IDENTRENADOR, p.IDGENERO, p.IDROLUSUARIO, p.NOMBREPERSONA,
        p.APELLDOPERSONA, p.CORREOPERSONA, p.NICKNAMEPERSONA, p.FECHANACIMIENTOPERSONA,
        e.EXPERIENCIAENTRENADOR, e.DESCRIPCIONENTRENADOR, e.TARIFASENTRENADOR,
        e.CERTIFICACIONESENTRENADOR, p.ESTADOPERSONA
        ORDER BY p.NOMBREPERSONA
        `,(err,rows)=>{
        if(err) return res.send(err)
            res.json(rows)
        })
    })
})
routes.get('/:id',(req,res)=>{
    req.getConnection((err,conn)=>{
        if(err) return res.send(err)
        conn.query(`
        SELECT 
        p.IDPERSONA, e.IDENTRENADOR, p.IDGENERO, p.IDROLUSUARIO, p.NOMBREPERSONA,
        p.APELLDOPERSONA, p.CORREOPERSONA, p.NICKNAMEPERSONA, p.FECHANACIMIENTOPERSONA,
        e.EXPERIENCIAENTRENADOR, e.DESCRIPCIONENTRENADOR, e.TARIFASENTRENADOR,
        e.CERTIFICACIONESENTRENADOR, GROUP_CONCAT(ex.tituloESPECIALIDADENTRENADOR) AS tituloESPECIALIDADENTRENADOR,
        p.ESTADOPERSONA
        FROM persona p
        JOIN entrenador e ON p.IDPERSONA = e.IDPERSONA
        JOIN especialidadentrenadorentrenador es ON e.IDENTRENADOR = es.IDENTRENADOR
        JOIN especialidadentrenador ex ON es.idespecialidadentrenador = ex.idespecialidadentrenador
        WHERE e.ACTIVACIONENTRENADOR = false  and e.IDENTRENADOR = ?
        GROUP BY p.IDPERSONA, e.IDENTRENADOR, p.IDGENERO, p.IDROLUSUARIO, p.NOMBREPERSONA,
        p.APELLDOPERSONA, p.CORREOPERSONA, p.NICKNAMEPERSONA, p.FECHANACIMIENTOPERSONA,
        e.EXPERIENCIAENTRENADOR, e.DESCRIPCIONENTRENADOR, e.TARIFASENTRENADOR,
        e.CERTIFICACIONESENTRENADOR, p.ESTADOPERSONA 
        `,[req.params.id],(err,rows)=>{
        if(err) return res.send(err)
            res.json(rows)
        })
    })
})

module.exports = routes;