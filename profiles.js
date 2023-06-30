require('dotenv').config(); 
const express = require('express');
const routes = express.Router();
const fileUpload = require('express-fileupload');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;
const cors = require('cors');
const Jimp = require('jimp');

const fs = require('fs');
const path = require('path');
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
          if(err) return res.json(err)
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

routes.get('/passwordHash/:nickname',(req,res)=>{
  req.getConnection((err,conn)=>{
      if(err) return res.json(err)
      conn.query('SELECT CONTRASENIAPERSONA FROM persona where NICKNAMEPERSONA=? ',[req.params.nickname],(err,rows)=>{
          if(err) return res.json("Usuario No Encontrador")
          res.json(rows)
      })
  })
})

routes.get('/objetivospersonales',(req,res)=>{
  req.getConnection((err,conn)=>{
      if(err) return res.send(err)
      conn.query('SELECT * FROM objetivospersonales ',(err,rows)=>{
          if(err) return res.json(err)
          res.json(rows)
      })
  })
})

routes.get('/bookmarkpersona',(req,res)=>{
  req.getConnection((err,conn)=>{
      if(err) return res.send(err)
      conn.query(`
      SELECT b.IDBOOKMARK, b.IDEJERCICIO, b.IDUSUARIO, u.IDPERSONA
        FROM bookmark AS b
        JOIN usuario AS u ON b.IDUSUARIO = u.IDUSUARIO
        JOIN persona AS p ON u.IDPERSONA = p.IDPERSONA;
      `,(err,rows)=>{
          if(err) return res.json(err)
          res.json(rows)
      })
  })
})

