require('dotenv').config(); 
const express = require('express');
const routes = express.Router();
const fileUpload = require('express-fileupload');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;
const cors = require('cors');
// Middlewares
routes.use(cors());
routes.use(fileUpload());

routes.get('/', (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err);

    conn.query('SELECT IDPERSONA, IDGENERO, IDROLUSUARIO, NOMBREPERSONA, APELLDOPERSONA, CORREOPERSONA, NICKNAMEPERSONA, FECHANACIMIENTOPERSONA, FECHACREACIONPERSONA, FECHAMODIFICACIONPERSONA, USUARIOCREACIONPERSONA, USUARIOMODIFICACIONPERSONA, ESTADOPERSONA FROM persona ORDER BY NOMBREPERSONA', (err, rows) => {
      if (err) return res.send(err);

      res.json(rows);
    });
  });
});

routes.get('/frecuenciaejercicio',(req,res)=>{
  req.getConnection((err,conn)=>{
      if(err) return res.send(err)
      conn.query('SELECT * FROM frecuenciaejercicio',(err,rows)=>{
          if(err) return res.send(err)
          res.json(rows)
      })
  })
})
routes.get('/profesion',(req,res)=>{
  req.getConnection((err,conn)=>{
      if(err) return res.send(err)
      conn.query('SELECT * FROM  profesion',(err,rows)=>{
          if(err) return res.send(err)
          res.json(rows)
      })
  })
})
routes.get('/rolUsers',(req,res)=>{
  req.getConnection((err,conn)=>{
      if(err) return res.send(err)
      conn.query('SELECT * FROM rolusuario',(err,rows)=>{
          if(err) return res.send(err)
          res.json(rows)
      })
  })
})

routes.get('/genero',(req,res)=>{
  req.getConnection((err,conn)=>{
      if(err) return res.send(err)
      conn.query('SELECT * FROM genero',(err,rows)=>{
          if(err) return res.send(err)
          res.json(rows)
      })
  })
})

routes.get('/especialidadentrenador',(req,res)=>{
  req.getConnection((err,conn)=>{
      if(err) return res.send(err)
      conn.query('SELECT * FROM especialidadentrenador ',(err,rows)=>{
          if(err) return res.send(err)
          res.json(rows)
      })
  })
})

routes.get('/objetivospersonales',(req,res)=>{
  req.getConnection((err,conn)=>{
      if(err) return res.send(err)
      conn.query('SELECT * FROM objetivospersonales ',(err,rows)=>{
          if(err) return res.send(err)
          res.json(rows)
      })
  })
})
routes.post('/guardarDatos', (req, res) => {

  // Iniciar la transacción
  req.getConnection((err, conn) => {
    if (err) {
      return res.send(err);
    }

    conn.beginTransaction((err) => {
      if (err) {
        return res.send(err);
      }

      // Guardar en la tabla "persona"
      const persona = {
        IDGENERO: req.body.gender,
        IDROLUSUARIO: req.body.rolusuario,
        NOMBREPERSONA: req.body.first_name,
        APELLDOPERSONA: req.body.last_name,
        CORREOPERSONA: req.body.mail_profile,
        NICKNAMEPERSONA: req.body.nickname,
        FECHANACIMIENTOPERSONA: req.body.birthday,
        CONTRASENIAPERSONA: req.body.password,
        ESTADOPERSONA: req.body.status,
        USUARIOCREACIONPERSONA: req.body.nickname
      };

      conn.query('INSERT INTO persona SET ?', persona, (err, result) => {
        if (err) {
          conn.rollback(() => {
            throw err;
          });
        }

        const personaId = result.insertId;

        // Guardar en la tabla "usuario"
        const usuario = {
          IDPERSONA: personaId,
          IDFRECUENCIA: req.body.frecuency,
          IDPROFESION: req.body.profession,
          PESOUSUARIO: req.body.peso,
          ALTURAUSUARIO: req.body.altura,
          NOTIFICACIONUSUARIO: req.body.notification    
        };

        conn.query('INSERT INTO usuario SET ?', usuario, (err, result) => {
          if (err) {
            conn.rollback(() => {
              throw err;
            });
          }

          const usuarioId = result.insertId;

          // Guardar en la tabla "objetivospersonalesusuario"
          const objetivosInserts = req.body.objetive.split(',').map(item => {
            return [usuarioId, parseInt(item.trim())];
          });
 
          conn.query('INSERT INTO objetivospersonalesusuario (IDUSUARIO, IDOBJETIVOSPERSONALES) VALUES ?', [objetivosInserts], (err, result) => {
            if (err) {
              conn.rollback(() => {
                throw err;
              });
            }

            // Confirmar la transacción
            conn.commit((err) => {
              if (err) {
                conn.rollback(() => {
                  throw err;
                });
              }
              res.json({ message: 'Usuario Creado Correctamente !'});
            });
          });

        });
      });
    });
  });
}); 


