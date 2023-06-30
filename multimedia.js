const express = require('express');
const routes = express.Router();
const fileUpload = require('express-fileupload');
const Jimp = require('jimp');

const fs = require('fs');
const path = require('path');

routes.use(fileUpload());

routes.get('/', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.send(err);
  
      conn.query(`
      SELECT m.IDMULTIMEDIA, m.TITULOMULTIMEDIA, m.DESCRIPCIONMULTIMEDIA, m.ALMACENAMIENTOMULTIMEDIA, m.STATUSMULTIMEDIA,
      m.TIEMPOMULTIMEDIA, m.OBSERVACIONMULTIMEDIA, p.IDROLUSUARIO ,m.IDENTRENADORMULTIMEDIA
        FROM multimedia m
        JOIN persona p ON m.IDENTRENADORMULTIMEDIA = p.IDPERSONA
        WHERE 1 
        ORDER BY 1;
      `, (err, rows) => {
        if (err) return res.send(err);
  
        res.json(rows);
      });
    });
  });
  routes.get('/multimediaActivate', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.send(err);
  
      conn.query(`
      SELECT m.IDMULTIMEDIA, m.TITULOMULTIMEDIA, m.DESCRIPCIONMULTIMEDIA, m.ALMACENAMIENTOMULTIMEDIA,
      m.STATUSMULTIMEDIA, m.TIEMPOMULTIMEDIA, m.OBSERVACIONMULTIMEDIA, m.IDENTRENADORMULTIMEDIA,p.IDROLUSUARIO
        FROM multimedia m
        JOIN persona p ON m.IDENTRENADORMULTIMEDIA = p.IDPERSONA
        WHERE  m.STATUSMULTIMEDIA=1
      `, (err, rows) => {
        if (err) return res.send(err);
  
        res.json(rows);
      });
    });
  });
  routes.get('/equiporequeridoActivate', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.send(err);
  
      conn.query('SELECT * FROM `equiporequerido`  WHERE STATUSEQUIPOREQUERIDO = 1 ORDER BY `NOMBREEQUIPOREQUERIDO`', (err, rows) => {
        if (err) return res.send(err);
  
        res.json(rows);
      });
    });
  });

  routes.get('/equiporequerido', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.send(err);
  
      conn.query('SELECT * FROM `equiporequerido` ORDER BY `NOMBREEQUIPOREQUERIDO`', (err, rows) => {
        if (err) return res.send(err);
  
        res.json(rows);
      });
    });
  });

  routes.get('/met', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.send(err);
  
      conn.query('SELECT * FROM `metabolicequivalentoftask` ORDER BY `actividadMetabolicEquivalentOfTask`', (err, rows) => {
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
      SELECT e.IDEJERCICIO, e.IDMULTIMEDIA, m.TITULOMULTIMEDIA, m.DESCRIPCIONMULTIMEDIA,m.TIEMPOMULTIMEDIA, m.ALMACENAMIENTOMULTIMEDIA, m.OBSERVACIONMULTIMEDIA, e.IDTIPOEJERCICIO, t.NOMBRETIPOEJERCICIO, e.IDNIVELDIFICULTADEJERCICIO, n.tituloniveldificultadejercicio, e.IDENTRENADOR,per.IDROLUSUARIO, e.IDOBJETIVOMUSCULAR,obm.NOMBREOBJETIVOSMUSCULARES, e.NOMBREEJERCICIO, e.DESCRIPCIONEJERCICIO, e.INTRUCCIONESEJERCICIO, e.PESOLEVANTADOEJERCICIO, e.REPETICIONESEJERCICIO, e.METEJERCICIO, e.VARIACIONESMODIFICACIONEJERCICIOPROGRESO, e.OBSERVACIONESEJERCICIO, e.FECHACREACIONEJERCICIO, e.FECHAMODIFICACIONEJERCICIO, e.USUARIOCREACIONEJERCICIO, e.USUARIOMODIFICAICONEJERCICIO, e.ESTADOEJERCICIO,
      GROUP_CONCAT(DISTINCT er.IDEQUIPOREQUERIDO ) AS ID_EQUIPOS_REQUERIDOS,
      GROUP_CONCAT(DISTINCT er.NOMBREEQUIPOREQUERIDO) AS TITULOS_EQUIPOS_REQUERIDOS
      FROM ejercicio AS e
      JOIN tipoejercicio AS t ON e.IDTIPOEJERCICIO = t.IDTIPOEJERCICIO
      JOIN niveldificultadejercicio AS n ON e.IDNIVELDIFICULTADEJERCICIO = n.IDNIVELDIFICULTADEJERCICIO
      JOIN multimedia AS m ON e.IDMULTIMEDIA = m.IDMULTIMEDIA
      JOIN persona AS per ON e.IDENTRENADOR = per.IDPERSONA
      JOIN objetivosmusculares obm ON e.IDOBJETIVOMUSCULAR = obm.IDOBJETIVOSMUSCULARES
      LEFT JOIN equiporequeridoejercicio AS ere ON e.IDEJERCICIO = ere.IDEJERCICIO
      LEFT JOIN equiporequerido AS er ON ere.IDEQUIPOREQUERIDO = er.IDEQUIPOREQUERIDO
      WHERE 1
      GROUP BY e.IDEJERCICIO;
    `, (err, rows) => {
        if (err) return res.send(err);
  
        res.json(rows);
      });
    });
  });

  routes.get('/ejercicioActivate', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.send(err);
  
      conn.query(`
      SELECT e.IDEJERCICIO, e.IDMULTIMEDIA, m.TITULOMULTIMEDIA, m.DESCRIPCIONMULTIMEDIA,m.TIEMPOMULTIMEDIA, m.ALMACENAMIENTOMULTIMEDIA, m.OBSERVACIONMULTIMEDIA, e.IDTIPOEJERCICIO, t.NOMBRETIPOEJERCICIO, e.IDNIVELDIFICULTADEJERCICIO, n.tituloniveldificultadejercicio, e.IDENTRENADOR,per.IDROLUSUARIO, e.IDOBJETIVOMUSCULAR,obm.NOMBREOBJETIVOSMUSCULARES, e.NOMBREEJERCICIO, e.DESCRIPCIONEJERCICIO, e.INTRUCCIONESEJERCICIO, e.PESOLEVANTADOEJERCICIO, e.REPETICIONESEJERCICIO, e.METEJERCICIO, e.VARIACIONESMODIFICACIONEJERCICIOPROGRESO, e.OBSERVACIONESEJERCICIO, e.FECHACREACIONEJERCICIO, e.FECHAMODIFICACIONEJERCICIO, e.USUARIOCREACIONEJERCICIO, e.USUARIOMODIFICAICONEJERCICIO, e.ESTADOEJERCICIO,
      GROUP_CONCAT(DISTINCT er.IDEQUIPOREQUERIDO ) AS ID_EQUIPOS_REQUERIDOS,
      GROUP_CONCAT(DISTINCT er.NOMBREEQUIPOREQUERIDO) AS TITULOS_EQUIPOS_REQUERIDOS
      FROM ejercicio AS e
      JOIN tipoejercicio AS t ON e.IDTIPOEJERCICIO = t.IDTIPOEJERCICIO
      JOIN niveldificultadejercicio AS n ON e.IDNIVELDIFICULTADEJERCICIO = n.IDNIVELDIFICULTADEJERCICIO
      JOIN multimedia AS m ON e.IDMULTIMEDIA = m.IDMULTIMEDIA
      JOIN persona AS per ON e.IDENTRENADOR = per.IDPERSONA
      JOIN objetivosmusculares obm ON e.IDOBJETIVOMUSCULAR = obm.IDOBJETIVOSMUSCULARES
      LEFT JOIN equiporequeridoejercicio AS ere ON e.IDEJERCICIO = ere.IDEJERCICIO
      LEFT JOIN equiporequerido AS er ON ere.IDEQUIPOREQUERIDO = er.IDEQUIPOREQUERIDO
      WHERE e.ESTADOEJERCICIO=1
      GROUP BY e.IDEJERCICIO;
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

  routes.get('/obtenerComentariosporEjercicio/:idEjercicio', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.send(err);
  
      conn.query(`
      SELECT p.IDEJERCICIO, p.IDUSUARIO, p.IDPROGRESO, p.FECHAREGISTROPROGRESO, p.STATUSPROGRESO, pr.IMAGEPERSONA,
      p.OBSERVACIONPROGRESO, p.METAALCANZADAPROGRESO, p.CALIFICACIONPROGRESO, pr.NICKNAMEPERSONA
      FROM progreso p
      JOIN usuario u ON p.IDUSUARIO = u.IDUSUARIO
      JOIN persona pr ON u.IDPERSONA = pr.IDPERSONA
      WHERE p.IDEJERCICIO=?
      `,[req.params.idEjercicio], (err, rows) => {
        if (err) return res.send(err);
        res.json(rows);
      });
    });
  });

  routes.post('/chanceActivacion/:nombre', (req, res) => {
      let parametro="";
      req.getConnection((err, conn) => {
      if(req.params.nombre==="programarsesion"){
        parametro="sesion"
      }else{
        parametro=req.params.nombre;
      }
      if (err) return res.json(err);
      const observacion = `OBSERVACION${parametro.toUpperCase()}`;
      const observacionValue = req.body[observacion];
      const status = `STATUS${parametro.toUpperCase()}`;
      const statusValue = req.body[status];
      const id = `ID${parametro.toUpperCase()}`;
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
      const tiempo = `TIEMPO${req.params.nombre.toUpperCase()}`;
      const tiempoValue = req.body[tiempo];
      const id = `ID${req.params.nombre.toUpperCase()}`;
      const idValue = req.body[id];
  
      conn.query('UPDATE ?? SET   ?? = ?,  ?? = ?, ?? = ?, ?? = ?, ?? = ?, ??=? WHERE ?? = ?', [req.params.nombre, titulo, tituloValue,descripcion,descripcionValue, almacenamiento,almacenamientoValue ,status, statusValue,observacion,observacionValue,tiempo,tiempoValue, id, idValue], (err, rows) => {
        if (err) return res.json(err)
        res.json({ message: 'Los Datos ham sido actualizado.' });
      });
    });
  });

  routes.post('/CreateDataMultimedia/:nombre', (req, res) => {
    console.log(req.body);
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
      const tiempo = `TIEMPO${req.params.nombre.toUpperCase()}`;
      const tiempoValue = req.body[tiempo];
      const identrenador = `IDENTRENADOR${req.params.nombre.toUpperCase()}`;
      const identrenadorValue = req.body[identrenador];
  
      conn.query('INSERT INTO ?? (??, ??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?, ?, ?)', [req.params.nombre, titulo, descripcion, almacenamiento, status,tiempo,observacion ,identrenador, tituloValue,descripcionValue,almacenamientoValue, statusValue,tiempoValue, observacionValue,identrenadorValue], (err, rows) => {
        if (err) return res.json(err)
        res.json({ message: 'El registro ha sido creado.' });
      });
    });
  });

  routes.post('/UpdateDataERequerido/:nombre', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.json(err);
      const nombre = `NOMBRE${req.params.nombre.toUpperCase()}`;
      const nombreValue = req.body[nombre];
      const imagen = `IMAGEN${req.params.nombre.toUpperCase()}`;
      const imagenValue = req.body[imagen]; // Corregir aquí
      const status = `STATUS${req.params.nombre.toUpperCase()}`;
      const statusValue = req.body[status];
      const id = `ID${req.params.nombre.toUpperCase()}`;
      const idValue = req.body[id];
  
      conn.query('UPDATE ?? SET ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?', [req.params.nombre, nombre, nombreValue, imagen, imagenValue, status, statusValue, id, idValue], (err, rows) => {
        if (err) return res.json(err)
        res.json({ message: 'Los Datos han sido actualizada correctamente' });
      });
    });
  });
  
  routes.post('/CreateDataERequerido/:nombre', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.json(err);
      const nombre = `NOMBRE${req.params.nombre.toUpperCase()}`;
      const nombreValue = req.body[nombre];
      const observacion = `OBSERVACION${req.params.nombre.toUpperCase()}`;
      const observacionValue = req.body[observacion];
      const imagen = `IMAGEN${req.params.nombre.toUpperCase()}`;
      const imagenValue = req.body[imagen];
      const status = `STATUS${req.params.nombre.toUpperCase()}`;
      const statusValue = req.body[status];

  
      conn.query('INSERT INTO ?? ( ??, ??, ??, ??) VALUES ( ?, ?, ?, ?)', [req.params.nombre, nombre, observacion, imagen, status, nombreValue,observacionValue,imagenValue, statusValue], (err, rows) => {
        if (err) return res.json(err)
        res.json({ message: 'El registro ha sido creado exitosamente.' });
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
    console.log(req.body);
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
        'METEJERCICIO',
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
        data.METEJERCICIO,
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
        const ejercicioId = rows.insertId; 

        if(data.ID_EQUIPOS_REQUERIDOS){
          const idsArray = data.ID_EQUIPOS_REQUERIDOS.split(',').map(id => [ejercicioId, parseInt(id)]);
        conn.query('INSERT INTO equiporequeridoejercicio (IDEJERCICIO , IDEQUIPOREQUERIDO ) VALUES ?', [idsArray], (err, result) => {
          if (err) {
            return res.status(500).json({ error: 'Error al insertar en trabla de Equipos Requeridos' + err });
          }
          res.json({ message: 'Datos actualizados correctamente' });
          });
        }else{
          res.json({ message: 'Datos actualizados correctamente' });
        }
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
        data.METEJERCICIO,
        data.VARIACIONESMODIFICACIONEJERCICIOPROGRESO,
        data.OBSERVACIONESEJERCICIO,
        new Date(),
        data.USUARIOMODIFICAICONEJERCICIO,
        data.ESTADOEJERCICIO,
        data.IDEJERCICIO // ID del ejercicio que se va a actualizar
      ];
  
      conn.query('UPDATE ejercicio SET IDMULTIMEDIA = ?, IDTIPOEJERCICIO = ?, IDNIVELDIFICULTADEJERCICIO = ?, IDENTRENADOR = ?, IDOBJETIVOMUSCULAR = ?, NOMBREEJERCICIO = ?, DESCRIPCIONEJERCICIO = ?, INTRUCCIONESEJERCICIO = ?, PESOLEVANTADOEJERCICIO = ?, REPETICIONESEJERCICIO = ?,  METEJERCICIO = ?, VARIACIONESMODIFICACIONEJERCICIOPROGRESO = ?, OBSERVACIONESEJERCICIO = ?, FECHAMODIFICACIONEJERCICIO = ?, USUARIOMODIFICAICONEJERCICIO = ?, ESTADOEJERCICIO = ? WHERE IDEJERCICIO = ?', values, (err, rows) => {
        if (err) {
          return res.status(500).json({ error: 'Error al actualizar los datos: ' + err });
        }
        conn.query('DELETE FROM equiporequeridoejercicio WHERE IDEJERCICIO = ?', [data.IDEJERCICIO], (err, result) => {
          if (err) {
            return res.status(500).json({ error: 'Error al eliminar registros relacionados' + err });
          }

          if(data.ID_EQUIPOS_REQUERIDOS){
            const idsArray = data.ID_EQUIPOS_REQUERIDOS.split(',').map(id => [data.IDEJERCICIO, parseInt(id)]);
          conn.query('INSERT INTO equiporequeridoejercicio (IDEJERCICIO , IDEQUIPOREQUERIDO ) VALUES ?', [idsArray], (err, result) => {
            if (err) {
              return res.status(500).json({ error: 'Error al insertar en trabla de Equipos Requeridos' + err });
            }
            res.json({ message: 'Datos actualizados correctamente' });
            });
          }else{
            res.json({ message: 'Datos actualizados correctamente' });
          }
      });
      });
    });
  });
  

  routes.post('/subir-archivo', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: 'No se ha seleccionado ningún archivo' });
    }
  
    const file = req.files.file;
    const fileName = file.name.replace(/\.[^/.]+$/, ""); // Eliminar la extensión del nombre de archivo
  
    // Verificar si el nombre de archivo ya existe
    const ext = path.extname(file.name);
    let newFileName = fileName;
    let counter = 1;
    while (fs.existsSync(`./multimedia/${newFileName}${ext}`)) {
      newFileName = `${fileName}_${counter}`;
      counter++;
    }
  
    // Mueve el archivo al directorio deseado
    const filePath = `./multimedia/${newFileName}${ext}`;
    
    file.mv(filePath, error => {
      if (error) {
        return res.status(500).json({ error: 'Error al subir el archivo' });
      }
  
      res.json({ message: 'Archivo subido correctamente', fileName: newFileName });
    });
  });
  
  
    
  routes.post('/subir-imagen-erequerido', async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: 'No se ha seleccionado ningún archivo' });
    }
  
    const file = req.files.file;
    const ext = path.extname(file.name);
    const fileName = file.name.replace(/\.[^/.]+$/, ""); // Eliminar la extensión del nombre de archivo
    // Verificar si el nombre de archivo ya existe
    let newFileName = fileName;
    let counter = 1;
    while (fs.existsSync(`./media/equipoRequerido/${newFileName}${ext}`)) {
      newFileName = `${fileName}_${counter}`;
      counter++;
    }
  
    // Mueve el archivo al directorio deseado
    const filePath = `./media/equipoRequerido/${newFileName}${ext}`;
  
    try {
      const image = await Jimp.read(file.data);
      await image.resize(100, Jimp.AUTO);
      await image.writeAsync(filePath);
      res.json({ message: 'Imagen subida correctamente', fileNameNew: newFileName });
    } catch (error) {
      res.status(500).json({ error: 'Error al subir el archivo' });
    }
  });
  routes.post('/subir-imagen', async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: 'No se ha seleccionado ningún archivo' });
    }
  
    const file = req.files.file;
    const fileName = file.name.replace(/\.[^/.]+$/, ""); // Eliminar la extensión del nombre de archivo
  
    // Verificar si el nombre de archivo ya existe
    const ext = path.extname(file.name);
    let newFileName = fileName;
    let counter = 1;
    while (fs.existsSync(`./multimedia/${newFileName}${ext}`)) {
      newFileName = `${fileName}_${counter}`;
      counter++;
    }
  
    // Mueve el archivo al directorio deseado
    const filePath = `./multimedia/${newFileName}${ext}`;
  
    try {
      const image = await Jimp.read(file.data);
      await image.resize(500, Jimp.AUTO);
      await image.writeAsync(filePath);
      res.json({ message: 'Imagen subida correctamente', fileName: newFileName });
    } catch (error) {
      res.status(500).json({ error: 'Error al subir el archivo' });
    }
  });
  const MAX_FILE_SIZE_MB = 1; // Tamaño máximo permitido en MB
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // Convertir a bytes
  
  routes.post('/subir-imagen-rutinas', async (req, res) => {

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: 'No se ha seleccionado ningún archivo' });
    }
  
    const file = req.files.file;
    const fileSizeBytes = file.size;
  
    if (fileSizeBytes > MAX_FILE_SIZE_BYTES) {
      return res.status(400).json({ error: 'El tamaño de la imagen debe ser menor a 1 MB' });
    }
  
    const fileName = file.name.replace(/\.[^/.]+$/, ""); // Eliminar la extensión del nombre de archivo
    const ext = path.extname(file.name);
    let newFileName = fileName;
    let counter = 1;
  
    // Verificar si el nombre de archivo ya existe
    while (fs.existsSync(`./media/rutinas/portadasrutinas/${newFileName}${ext}`)) {
      newFileName = `${fileName}_${counter}`;
      counter++;
    }
  
    // Mueve el archivo al directorio deseado
    const filePath = `./media/rutinas/portadasrutinas/${newFileName}${ext}`;
  
    try {
      const image = await Jimp.read(file.data);
  
      // Redimensionar manteniendo el aspecto y ajustar la calidad para reducir el tamaño
      const resizedImage = image.resize(Jimp.AUTO, 1024).quality(70);
  
      await resizedImage.writeAsync(filePath);
      res.json({ message: 'Imagen subida correctamente', fileName: newFileName });
    } catch (error) {
      res.status(500).json({ error: 'Error al subir el archivo' + error });
    }
  });
  
  routes.post('/subir-imagen-sesiones', async (req, res) => {

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: 'No se ha seleccionado ningún archivo' });
    }
  
    const file = req.files.file;
    const fileSizeBytes = file.size;
  
    if (fileSizeBytes > MAX_FILE_SIZE_BYTES) {
      return res.status(400).json({ error: 'El tamaño de la imagen debe ser menor a 1 MB' });
    }
  
    const fileName = file.name.replace(/\.[^/.]+$/, ""); // Eliminar la extensión del nombre de archivo
    const ext = path.extname(file.name);
    let newFileName = fileName;
    let counter = 1;
  
    // Verificar si el nombre de archivo ya existe
    while (fs.existsSync(`./media/sesiones/portadassesiones/${newFileName}${ext}`)) {
      newFileName = `${fileName}_${counter}`;
      counter++;
    }
  
    // Mueve el archivo al directorio deseado
    const filePath = `./media/sesiones/portadassesiones/${newFileName}${ext}`;
  
    try {
      const image = await Jimp.read(file.data);
  
      // Redimensionar manteniendo el aspecto y ajustar la calidad para reducir el tamaño
      const resizedImage = image.resize(Jimp.AUTO, 1024).quality(70);
  
      await resizedImage.writeAsync(filePath);
      res.json({ message: 'Imagen subida correctamente', fileName: newFileName });
    } catch (error) {
      res.status(500).json({ error: 'Error al subir el archivo' + error });
    }
  });
  
  routes.post('/copyFiles-portadassesiones', (req, res) => {
    const sourceFileName = req.body.oldnameFile; // Nombre del primer archivo
    const targetFileName = req.body.newnameFile; // Nombre del segundo archivo
    console.log(sourceFileName);
    console.log(targetFileName);
  
    const sourcePath = path.join(__dirname, './media/rutinas/portadasrutinas/', sourceFileName);
    let targetPath = path.join(__dirname, './media/sesiones/portadassesiones/', targetFileName);
  
    // Verificar si el archivo de destino ya existe
    if (fs.existsSync(targetPath)) {
      let suffix = 1;
  
      // Si el archivo de destino ya existe, agregar sufijo numérico
      while (fs.existsSync(targetPath)) {
        const fileNameWithoutExt = targetFileName.slice(0, targetFileName.lastIndexOf('.'));
        const fileExt = targetFileName.slice(targetFileName.lastIndexOf('.'));
  
        const suffixedFileName = `${fileNameWithoutExt}_${suffix}${fileExt}`;
        targetPath = path.join(__dirname, './media/sesiones/portadassesiones/', suffixedFileName);
  
        suffix++;
      }
    }
  
    // Copiar el archivo de origen al destino
    fs.copyFile(sourcePath, targetPath, (err) => {
      if (err) {
        // Ocurrió un error al copiar el archivo
        return res.status(500).json({ error: 'No se pudo copiar el archivo' });
      }
  
      // El archivo se copió exitosamente
      res.json({ message: 'Archivo copiado exitosamente', newFileName: path.basename(targetPath) });
    });
  });
  
  
  
  

  

  // routes.post('/subir-imagen', (req, res) => {
  //   if (!req.files || Object.keys(req.files).length === 0) {
  //     return res.status(400).json({ error: 'No se ha seleccionado ningún archivo' });
  //   }
  
  //   const file = req.files.file;
  //   const fileName = file.name.replace(/\.[^/.]+$/, ""); // Eliminar la extensión del nombre de archivo
  
  //   // Verificar si el nombre de archivo ya existe
  //   const ext = path.extname(file.name);
  //   let newFileName = fileName;
  //   let counter = 1;
  //   while (fs.existsSync(`./multimedia/${newFileName}${ext}`)) {
  //     newFileName = `${fileName}_${counter}`;
  //     counter++;
  //   }
  
  //   // Mueve el archivo al directorio deseado
  //   const filePath = `./multimedia/${newFileName}${ext}`;
    
  //   file.mv(filePath, error => {
  //     if (error) {
  //       return res.status(500).json({ error: 'Error al subir el archivo' });
  //     }
  
  //     res.json({ message: 'Captura subida correctamente', fileName: newFileName });
  //   });
  // });
  
  
module.exports = routes;