routes.post('/bookmarkpersona', (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err);

    conn.query(
      `SELECT IDUSUARIO FROM usuario WHERE IDPERSONA = ?`,
      [req.body.IDPERSONA],
      (err, rows) => {
        if (err) return res.json(err);
        if (rows.length > 0) {
          const IDUSUARIO = rows[0].IDUSUARIO;
          conn.query(
            `SELECT * FROM bookmark WHERE IDUSUARIO = ? AND IDEJERCICIO = ?`,
            [IDUSUARIO, req.body.IDEJERCICIO],
            (err, rows) => {
              if (err) return res.json(err);
              if (rows.length > 0) {
                if (!req.body.STATUSBOOKMARK) {
                  conn.query(
                    `DELETE FROM bookmark WHERE IDUSUARIO = ? AND IDEJERCICIO = ?`,
                    [IDUSUARIO, req.body.IDEJERCICIO],
                    (err) => {
                      if (err) return res.json(err);
                    }
                  );
                  res.json({ message: 'Book Mark Eliminado' });
                }
              } else {
                if (req.body.STATUSBOOKMARK) {
                  conn.query(
                    `INSERT INTO bookmark (IDUSUARIO, IDEJERCICIO) VALUES (?, ?)`,
                    [IDUSUARIO, req.body.IDEJERCICIO],
                    (err) => {
                      if (err) return res.json(err);
                    }
                  );
                  res.json({ message: 'Book Mark Guardado' });
                }
              }
            }
          );
        } else {
          res.json({ message: 'No se encontró el usuario correspondiente a la persona' });
        }
      }
    );
  });
});


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
  const { nickname} = req.body;
  req.getConnection((err, conn) => {
    if (err) return res.send(err);
    conn.query('SELECT * FROM persona WHERE NICKNAMEPERSONA = ? AND ESTADOPERSONA = true LIMIT 1', [nickname], (err, rows) => {
      if (err) return res.send(err);
      if (rows.length > 0) {
        const rolUsuario = rows[0].IDROLUSUARIO ;
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
        res.status(401).json({ message: 'Invalido Usuario y/o contraseña' });
      }
    });
  });
});


  
routes.get('/check-nickname/:nickname', (req, res) => {
    const nickname = req.params.nickname;
    req.getConnection((err, conn) => {
      if (err) return res.send(err);
      conn.query('SELECT COUNT(*) AS count FROM persona WHERE NICKNAMEPERSONA = ? AND ESTADOPERSONA=1', [nickname], (err, rows) => {
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

  routes.post('/updatePersona',(req,res)=>{
    const persona = {
      IDGENERO: req.body.IDGENERO,
      IDROLUSUARIO: req.body.IDROLUSUARIO,
      NOMBREPERSONA: req.body.NOMBREPERSONA,
      APELLDOPERSONA: req.body.APELLDOPERSONA,
      CORREOPERSONA: req.body.CORREOPERSONA,
      NICKNAMEPERSONA: req.body.NICKNAMEPERSONA,
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
          }); 
      });
  });

routes.post('/updateEntrenante', (req, res) => {
  const persona = {
    IDPROFESION: req.body.IDPROFESION,
    IDFRECUENCIA: req.body.IDFRECUENCIA,
    PESOUSUARIO: req.body.PESOUSUARIO,
    ALTURAUSUARIO: req.body.ALTURAUSUARIO,
    NOTIFICACIONUSUARIO: req.body.NOTIFICACIONUSUARIO,
  };

  req.getConnection((err, conn) => {
    if (err) return res.json(err);

    conn.beginTransaction((err) => {
      if (err) {
        return res.status(500).json({ error: 'Error al iniciar la transacción' + err });
      }

      // Agregar consulta para eliminar registros
      conn.query('DELETE FROM objetivospersonalesusuario WHERE IDUSUARIO = ?', [req.body.IDUSUARIO], (err, rows) => {
        if (err) {
          conn.rollback(() => {
            return res.status(500).json({ error: 'Error al eliminar registros' + err });
          });
        }

        // Realizar la actualización de datos después de eliminar los registros
        conn.query('UPDATE usuario SET ? WHERE IDPERSONA = ? AND IDUSUARIO = ?', [persona, req.body.IDPERSONA, req.body.IDUSUARIO], (err, rows) => {
          if (err) {
            conn.rollback(() => {
              return res.status(500).json({ error: 'Error al actualizar datos' + err });
            });
          }

          if (req.body.OBJETIVOSPERSONALES && req.body.OBJETIVOSPERSONALES.length > 0) {
            const usuarioId = req.body.IDUSUARIO;
            const objetivosInserts = req.body.OBJETIVOSPERSONALES.map(objetivo => {
              return [usuarioId, objetivo];
            });

            conn.query('INSERT INTO objetivospersonalesusuario (IDUSUARIO, IDOBJETIVOSPERSONALES) VALUES ?', [objetivosInserts], (err, result) => {
              if (err) {
                conn.rollback(() => {
                  return res.status(500).json({ error: 'Error al insertar registros en objetivospersonalesusuario' + err });
                });
              }

              conn.commit((err) => {
                if (err) {
                  conn.rollback(() => {
                    return res.status(500).json({ error: 'Error al confirmar la transacción' + err });
                  });
                }

                res.json({ message: '¡Datos actualizados correctamente!' });
              });
            });
          } else {
            // No hay OBJETIVOSPERSONALES proporcionados, continuar con el commit y respuesta
            conn.commit((err) => {
              if (err) {
                conn.rollback(() => {
                  return res.status(500).json({ error: 'Error al confirmar la transacción' + err });
                });
              }

              res.json({ message: '¡Datos actualizados correctamente!' });
            });
          }
        });
      });
    });
  });
});

routes.post('/updateEntrenador', (req, res) => {
  const entrenador = {
    TARIFASENTRENADOR: req.body.TARIFASENTRENADOR,
    EXPERIENCIAENTRENADOR: req.body.EXPERIENCIAENTRENADOR,
    DESCRIPCIONENTRENADOR: req.body.DESCRIPCIONENTRENADOR,
    ACTIVACIONENTRENADOR: req.body.ACTIVACIONENTRENADOR, 
    CERTIFICACIONESENTRENADOR: JSON.stringify(req.body.CERTIFICACIONESENTRENADOR),
  };

  req.getConnection((err, conn) => {
    if (err) return res.json(err);

    conn.beginTransaction((err) => {
      if (err) {
        return res.status(500).json({ error: 'Error al iniciar la transacción' + err });
      }

      // Agregar consulta para eliminar registros
      conn.query('DELETE FROM  especialidadentrenadorentrenador WHERE IDENTRENADOR  = ?', [req.body.IDENTRENADOR], (err, rows) => {
        if (err) {
          conn.rollback(() => {
            return res.status(500).json({ error: 'Error al eliminar registros' + err });
          });
        }

        // Realizar la actualización de datos después de eliminar los registros
        conn.query('UPDATE entrenador SET ? WHERE IDPERSONA = ? AND IDENTRENADOR = ?', [entrenador, req.body.IDPERSONA, req.body.IDENTRENADOR], (err, rows) => {
          if (err) {
            conn.rollback(() => {
              return res.status(500).json({ error: 'Error al actualizar datos' + err });
            });
          }

          if (req.body.idespecialidadentrenador && req.body.idespecialidadentrenador.length > 0) {
            const entrenadorId = req.body.IDENTRENADOR;
            const objetivosInserts = req.body.idespecialidadentrenador.map(especialidad => {
              return [entrenadorId, especialidad];
            });

            conn.query('INSERT INTO especialidadentrenadorentrenador (IDENTRENADOR, idespecialidadentrenador) VALUES ?', [objetivosInserts], (err, result) => {
              if (err) {
                conn.rollback(() => {
                  return res.status(500).json({ error: 'Error al insertar registros en Especialidad' + err });
                });
              }

              conn.commit((err) => {
                if (err) {
                  conn.rollback(() => {
                    return res.status(500).json({ error: 'Error al confirmar la transacción' + err });
                  });
                }

                res.json({ message: '¡Datos actualizados correctamente!' });
              });
            });
          } else {
            // No hay OBJETIVOSPERSONALES proporcionados, continuar con el commit y respuesta
            conn.commit((err) => {
              if (err) {
                conn.rollback(() => {
                  return res.status(500).json({ error: 'Error al confirmar la transacción' + err });
                });
              }

              res.json({ message: '¡Datos actualizados correctamente!' });
            });
          }
        });
      });
    });
  });
});

const MAX_FILE_SIZE_MB = 2; // Tamaño máximo permitido en MB
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // Convertir a bytes
const TARGET_WIDTH = 100; // Ancho deseado en píxeles

routes.post('/subir-imagen-perfile', async (req, res) => {
  //console.log("hola");
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
  while (fs.existsSync(`./media/perfile/${newFileName}${ext}`)) {
    newFileName = `${fileName}_${counter}`;
    counter++;
  }

  // Mueve el archivo al directorio deseado
  const filePath = `./media/perfile/${newFileName}${ext}`;

  try {
    const image = await Jimp.read(file.data);

    // Redimensionar manteniendo el aspecto y ajustar la calidad para reducir el tamaño
    const resizedImage = image.resize(TARGET_WIDTH, Jimp.AUTO).quality(70);

    await resizedImage.writeAsync(filePath);
    res.json({ message: 'Imagen subida correctamente', fileName: newFileName });
  } catch (error) {
    res.status(500).json({ error: 'Error al subir el archivo' + error });
  }
});




routes.post('/uploadImagenPerfileText/', (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.json(err);
    conn.query('UPDATE persona SET IMAGEPERSONA = ? WHERE IDPERSONA = ?', [req.body.IMAGEPERSONA,req.body.IDPERSONA.IDPERSONA], (err,rows)=>{
      if(err) return res.json(err)
      res.json({ message: 'La foto de Perfil ha sido actualizado.' });
  }) 
  });
});


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


routes.post('/:nickname', (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err);
    conn.query('SELECT `IDPERSONA`, `IDGENERO`, `IDROLUSUARIO`, `NOMBREPERSONA`, `APELLDOPERSONA`, `CORREOPERSONA`, `NICKNAMEPERSONA`, `IMAGEPERSONA`,`FECHANACIMIENTOPERSONA` FROM `persona` WHERE NICKNAMEPERSONA = ? AND ESTADOPERSONA = true LIMIT 1', [req.params.nickname], (err, rows) => {
      if (err) return res.json(err);
      res.json(rows);
    });
  });
});


module.exports = routes