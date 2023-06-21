const express = require('express');
const routes = express.Router();

routes.get('/rutinas',(req,res)=>{
  req.getConnection((err,conn)=>{
      if(err) return res.send(err)
      conn.query(`
      SELECT r.IDRUTINA, r.IDENTRENADOR, r.IDTIPOEJERCICIORUTINA, t.NOMBRETIPOEJERCICIO,
            r.IDOBJETIVOSPERSONALESRUTINA, o.DESCRIPCIONOBJETIVOSPERSONALES,
              r.NOMBRERUTINA, r.DESCRIPCIONRUTINA, r.DURACIONRUTINA, r.IMAGENRUTINA,
              r.OBSERVACIONRUTINA,  r.COMENTARIOSRUTINA,
              r.STATUSRUTINA, GROUP_CONCAT(re.IDEJERCICIO SEPARATOR ',') AS IDEJERCICIOS
      FROM rutina r
      LEFT JOIN rutinasdeejercicios re ON r.IDRUTINA = re.IDRUTINA
      JOIN tipoejercicio t ON r.IDTIPOEJERCICIORUTINA = t.IDTIPOEJERCICIO
      JOIN objetivospersonales o ON r.IDOBJETIVOSPERSONALESRUTINA = o.IDOBJETIVOSPERSONALES 
      GROUP BY r.IDRUTINA
      `,(err,rows)=>{
          if(err) return res.send(err)
          res.json(rows)
      })
  })
});

  routes.get('/rutinasActivate',(req,res)=>{
    req.getConnection((err,conn)=>{
        if(err) return res.send(err)
        conn.query(`
        SELECT r.IDRUTINA, r.IDENTRENADOR, p.NICKNAMEPERSONA, r.IDTIPOEJERCICIORUTINA, t.NOMBRETIPOEJERCICIO,
            r.IDOBJETIVOSPERSONALESRUTINA, o.DESCRIPCIONOBJETIVOSPERSONALES,
                r.NOMBRERUTINA, r.DESCRIPCIONRUTINA, r.DURACIONRUTINA, r.IMAGENRUTINA,
                r.OBSERVACIONRUTINA, r.FECHACREACIONRUTINA, r.FECHAMODIFICACIONRUTINA,
                r.USUARIOCREACIONRUTINA, r.USUARIOMODIFICAIONRUTINA, r.COMENTARIOSRUTINA,
                r.STATUSRUTINA, GROUP_CONCAT(re.IDEJERCICIO SEPARATOR ',') AS IDEJERCICIOS
        FROM rutina r
        LEFT JOIN rutinasdeejercicios re ON r.IDRUTINA = re.IDRUTINA
        JOIN tipoejercicio t ON r.IDTIPOEJERCICIORUTINA = t.IDTIPOEJERCICIO
        JOIN persona p ON r.IDENTRENADOR = p.IDPERSONA
        JOIN objetivospersonales o ON r.IDOBJETIVOSPERSONALESRUTINA = o.IDOBJETIVOSPERSONALES 
        WHERE r.STATUSRUTINA=1
        GROUP BY r.IDRUTINA
        `,(err,rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
  });
  routes.get('/rutinasActivatebyObjetive/:idObjetive',(req,res)=>{
    req.getConnection((err,conn)=>{
        if(err) return res.send(err)
        conn.query(`
        SELECT r.IDRUTINA, r.IDENTRENADOR, p.NICKNAMEPERSONA, r.IDTIPOEJERCICIORUTINA, t.NOMBRETIPOEJERCICIO,
            r.IDOBJETIVOSPERSONALESRUTINA, o.DESCRIPCIONOBJETIVOSPERSONALES,
                r.NOMBRERUTINA, r.DESCRIPCIONRUTINA, r.DURACIONRUTINA, r.IMAGENRUTINA,
                r.OBSERVACIONRUTINA, r.FECHACREACIONRUTINA, r.FECHAMODIFICACIONRUTINA,
                r.USUARIOCREACIONRUTINA, r.USUARIOMODIFICAIONRUTINA, r.COMENTARIOSRUTINA,
                r.STATUSRUTINA, GROUP_CONCAT(re.IDEJERCICIO SEPARATOR ',') AS IDEJERCICIOS
        FROM rutina r
        LEFT JOIN rutinasdeejercicios re ON r.IDRUTINA = re.IDRUTINA
        JOIN tipoejercicio t ON r.IDTIPOEJERCICIORUTINA = t.IDTIPOEJERCICIO
        JOIN persona p ON r.IDENTRENADOR = p.IDPERSONA
        JOIN objetivospersonales o ON r.IDOBJETIVOSPERSONALESRUTINA = o.IDOBJETIVOSPERSONALES 
        WHERE r.STATUSRUTINA=1  AND r.IDOBJETIVOSPERSONALESRUTINA = ?
        GROUP BY r.IDRUTINA
        `,[req.params.idObjetive] ,(err,rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
  });
  
  routes.get('/imagePorEntrenadorRutina',(req,res)=>{
    req.getConnection((err,conn)=>{
        if(err) return res.send(err)
        conn.query(`
        SELECT DISTINCT r.IDENTRENADOR, p.IMAGEPERSONA
        FROM rutina r
        LEFT JOIN rutinasdeejercicios re ON r.IDRUTINA = re.IDRUTINA
        JOIN persona p ON p.IDPERSONA = r.IDENTRENADOR 
        JOIN tipoejercicio t ON r.IDTIPOEJERCICIORUTINA = t.IDTIPOEJERCICIO
        JOIN objetivospersonales o ON r.IDOBJETIVOSPERSONALESRUTINA = o.IDOBJETIVOSPERSONALES 
        GROUP BY r.IDENTRENADOR
        `,(err,rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
  });
  routes.get('/imagePorEntrenadorSesion',(req,res)=>{
    req.getConnection((err,conn)=>{
        if(err) return res.send(err)
        conn.query(`
        SELECT DISTINCT pr.IDENTRENADOR, p.IMAGEPERSONA
        FROM programarsesion pr
        LEFT JOIN programarsesionrutinas ps ON pr.IDSESION = ps.IDSESION
        JOIN persona p ON pr.IDENTRENADOR = p.IDPERSONA 
        GROUP BY pr.IDENTRENADOR
        `,(err,rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        }) 
    })
  });
  
  routes.get('/sesiones',(req,res)=>{
    req.getConnection((err,conn)=>{
        if(err) return res.send(err)
        conn.query(`
        SELECT pr.IDSESION, pr.IDENTRENADOR, per.NICKNAMEPERSONA, pr.IDFRECUENCIASESION,
                COALESCE(f.TituloFrecuenciaEjercicio, null) AS TituloFrecuenciaEjercicio,
                pr.IDPROFESIONSESION, COALESCE(p.DESCRIPCIONPROFESION, null) AS DESCRIPCIONPROFESION,
                pr.IDOBJETIVOSPERSONALESSESION, COALESCE(o.DESCRIPCIONOBJETIVOSPERSONALES, null) AS DESCRIPCIONOBJETIVOSPERSONALES,
                pr.NOMBRESESION, pr.IMAGESESION, pr.OBJETIVOSESION, pr.OBSERVACIONSESION,
                pr.STATUSSESION, GROUP_CONCAT(pse.IDRUTINA SEPARATOR ',') AS IDRUTINAS
        FROM programarsesion pr
        LEFT JOIN programarsesionrutinas pse ON pr.IDSESION = pse.IDSESION
        LEFT JOIN frecuenciaejercicio f ON pr.IDFRECUENCIASESION = f.IDFRECUENCIA
        LEFT JOIN objetivospersonales o ON pr.IDOBJETIVOSPERSONALESSESION = o.IDOBJETIVOSPERSONALES
        LEFT JOIN profesion p ON pr.IDPROFESIONSESION = p.IDPROFESION
        JOIN persona per ON pr.IDENTRENADOR = per.IDPERSONA
        GROUP BY pr.IDSESION;
        `,(err,rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
  });
  routes.get('/sesionesActivate',(req,res)=>{
    req.getConnection((err,conn)=>{
        if(err) return res.send(err)
        conn.query(`
        SELECT pr.IDSESION, pr.IDENTRENADOR, per.NICKNAMEPERSONA, pr.IDFRECUENCIASESION,
                COALESCE(f.TituloFrecuenciaEjercicio, null) AS TituloFrecuenciaEjercicio,
                pr.IDPROFESIONSESION, COALESCE(p.DESCRIPCIONPROFESION, null) AS DESCRIPCIONPROFESION,
                pr.IDOBJETIVOSPERSONALESSESION, COALESCE(o.DESCRIPCIONOBJETIVOSPERSONALES, null) AS DESCRIPCIONOBJETIVOSPERSONALES,
                pr.NOMBRESESION, pr.IMAGESESION, pr.OBJETIVOSESION, pr.OBSERVACIONSESION,
                pr.STATUSSESION, GROUP_CONCAT(pse.IDRUTINA SEPARATOR ',') AS IDRUTINAS
        FROM programarsesion pr
        LEFT JOIN programarsesionrutinas pse ON pr.IDSESION = pse.IDSESION
        LEFT JOIN frecuenciaejercicio f ON pr.IDFRECUENCIASESION = f.IDFRECUENCIA
        LEFT JOIN objetivospersonales o ON pr.IDOBJETIVOSPERSONALESSESION = o.IDOBJETIVOSPERSONALES
        LEFT JOIN profesion p ON pr.IDPROFESIONSESION = p.IDPROFESION
        JOIN persona per ON pr.IDENTRENADOR = per.IDPERSONA
        WHERE pr.STATUSSESION=1
        GROUP BY pr.IDSESION;
        `,(err,rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
  });

  routes.post('/CreateDataRutina', (req, res) => {
    //console.log(req.body);
    req.getConnection((err, conn) => {
      if (err) return res.json(err);
  
      const data = req.body; // Obtener los datos del cuerpo de la solicitud
  
      // Definir las columnas y los valores correspondientes
      const columns = [
        'IDENTRENADOR',
        'IDTIPOEJERCICIORUTINA ',
        'IDOBJETIVOSPERSONALESRUTINA',
        'NOMBRERUTINA',
        'DESCRIPCIONRUTINA',
        'DURACIONRUTINA',
        'IMAGENRUTINA',
        'OBSERVACIONRUTINA',
        'FECHACREACIONRUTINA',
        'USUARIOCREACIONRUTINA',
        'STATUSRUTINA'
      ];
  
      const values = [
        data.IDENTRENADOR,
        data.IDTIPOEJERCICIORUTINA,
        data.IDOBJETIVOSPERSONALESRUTINA,
        data.NOMBRERUTINA,
        data.DESCRIPCIONRUTINA,
        data.DURACIONRUTINA,
        data.IMAGENRUTINA,
        data.OBSERVACIONRUTINA,
        new Date(),
        data.USUARIOCREACIONRUTINA,
        data.STATUSRUTINA
      ];
  
      conn.query('INSERT INTO rutina (' + columns.join(',') + ') VALUES ?', [[values]], (err, rows) => {
        if (err) {
          return res.status(500).json({ error: 'Error al actualizar Datos' + err });
        }
        const rutinaId = rows.insertId; 

        if(data.ID_EJERCICIOS_RUTINA){
          const idsArray = data.ID_EJERCICIOS_RUTINA.split(',').map(id => [rutinaId, parseInt(id)]);
          conn.query('INSERT INTO  rutinasdeejercicios (IDRUTINA  , IDEJERCICIO   ) VALUES ?', [idsArray], (err, result) => {
          if (err) {
            return res.status(500).json({ error: 'Error al insertar en trabla de Equipos Requeridos' + err });
          }
          res.json({ message: 'Datos creados correctamente' });
          });
        }else{
          res.json({ message:  'Datos creados correctamente'  });
        }
      });
    });
  });

  routes.post('/CreateDataSesion', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.json(err);
      const data = req.body; 
      const columns = [
        'IDENTRENADOR',
        'NOMBRESESION',
        'IMAGESESION',
        'USUARIOCREACIONSESION',
        'FECHACREACIONSESION',
        'STATUSSESION',
        'OBSERVACIONSESION'
      ];
      const values = [
        data.IDENTRENADOR,
        data.NOMBRESESION,
        data.IMAGESESION,
        data.USUARIOCREACIONSESION,
        new Date(),
        data.STATUSSESION,
        data.OBSERVACIONSESION
      ];
      if(data.IDFRECUENCIASESION>=0){
        columns.push('IDFRECUENCIASESION');
        values.push(data.IDFRECUENCIASESION);
      }
      if(data.IDPROFESIONSESION>=0){
        columns.push('IDPROFESIONSESION');
        values.push(data.IDPROFESIONSESION);
      }
      if(data.IDOBJETIVOSPERSONALESSESION>=0 ){
        columns.push('IDOBJETIVOSPERSONALESSESION');
        values.push(data.IDOBJETIVOSPERSONALESSESION );
      }
      if(data.OBJETIVOSESION!=undefined){
        columns.push('OBJETIVOSESION');
        values.push(data.OBJETIVOSESION );
      }

      conn.query('INSERT INTO programarsesion (' + columns.join(',') + ') VALUES ?', [[values]], (err, rows) => {
        if (err) {
          return res.status(500).json({ error: 'Error al actualizar Datos' + err });
        }
        const sesionId = rows.insertId; 

        if(data.ID_RUTINAS_SESION){
          let idsArray = [];
          if (data.ID_RUTINAS_SESION.includes(',')) {
            idsArray = data.ID_RUTINAS_SESION.split(',').map(id => [sesionId, parseInt(id)]);
          } else {
            idsArray = [[sesionId, parseInt(data.ID_RUTINAS_SESION)]];
          }
          conn.query('INSERT INTO   programarsesionrutinas (IDSESION,IDRUTINA) VALUES ?', [idsArray], (err, result) => {
          if (err) {
            return res.status(500).json({ error: 'Error al insertar en tabla de Sesion Rutinas' + err });
          }
          res.json({ message: 'Datos creados correctamente' });
          });
        }else{
          res.json({ message:  'Datos creados correctamente'  });
        }
      });
    });
  });
  

  routes.post('/UpdateDataRutina', (req, res) => {
    //console.log(req.body);
    req.getConnection((err, conn) => {
      if (err) return res.json(err);
  
      const data = req.body; // Obtener los datos del cuerpo de la solicitud
  
      const values = [
        data.IDENTRENADOR,
        data.IDTIPOEJERCICIORUTINA,
        data.IDOBJETIVOSPERSONALESRUTINA,
        data.NOMBRERUTINA,
        data.DESCRIPCIONRUTINA,
        data.DURACIONRUTINA,
        data.IMAGENRUTINA,
        data.OBSERVACIONRUTINA,
        new Date(),
        data.USUARIOMODIFICAIONRUTINA,
        data.STATUSRUTINA,
        data.IDRUTINA
      ];
  
      conn.query(`
      UPDATE rutina SET IDENTRENADOR=?, IDTIPOEJERCICIORUTINA=?,IDOBJETIVOSPERSONALESRUTINA=?,
      NOMBRERUTINA = ?, DESCRIPCIONRUTINA=?,DURACIONRUTINA=?, IMAGENRUTINA=?,OBSERVACIONRUTINA=?,
      FECHAMODIFICACIONRUTINA=?, USUARIOMODIFICAIONRUTINA=?, STATUSRUTINA =?  WHERE IDRUTINA = ?
      `, values, (err, rows) => {
        if (err) {
          return res.status(500).json({ error: 'Error al actualizar Datos' + err });
        }
        conn.query('DELETE FROM rutinasdeejercicios WHERE IDRUTINA = ?', [data.IDRUTINA], (err, result) => {
          if (err) {
            return res.status(500).json({ error: 'Error al eliminar registros relacionados Rutinas' + err });
          }

        if(data.ID_EJERCICIOS_RUTINA){
          const idsArray = data.ID_EJERCICIOS_RUTINA.split(',').map(id => [data.IDRUTINA, parseInt(id)]);
          conn.query('INSERT INTO  rutinasdeejercicios (IDRUTINA  , IDEJERCICIO   ) VALUES ?', [idsArray], (err, result) => {
          if (err) {
            return res.status(500).json({ error: 'Error al actualizar en tabla de Rutinas Ejercicios' + err });
          }
          res.json({ message: 'Datos actualizados correctamente' });
          });
        }else{
          res.json({ message:  'Datos actualizados correctamente'  });
        }
      });
      });
    });
  });

  routes.post('/UpdateDataSesion', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.json(err);
      const data = req.body;
      const sesionId = data.IDSESION; // Obtener el IDSESION de los datos
  
      const columns = [
        'IDENTRENADOR',
        'NOMBRESESION',
        'IMAGESESION',
        'USUARIOMODIFICACIONSESION',
        'FECHAMODIFICACIONSESION',
        'STATUSSESION',
        'OBSERVACIONSESION'
      ];
      const values = [
        data.IDENTRENADOR,
        data.NOMBRESESION,
        data.IMAGESESION,
        data.USUARIOCREACIONSESION,
        new Date(),
        data.STATUSSESION,
        data.OBSERVACIONSESION
      ];
      if (data.IDFRECUENCIASESION >= 0) {
        columns.push('IDFRECUENCIASESION');
        values.push(data.IDFRECUENCIASESION);
      }
      if (data.IDPROFESIONSESION >= 0) {
        columns.push('IDPROFESIONSESION');
        values.push(data.IDPROFESIONSESION);
      }
      if (data.IDOBJETIVOSPERSONALESSESION >= 0) {
        columns.push('IDOBJETIVOSPERSONALESSESION');
        values.push(data.IDOBJETIVOSPERSONALESSESION);
      }
      if (data.OBJETIVOSESION != undefined) {
        columns.push('OBJETIVOSESION');
        values.push(data.OBJETIVOSESION);
      }
  
      conn.query('UPDATE programarsesion SET ' + columns.join('=?, ') + '=? WHERE IDSESION = ?', [...values, sesionId], (err, rows) => {
        if (err) {
          return res.status(500).json({ error: 'Error al actualizar Datos' + err });
        }
        conn.query('DELETE FROM programarsesionrutinas WHERE IDSESION  = ?', [sesionId], (err, result) => {
          if (err) {
            return res.status(500).json({ error: 'Error al eliminar registros relacionados Sesiones' + err });
          }
  
        if (data.ID_RUTINAS_SESION) {
          let idsArray = [];
          if (data.ID_RUTINAS_SESION.includes(',')) {
            idsArray = data.ID_RUTINAS_SESION.split(',').map(id => [sesionId, parseInt(id)]);
          } else {
            idsArray = [[sesionId, parseInt(data.ID_RUTINAS_SESION)]];
          }
          conn.query('INSERT INTO programarsesionrutinas (IDSESION, IDRUTINA) VALUES ?', [idsArray], (err, result) => {
            if (err) {
              return res.status(500).json({ error: 'Error al actualizar en tabla de Sesiones Rutinas' + err });
            }
            res.json({ message: 'Datos actualizados correctamente' });
          });
        } else {
          res.json({ message: 'Datos actualizados correctamente' });
        }
      });
      });
    });
  });
  

  module.exports = routes;