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
         GROUP_CONCAT(ex.idespecialidadentrenador ) AS idespecialidadentrenador,
        p.ESTADOPERSONA
        FROM persona p
        JOIN entrenador e ON p.IDPERSONA = e.IDPERSONA
        LEFT JOIN especialidadentrenadorentrenador es ON e.IDENTRENADOR = es.IDENTRENADOR
        LEFT JOIN especialidadentrenador ex ON es.idespecialidadentrenador = ex.idespecialidadentrenador
        WHERE (e.ACTIVACIONENTRENADOR = false OR e.ACTIVACIONENTRENADOR = true)
        AND e.IDENTRENADOR IS NOT NULL
        AND p.IDROLUSUARIO = 2
        GROUP BY p.IDPERSONA, e.IDENTRENADOR, p.IDGENERO, p.IDROLUSUARIO, p.NOMBREPERSONA,
        p.APELLDOPERSONA, p.CORREOPERSONA, p.NICKNAMEPERSONA, p.FECHANACIMIENTOPERSONA,
        e.EXPERIENCIAENTRENADOR, e.DESCRIPCIONENTRENADOR, e.TARIFASENTRENADOR,
        e.CERTIFICACIONESENTRENADOR, p.ESTADOPERSONA
        ORDER BY p.NOMBREPERSONA
        `,(err,rows)=>{
        if(err) return res.send(err)
        rows.forEach(row => {
            if (row.CERTIFICACIONESENTRENADOR  && typeof row.CERTIFICACIONESENTRENADOR === 'string') {
                row.CERTIFICACIONESENTRENADOR = JSON.parse(row.CERTIFICACIONESENTRENADOR);
            }
        });
        res.json(rows)
        })
    })
})
routes.get('/entrenante',(req,res)=>{
    req.getConnection((err,conn)=>{
        if(err) return res.send(err)
        conn.query(`
        SELECT
        p.IDPERSONA, p.IDGENERO, p.IDROLUSUARIO, p.NOMBREPERSONA, p.APELLDOPERSONA, p.CORREOPERSONA, p.NICKNAMEPERSONA, p.FECHANACIMIENTOPERSONA,
        p.ESTADOPERSONA, u.IDUSUARIO, u.IDPROFESION, u.PESOUSUARIO, u.ALTURAUSUARIO, u.MEDIDASCORPORALESUSUARIO, u.NOTIFICACIONUSUARIO, pr.DESCRIPCIONPROFESION, u.IDFRECUENCIA, f.TituloFrecuenciaEjercicio,
        f.DESCRIPCIONFRECUENCIA,
        GROUP_CONCAT(o.IDOBJETIVOSPERSONALES SEPARATOR ',') AS OBJETIVOSPERSONALES
        FROM
            persona AS p
        JOIN
            usuario AS u ON p.IDPERSONA = u.IDPERSONA
        LEFT JOIN
            objetivospersonalesusuario AS o ON u.IDUSUARIO = o.IDUSUARIO
        JOIN
            profesion AS pr ON u.IDPROFESION = pr.IDPROFESION
        JOIN
            frecuenciaejercicio AS f ON u.IDFRECUENCIA = f.IDFRECUENCIA
        WHERE
            p.IDROLUSUARIO = 1
        GROUP BY
            u.IDUSUARIO;
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

routes.post('/activacion/:id', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.json(err);
      conn.query('UPDATE entrenador SET ACTIVACIONENTRENADOR = ? WHERE IDENTRENADOR = ?', [req.body.ACTIVACIONENTRENADOR,req.params.id], (err,rows)=>{
        if(err) return res.json(err)
        res.json({ message: 'La activación del entrenador ha sido actualizada.' });
    }) 
    });
  });

  routes.post('/estado/:id', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.json(err);
      conn.query('UPDATE persona SET ESTADOPERSONA = ? ,USUARIOMODIFICACIONPERSONA	=?,FECHAMODIFICACIONPERSONA =? WHERE IDPERSONA = ?', [req.body.ESTADOPERSONA,req.body.USUARIOMODIFICACIONPERSONA,new Date(),req.params.id], (err,rows)=>{
        if(err) return res.json(err)
        res.json({ message: 'El estado ha sido actualizada correctamente.' });
    }) 
    });
  });

  
  routes.post('/perfile/:id', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.json(err);
      conn.query('UPDATE persona SET NOMBREPERSONA = ? ,APELLDOPERSONA=? ,FECHANACIMIENTOPERSONA=? ,USUARIOMODIFICACIONPERSONA	=?,FECHAMODIFICACIONPERSONA =? WHERE IDPERSONA = ?', [req.body.NOMBREPERSONA,req.body.APELLDOPERSONA,req.body.FECHANACIMIENTOPERSONA,req.body.USUARIOMODIFICACIONPERSONA,new Date(),req.params.id], (err,rows)=>{
        if(err) return res.json(err)
        res.json({ message: 'Los datos han sido actualizada correctamente.' });
    }) 
    });
  });
  routes.post('/updatepassword/', (req, res) => {
    console.log(req.body);
    req.getConnection((err, conn) => {
      if (err) return res.json(err);
      conn.query('UPDATE persona SET CONTRASENIAPERSONA = ?, USUARIOMODIFICACIONPERSONA	=?,FECHAMODIFICACIONPERSONA =? WHERE IDPERSONA = ?', [req.body.CONTRASENIAPERSONA,req.body.USUARIOMODIFICACIONPERSONA,new Date(),req.body.IDPERSONA], (err,rows)=>{
        if(err) return res.json(err)
        res.json({ message: 'Los datos han sido actualizada correctamente.' });
    }) 
    });
  });

  routes.post('/updatePersona',(req,res)=>{
    const persona = {
      IDGENERO: req.body.IDGENERO,
      IDROLUSUARIO: req.body.IDROLUSUARIO,
      NOMBREPERSONA: req.body.NOMBREPERSONA,
      APELLDOPERSONA: req.body.APELLDOPERSONA,
      CORREOPERSONA: req.body.CORREOPERSONA,
      NICKNAMEPERSONA: req.body.NICKNAMEPERSONA,
      FECHANACIMIENTOPERSONA: req.body.FECHANACIMIENTOPERSONA,
      FECHAMODIFICACIONPERSONA:new Date(),
      USUARIOMODIFICACIONPERSONA: req.body.USUARIOMODIFICACIONPERSONA,
      ESTADOPERSONA: req.body.ESTADOPERSONA,
  
    };
      req.getConnection((err,conn)=>{
          if(err) return res.json(err)
          conn.query('UPDATE persona SET ? WHERE IDPERSONA = ?', [persona,req.body.IDPERSONA], (err,rows)=>{
            if (err) {
              return res.status(500).json({ error: 'Error al actualizar Datos'+err });
            }
              res.json({ message: 'Actualizado Datos Correctamente !'});
          }) 
      })
  })



module.exports = routes;