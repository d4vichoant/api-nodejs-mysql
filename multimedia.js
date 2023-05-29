const express = require('express');
const routes = express.Router();

routes.get('/', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.send(err);
  
      conn.query('SELECT * FROM `multimedia` ORDER BY `TITULOMULTIMEDIA`', (err, rows) => {
        if (err) return res.send(err);
  
        res.json(rows);
      });
    });
  });

  routes.get('/equiporequerido', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.send(err);
  
      conn.query('SELECT * FROM `equiporequerido` ORDER BY `tituloequiporequerido`', (err, rows) => {
        if (err) return res.send(err);
  
        res.json(rows);
      });
    });
  });

  routes.get('/tipoejercicio', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.send(err);
  
      conn.query('SELECT * FROM `tipoejercicio` order by `titulotipoejercicio`', (err, rows) => {
        if (err) return res.send(err);
  
        res.json(rows);
      });
    });
  });
  routes.get('/objetivosmusculares', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.send(err);
  
      conn.query('SELECT * FROM `objetivosmusculares` ORDER BY `NOMBREOBJETIVOMUSCULAR`', (err, rows) => {
        if (err) return res.send(err);
  
        res.json(rows);
      });
    });
  });
  routes.get('/ejercicio', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.send(err);
  
      conn.query(`
      SELECT e.IDEJERCICIO, e.IDMULTIMEDIA, m.TITULOMULTIMEDIA, m.DESCRIPCIONMULTIMEDIA, m.ALMACENAMIENTOMULTIMEDIA, m.OBSERVACIONESMULTIMEDIA, e.IDTIPOEJERCICIO, t.titulotipoejercicio, e.IDNIVELDIFICULTADEJERCICIO, e.IDENTRENADOR, e.IDOBJETIVOMUSCULAR, e.NOMBREEJERCICIO, e.DESCRIPCIONEJERCICIO, e.INTRUCCIONESEJERCICIO, e.PESOLEVANTADOEJERCICIO, e.REPETICIONESEJERCICIO, e.TIEMPOREALIZACIONEJERCICIO, e.SERIESEJERCICIO, e.VARIACIONESMODIFICACIONEJERCICIOPROGRESO, e.OBSERVACIONESEJERCICIO, e.FECHACREACIONEJERCICIO, e.FECHAMODIFICACIONEJERCICIO, e.USUARIOCREACIONEJERCICIO, e.USUARIOMODIFICAICONEJERCICIO, e.ESTADOEJERCICIO
      FROM ejercicio AS e
      JOIN tipoejercicio AS t ON e.IDTIPOEJERCICIO = t.IDTIPOEJERCICIO
      JOIN multimedia AS m ON e.IDMULTIMEDIA = m.IDMULTIMEDIA
      WHERE 1;
      `, (err, rows) => {
        if (err) return res.send(err);
  
        res.json(rows);
      });
    });
  });
  routes.get('/preejercicio', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.send(err);
  
      conn.query(`
      SELECT e.IDEJERCICIO, e.IDMULTIMEDIA, m.TITULOMULTIMEDIA,  m.ALMACENAMIENTOMULTIMEDIA,  e.IDTIPOEJERCICIO, t.titulotipoejercicio, e.IDNIVELDIFICULTADEJERCICIO,
      n.tituloniveldificultadejercicio ,e.NOMBREEJERCICIO, e.ESTADOEJERCICIO
      FROM ejercicio AS e
      JOIN tipoejercicio AS t ON e.IDTIPOEJERCICIO = t.IDTIPOEJERCICIO
      JOIN niveldificultadejercicio AS n ON e.IDNIVELDIFICULTADEJERCICIO = n.IDNIVELDIFICULTADEJERCICIO
      JOIN multimedia AS m ON e.IDMULTIMEDIA = m.IDMULTIMEDIA
      ORDER BY e.NOMBREEJERCICIO
      `, (err, rows) => {
        if (err) return res.send(err);
  
        res.json(rows);
      });
    });
  });
  routes.get('/niveldificultadejercicio', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.send(err);
  
      conn.query('SELECT * FROM `niveldificultadejercicio`', (err, rows) => {
        if (err) return res.send(err);
  
        res.json(rows);
      });
    });
  });

  routes.post('/estado/:id', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.json(err);
      // Obtener forakey de la tabla "persona" basado en el atributo "nickname"
      conn.query('SELECT * FROM persona WHERE NICKNAMEPERSONA = ?', [req.body.USUARIOMODIFICAICONEJERCICIO ], (err, rows) => {
        if (err) return res.json(err);
        const idPersona = rows[0].IDPERSONA; // Obtener el forakey de persona
  
        // Actualizar la tabla "ejercicio" con el forakey obtenido
        conn.query('UPDATE ejercicio SET ESTADOEJERCICIO = ?, USUARIOMODIFICAICONEJERCICIO  = ?, FECHAMODIFICACIONEJERCICIO = ? WHERE IDEJERCICIO = ?', [req.body.ESTADOEJERCICIO, idPersona, new Date(), req.params.id], (err, rows) => {
          if (err) return res.json(err);
          res.json({ message: 'El estado ha sido actualizado correctamente.' });
        });
      });
    });
  });
  
  
module.exports = routes;