routes.post('/guardarDatosEntrenador', (req, res) => {
  const datos = req.body;

  // Iniciar la transacción
  req.getConnection((err, conn) => {
    if (err) {
      return res.send(err);
    }

    conn.beginTransaction((err) => {
      if (err) {
        return res.send(err);
      }

      // Guardar en la tabla "persona"
      const persona = {
        IDGENERO: req.body.gender,
        IDROLUSUARIO: req.body.rolusuario,
        NOMBREPERSONA: req.body.first_name,
        APELLDOPERSONA: req.body.last_name,
        CORREOPERSONA: req.body.mail_profile,
        NICKNAMEPERSONA: req.body.nickname,
        FECHANACIMIENTOPERSONA: req.body.birthday,
        CONTRASENIAPERSONA: req.body.password,
        ESTADOPERSONA: req.body.status,
        USUARIOCREACIONPERSONA: req.body.nickname
      };

      conn.query('INSERT INTO persona SET ?', persona, (err, result) => {
        if (err) {
          conn.rollback(() => {
            throw err;
          });
        }

        const personaId = result.insertId;

        // Guardar en la tabla "usuario"
        const entrenador = {
          IDPERSONA: personaId,
          EXPERIENCIAENTRENADOR: req.body.experiencia,
          DESCRIPCIONENTRENADOR: req.body.about,
          TARIFASENTRENADOR: req.body.tarifa,
          ACTIVACIONENTRENADOR: req.body.activacion,
          CERTIFICACIONESENTRENADOR: JSON.stringify(req.body.certificacion)  
        };

        conn.query('INSERT INTO entrenador SET ?', entrenador, (err, result) => {
          if (err) {
            conn.rollback(() => {
              throw err;
            });
          }

          const usuarioId = result.insertId;

          // Guardar en la tabla "objetivospersonalesusuario"

          const idespecialidadentrenadorArray = req.body.specialty.map(item => {
            return [usuarioId,parseInt(item.idespecialidadentrenador)];
            });


          conn.query('INSERT INTO  especialidadentrenadorentrenador (	IDENTRENADOR, idespecialidadentrenador) VALUES ?', [idespecialidadentrenadorArray], (err, result) => {
            if (err) {
              conn.rollback(() => {
                throw err;
              });
            }

            // Confirmar la transacción
            conn.commit((err) => {
              if (err) {
                conn.rollback(() => {
                  throw err;
                });
              } 
              res.json({ message: 'Entrenador Creado Correctamente !'});
            });
          });
        });
      });
    });
  });
});

