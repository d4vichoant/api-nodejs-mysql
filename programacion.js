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
        SELECT r.IDRUTINA, r.IDENTRENADOR, r.IDTIPOEJERCICIORUTINA, t.NOMBRETIPOEJERCICIO,
            r.IDOBJETIVOSPERSONALESRUTINA, o.DESCRIPCIONOBJETIVOSPERSONALES,
                r.NOMBRERUTINA, r.DESCRIPCIONRUTINA, r.DURACIONRUTINA, r.IMAGENRUTINA,
                r.OBSERVACIONRUTINA, r.FECHACREACIONRUTINA, r.FECHAMODIFICACIONRUTINA,
                r.USUARIOCREACIONRUTINA, r.USUARIOMODIFICAIONRUTINA, r.COMENTARIOSRUTINA,
                r.STATUSRUTINA, GROUP_CONCAT(re.IDEJERCICIO SEPARATOR ',') AS IDEJERCICIOS
        FROM rutina r
        LEFT JOIN rutinasdeejercicios re ON r.IDRUTINA = re.IDRUTINA
        JOIN tipoejercicio t ON r.IDTIPOEJERCICIORUTINA = t.IDTIPOEJERCICIO
        JOIN objetivospersonales o ON r.IDOBJETIVOSPERSONALESRUTINA = o.IDOBJETIVOSPERSONALES 
        WHERE r.STATUSRUTINA=1
        GROUP BY r.IDRUTINA
        `,(err,rows)=>{
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
      //console.log(values);
  
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
            return res.status(500).json({ error: 'Error al eliminar registros relacionados' + err });
          }

        if(data.ID_EJERCICIOS_RUTINA){
          const idsArray = data.ID_EJERCICIOS_RUTINA.split(',').map(id => [data.IDRUTINA, parseInt(id)]);
          conn.query('INSERT INTO  rutinasdeejercicios (IDRUTINA  , IDEJERCICIO   ) VALUES ?', [idsArray], (err, result) => {
          if (err) {
            return res.status(500).json({ error: 'Error al insertar en trabla de Equipos Requeridos' + err });
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


  module.exports = routes;