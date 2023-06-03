const express = require('express');
const routes = express.Router();
const fileUpload = require('express-fileupload');

routes.use(fileUpload());

routes.get('/', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.send(err);
  
      conn.query('SELECT * FROM `multimedia` ORDER BY 1', (err, rows) => {
        if (err) return res.send(err);
  
        res.json(rows);
      });
    });
  });
  routes.get('/multimediaActivate', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.send(err);
  
      conn.query('SELECT * FROM `multimedia` WHERE STATUSMULTIMEDIA = 1 ORDER BY 1', (err, rows) => {
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
  
      conn.query('SELECT * FROM `tipoejercicio` order by `NOMBRETIPOEJERCICIO`', (err, rows) => {
        if (err) return res.send(err);
  
        res.json(rows);
      });
    });
  });
  routes.get('/tipoejercicioActivate', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.send(err);
  
      conn.query('SELECT * FROM `tipoejercicio` WHERE STATUSTIPOEJERCICIO= 1 order by `NOMBRETIPOEJERCICIO` ', (err, rows) => {
        if (err) return res.send(err);
  
        res.json(rows);
      });
    });
  });
  routes.get('/objetivosmusculares', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.send(err);
  
      conn.query('SELECT * FROM `objetivosmusculares` ORDER BY `NOMBREOBJETIVOSMUSCULARES`', (err, rows) => {
        if (err) return res.send(err);
  
        res.json(rows);
      });
    });
  });
  routes.get('/objetivosmuscularesActivate', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.send(err);
  
      conn.query('SELECT * FROM `objetivosmusculares` where STATUSOBJETIVOSMUSCULARES = 1 ORDER BY `NOMBREOBJETIVOSMUSCULARES`', (err, rows) => {
        if (err) return res.send(err);
  
        res.json(rows);
      });
    });
  });
  routes.get('/ejercicio', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.send(err);
  
      conn.query(`
      SELECT e.IDEJERCICIO, e.IDMULTIMEDIA, m.TITULOMULTIMEDIA, m.DESCRIPCIONMULTIMEDIA, m.ALMACENAMIENTOMULTIMEDIA, m.OBSERVACIONMULTIMEDIA, e.IDTIPOEJERCICIO, t.NOMBRETIPOEJERCICIO, e.IDNIVELDIFICULTADEJERCICIO,n.tituloniveldificultadejercicio , e.IDENTRENADOR, e.IDOBJETIVOMUSCULAR, e.NOMBREEJERCICIO, e.DESCRIPCIONEJERCICIO, e.INTRUCCIONESEJERCICIO, e.PESOLEVANTADOEJERCICIO, e.REPETICIONESEJERCICIO, e.TIEMPOREALIZACIONEJERCICIO, e.SERIESEJERCICIO, e.VARIACIONESMODIFICACIONEJERCICIOPROGRESO, e.OBSERVACIONESEJERCICIO, e.FECHACREACIONEJERCICIO, e.FECHAMODIFICACIONEJERCICIO, e.USUARIOCREACIONEJERCICIO, e.USUARIOMODIFICAICONEJERCICIO, e.ESTADOEJERCICIO
      FROM ejercicio AS e
      JOIN tipoejercicio AS t ON e.IDTIPOEJERCICIO = t.IDTIPOEJERCICIO
      JOIN niveldificultadejercicio AS n ON e.IDNIVELDIFICULTADEJERCICIO = n.IDNIVELDIFICULTADEJERCICIO
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
      SELECT e.IDEJERCICIO, e.IDMULTIMEDIA, m.TITULOMULTIMEDIA,  m.ALMACENAMIENTOMULTIMEDIA,  e.IDTIPOEJERCICIO, t.NOMBRETIPOEJERCICIO, e.IDNIVELDIFICULTADEJERCICIO,
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
  routes.post('/chanceActivacion/:nombre', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.json(err);
      const observacion = `OBSERVACION${req.params.nombre.toUpperCase()}`;
      const observacionValue = req.body[observacion];
      const status = `STATUS${req.params.nombre.toUpperCase()}`;
      const statusValue = req.body[status];
      const id = `ID${req.params.nombre.toUpperCase()}`;
      const idValue = req.body[id];
      conn.query('UPDATE ?? SET ?? = ?, ??=? WHERE ?? = ?', [req.params.nombre, status, statusValue,observacion,observacionValue, id, idValue], (err, rows) => {
        if (err) return res.json(err)
        res.json({ message: 'La activación ha sido actualizada.' });
      });
    });
  });
  routes.post('/UpdateData/:nombre', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.json(err);
      const nombre = `NOMBRE${req.params.nombre.toUpperCase()}`;
      const nombreValue = req.body[nombre];
      const descripcion = `DESCRIPCION${req.params.nombre.toUpperCase()}`;
      const descripcionValue = req.body[descripcion];
      const observacion = `OBSERVACION${req.params.nombre.toUpperCase()}`;
      const observacionValue = req.body[observacion];
      const status = `STATUS${req.params.nombre.toUpperCase()}`;
      const statusValue = req.body[status];
      const id = `ID${req.params.nombre.toUpperCase()}`;
      const idValue = req.body[id];
  
      conn.query('UPDATE ?? SET   ?? = ?,  ?? = ?, ?? = ?, ??=? WHERE ?? = ?', [req.params.nombre, nombre, nombreValue,descripcion,descripcionValue, status, statusValue,observacion,observacionValue, id, idValue], (err, rows) => {
        if (err) return res.json(err)
        res.json({ message: 'La activación ha sido actualizada.' });
      });
    });
  });

  routes.post('/CreateData/:nombre', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.json(err);
      const nombre = `NOMBRE${req.params.nombre.toUpperCase()}`;
      const nombreValue = req.body[nombre];
      const descripcion = `DESCRIPCION${req.params.nombre.toUpperCase()}`;
      const descripcionValue = req.body[descripcion];
      const observacion = `OBSERVACION${req.params.nombre.toUpperCase()}`;
      const observacionValue = req.body[observacion];
      const status = `STATUS${req.params.nombre.toUpperCase()}`;
      const statusValue = req.body[status];
  
      conn.query('INSERT INTO ?? (??, ??, ??, ??) VALUES (?, ?, ?, ?)', [req.params.nombre, nombre, descripcion, status, observacion, nombreValue, descripcionValue, statusValue, observacionValue], (err, rows) => {
        if (err) return res.json(err)
        res.json({ message: 'El registro ha sido creado.' });
      });
    });
  });

  routes.post('/UpdateDataMultimedia/:nombre', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.json(err);
      const titulo = `TITULO${req.params.nombre.toUpperCase()}`;
      const tituloValue = req.body[titulo];
      const descripcion = `DESCRIPCION${req.params.nombre.toUpperCase()}`;
      const descripcionValue = req.body[descripcion];
      const almacenamiento = `ALMACENAMIENTO${req.params.nombre.toUpperCase()}`;
      const almacenamientoValue = req.body[almacenamiento];
      const observacion = `OBSERVACION${req.params.nombre.toUpperCase()}`;
      const observacionValue = req.body[observacion];
      const status = `STATUS${req.params.nombre.toUpperCase()}`;
      const statusValue = req.body[status];
      const id = `ID${req.params.nombre.toUpperCase()}`;
      const idValue = req.body[id];
  
      conn.query('UPDATE ?? SET   ?? = ?,  ?? = ?, ?? = ?, ?? = ?, ??=? WHERE ?? = ?', [req.params.nombre, titulo, tituloValue,descripcion,descripcionValue, almacenamiento,almacenamientoValue ,status, statusValue,observacion,observacionValue, id, idValue], (err, rows) => {
        if (err) return res.json(err)
        res.json({ message: 'Los Datos ham sido actualizado.' });
      });
    });
  });

  routes.post('/CreateDataMultimedia/:nombre', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.json(err);
      const titulo = `TITULO${req.params.nombre.toUpperCase()}`;
      const tituloValue = req.body[titulo];
      const descripcion = `DESCRIPCION${req.params.nombre.toUpperCase()}`;
      const descripcionValue = req.body[descripcion];
      const almacenamiento = `ALMACENAMIENTO${req.params.nombre.toUpperCase()}`;
      const almacenamientoValue = req.body[almacenamiento];
      const observacion = `OBSERVACION${req.params.nombre.toUpperCase()}`;
      const observacionValue = req.body[observacion];
      const status = `STATUS${req.params.nombre.toUpperCase()}`;
      const statusValue = req.body[status];
  
      conn.query('INSERT INTO ?? (??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?)', [req.params.nombre, titulo, descripcion, almacenamiento, status,observacion , tituloValue,descripcionValue,almacenamientoValue, statusValue, observacionValue], (err, rows) => {
        if (err) return res.json(err)
        res.json({ message: 'El registro ha sido creado.' });
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

  routes.post('/CreateDataEjercicio', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.json(err);
  
      const data = req.body; // Obtener los datos del cuerpo de la solicitud
  
      // Definir las columnas y los valores correspondientes
      const columns = [
        'IDMULTIMEDIA',
        'IDTIPOEJERCICIO',
        'IDNIVELDIFICULTADEJERCICIO',
        'IDENTRENADOR',
        'IDOBJETIVOMUSCULAR',
        'NOMBREEJERCICIO',
        'DESCRIPCIONEJERCICIO',
        'INTRUCCIONESEJERCICIO',
        'PESOLEVANTADOEJERCICIO',
        'REPETICIONESEJERCICIO',
        'TIEMPOREALIZACIONEJERCICIO',
        'SERIESEJERCICIO',
        'VARIACIONESMODIFICACIONEJERCICIOPROGRESO',
        'OBSERVACIONESEJERCICIO',
        'FECHACREACIONEJERCICIO',
        'USUARIOCREACIONEJERCICIO',
        'ESTADOEJERCICIO'
      ];
  
      const values = [
        data.IDMULTIMEDIA,
        data.IDTIPOEJERCICIO,
        data.IDNIVELDIFICULTADEJERCICIO,
        data.IDENTRENADOR,
        data.IDOBJETIVOMUSCULAR,
        data.NOMBREEJERCICIO,
        data.DESCRIPCIONEJERCICIO,
        data.INTRUCCIONESEJERCICIO,
        data.PESOLEVANTADOEJERCICIO,
        data.REPETICIONESEJERCICIO,
        data.TIEMPOREALIZACIONEJERCICIO,
        data.SERIESEJERCICIO,
        data.VARIACIONESMODIFICACIONEJERCICIOPROGRESO,
        data.OBSERVACIONESEJERCICIO,
        new Date(),
        data.USUARIOCREACIONEJERCICIO,
        data.ESTADOEJERCICIO
      ];
  
      conn.query('INSERT INTO ejercicio (' + columns.join(',') + ') VALUES ?', [[values]], (err, rows) => {
        if (err) {
          return res.status(500).json({ error: 'Error al actualizar Datos' + err });
        }
        res.json({ message: 'Datos actualizados correctamente' });
      });
    });
  });
  
  routes.post('/UpdateDataEjercicio', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.json(err);
  
      const data = req.body; // Obtener los datos del cuerpo de la solicitud
  
      // Definir los valores a actualizar
      const values = [
        data.IDMULTIMEDIA,
        data.IDTIPOEJERCICIO,
        data.IDNIVELDIFICULTADEJERCICIO,
        data.IDENTRENADOR,
        data.IDOBJETIVOMUSCULAR,
        data.NOMBREEJERCICIO,
        data.DESCRIPCIONEJERCICIO,
        data.INTRUCCIONESEJERCICIO,
        data.PESOLEVANTADOEJERCICIO,
        data.REPETICIONESEJERCICIO,
        data.TIEMPOREALIZACIONEJERCICIO,
        data.SERIESEJERCICIO,
        data.VARIACIONESMODIFICACIONEJERCICIOPROGRESO,
        data.OBSERVACIONESEJERCICIO,
        new Date(),
        data.USUARIOMODIFICAICONEJERCICIO,
        data.ESTADOEJERCICIO,
        data.IDEJERCICIO // ID del ejercicio que se va a actualizar
      ];
  
      conn.query('UPDATE ejercicio SET IDMULTIMEDIA = ?, IDTIPOEJERCICIO = ?, IDNIVELDIFICULTADEJERCICIO = ?, IDENTRENADOR = ?, IDOBJETIVOMUSCULAR = ?, NOMBREEJERCICIO = ?, DESCRIPCIONEJERCICIO = ?, INTRUCCIONESEJERCICIO = ?, PESOLEVANTADOEJERCICIO = ?, REPETICIONESEJERCICIO = ?, TIEMPOREALIZACIONEJERCICIO = ?, SERIESEJERCICIO = ?, VARIACIONESMODIFICACIONEJERCICIOPROGRESO = ?, OBSERVACIONESEJERCICIO = ?, FECHAMODIFICACIONEJERCICIO = ?, USUARIOMODIFICAICONEJERCICIO = ?, ESTADOEJERCICIO = ? WHERE IDEJERCICIO = ?', values, (err, rows) => {
        if (err) {
          return res.status(500).json({ error: 'Error al actualizar los datos: ' + err });
        }
        res.json({ message: 'Datos actualizados correctamente' });
      });
    });
  });
  

  routes.post('/subir-archivo', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: 'No se ha seleccionado ningún archivo' });
    }
  
    const file = req.files.file;
  
    // Mueve el archivo al directorio deseado
    const filePath = './multimedia/' + file.name;
    file.mv(filePath, error => {
      if (error) {
        return res.status(500).json({ error: 'Error al subir el archivo' });
      }
  
      res.json({ message: 'Archivo subido correctamente', filePath });
    });
  });
  
  
  routes.post('/subir-imagen', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: 'No se ha seleccionado ningún archivo' });
    }
  
    const file = req.files.file;
  
    // Mueve el archivo al directorio deseado
    const filePath = './multimedia/' + file.name;
    file.mv(filePath, error => {
      if (error) {
        return res.status(500).json({ error: 'Error al subir el archivo' });
      }
  
      res.json({ message: 'Captura subido correctamente', filePath });
    });
  });
  
module.exports = routes;