routes.post('/login', (req, res) => {
  const { nickname, password } = req.body;
  req.getConnection((err, conn) => {
    if (err) return res.send(err);
    conn.query('SELECT * FROM persona WHERE NICKNAMEPERSONA = ? AND ESTADOPERSONA = true LIMIT 1;', [nickname], (err, rows) => {
      if (err) return res.send(err);
      if (rows.length > 0) {
        const storedPassword = rows[0].CONTRASENIAPERSONA;
        const rolUsuario = rows[0].IDROLUSUARIO ;
        if (password === storedPassword) {
          if (rolUsuario === 2) {
            const query = 'SELECT * FROM entrenador en, persona per WHERE en.IDPERSONA = per.IDPERSONA AND en.ACTIVACIONENTRENADOR = true AND per.NICKNAMEPERSONA = ? LIMIT 1;';
            conn.query(query, [nickname], (err, entrenadorRows) => {
              if (err) return res.send(err);
              const token = jwt.sign({ nickname }, secretKey);
              if (entrenadorRows.length > 0) {
                res.json({ message: 'access trainer',token ,nickname,rolUsuario});
               }else{
                res.json({ message: 'trainer not activated',token ,nickname ,rolUsuario});
               }
            });
          } else  {
            const token = jwt.sign({ nickname }, secretKey);
            if(rolUsuario === 99){
              res.json({ message: 'all access',token ,nickname,rolUsuario });
            }else{
              res.json({ message: 'access user',token ,nickname,rolUsuario });
            }
          }
        } else {
          res.status(401).json({ message: 'Credenciales Invalidas' });
        }
      } else {
        res.status(401).json({ message: 'Invalido Usuario y/o contraseña' });
      }
    });
  });
});


  
routes.get('/check-nickname/:nickname', (req, res) => {
    const nickname = req.params.nickname;
    req.getConnection((err, conn) => {
      if (err) return res.send(err);
      conn.query('SELECT COUNT(*) AS count FROM persona WHERE NICKNAMEPERSONA = ? AND ESTADOPERSONA=true', [nickname], (err, rows) => {
        if (err) return res.send(err);
        const count = rows[0].count;
        const isNicknameAvailable = count === 0;
        res.json({ available: isNicknameAvailable });
      });
    });
  });

routes.get('/check-mail/:email', (req, res) => {
    const email = req.params.email;
    req.getConnection((err, conn) => {
      if (err) return res.send(err);
      conn.query('SELECT COUNT(*) AS count FROM persona WHERE CORREOPERSONA = ? AND ESTADOPERSONA=true', [email], (err, rows) => {
        if (err) return res.send(err);
        const count = rows[0].count;
        const isMailAvailable = count === 0;
        res.json({ available: isMailAvailable });
      });
    });
  });
  
routes.delete('/:id',(req,res)=>{
    req.getConnection((err,conn)=>{
        if(err) return res.send(err)
        conn.query('DELETE FROM  profiles WHERE id = ?', [req.params.id], (err,rows)=>{
            if(err) return res.send(err)
            res.send('persona excluded!')
        }) 
    })
})

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

routes.post('/updateEntrenante',(req,res)=>{
  const persona = {
    IDPROFESION : req.body.IDPROFESION ,
    IDFRECUENCIA : req.body.IDFRECUENCIA ,
    PESOUSUARIO: req.body.PESOUSUARIO,
    ALTURAUSUARIO: req.body.ALTURAUSUARIO,
    NOTIFICACIONUSUARIO: req.body.NOTIFICACIONUSUARIO,
  };
    req.getConnection((err,conn)=>{
        if(err) return res.json(err)
        conn.query('UPDATE usuario SET ? WHERE IDPERSONA = ? AND IDUSUARIO = ? ', [persona,req.body.IDPERSONA,req.body.IDUSUARIO], (err,rows)=>{
          if (err) {
            return res.status(500).json({ error: 'Error al actualizar Datos'+err });
          }
            res.json({ message: 'Actualizado Datos Correctamente !'});
        }) 
    })
})

routes.post('/subir-archivo', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ error: 'No se ha seleccionado ningún archivo' });
  }

  const file = req.files.file;

  // Mueve el archivo al directorio deseado
  const filePath = './documentos/entrenadores/' + file.name+'.pdf';
  file.mv(filePath, error => {
    if (error) {
      return res.status(500).json({ error: 'Error al subir el archivo' });
    }

    res.json({ message: 'Archivo subido correctamente', filePath });
  });
});

module.exports = routes