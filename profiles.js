const express = require('express')
const routes = express.Router()
const bcrypt = require('bcrypt');

routes.get('/',(req,res)=>{
    req.getConnection((err,conn)=>{
        if(err) return res.send(err)
        conn.query('SELECT * FROM profiles',(err,rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

routes.get('/frecuenciaejercicio',(req,res)=>{
  req.getConnection((err,conn)=>{
      if(err) return res.send(err)
      conn.query('SELECT * FROM frecuenciaejercicio',(err,rows)=>{
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
      conn.query('SELECT * FROM OBJETIVOSPERSONALES ',(err,rows)=>{
          if(err) return res.send(err)
          res.json(rows)
      })
  })
})

routes.post('/', (req, res) => {
  const profileData = {
    IDGENERO: req.body.gender,
    IDROLUSUARIO: req.body.rolusuario,
    NOMBREPERSONA: req.body.first_name,
    APELLDOPERSONA: req.body.last_name,
    CORREOPERSONA: req.body.mail_profile,
    NICKNAMEPERSONA: req.body.nickname,
    FECHANACIMIENTOPERSONA: req.body.birthday,
    CONTRASENIAPERSONA: req.body.password,
    ESTADOPERSONA: req.body.status,
    USUARIOMODIFICACIONPERSONA: req.body.nickname
  };

  req.getConnection((err, conn) => {
    if (err) return res.send(err);
    conn.query('INSERT INTO persona SET ?', profileData, (err, rows) => {
      if (err) return res.json({message:err });;

      const idPersonl = rows.insertId;

      const usersData = {
        IDPERSONA: idPersonl,
        IDFRECUENCIA: req.body.frecuency,
        IDPROFESION: req.body.profession,
        PESOUSUARIO: req.body.peso,
        ALTURAUSUARIO: req.body.altura,
        NOTIFICACIONUSUARIO: req.body.notification       
      };

      conn.query('INSERT INTO usuario SET ?', usersData, (err, rows) => {
        if (err) return res.json({message:err });
        const idUser = rows.insertId;
        const objetiveString = req.body.objetive;
        const objetiveArray = objetiveString.split(",").map(Number);
        for (let i = 0; i < objetiveArray.length; i++) {
          const objetivospersonalesuser = {
            IDUSUARIO: idUser,
            IDOBJETIVOSPERSONALES: objetiveArray[i]
          };
            conn.query('INSERT INTO objetivospersonalesusuario SET ?', objetivospersonalesuser, (err, rows) => {
            if (err) return res.json({ message: err });
          });
        }
        res.json({ message: 'Usuario Creado Correctamente !'});
      });
    });
  });
});


routes.post('/login', (req, res) => {
  const { nickname, password } = req.body;
  req.getConnection((err, conn) => {
    if (err) return res.send(err);
    conn.query('SELECT * FROM persona WHERE NICKNAMEPERSONA = ?', [nickname], (err, rows) => {
      if (err) return res.send(err);
      if (rows.length > 0) {
        const storedPassword = rows[0].CONTRASENIAPERSONA;
        if (password === storedPassword) {
          res.json({ message: 'Inicio de sesión exitoso' });
        } else {
          res.status(401).json({ message: 'Credenciales inválidas' });
        }
      } else {
        res.status(401).json({ message: 'Credenciales inválidas' });
      }
    });
  });
});

  
routes.get('/check-nickname/:nickname', (req, res) => {
    const nickname = req.params.nickname;
    req.getConnection((err, conn) => {
      if (err) return res.send(err);
      conn.query('SELECT COUNT(*) AS count FROM persona WHERE NICKNAMEPERSONA = ?', [nickname], (err, rows) => {
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
      conn.query('SELECT COUNT(*) AS count FROM persona WHERE CORREOPERSONA = ?', [email], (err, rows) => {
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

routes.put('/:id',(req,res)=>{
    req.getConnection((err,conn)=>{
        if(err) return res.send(err)
        conn.query('UPDATE profiles set ? WHERE id = ?', [req.body,req.params.id], (err,rows)=>{
            if(err) return res.send(err)
            res.send('persona updated!')
        }) 
    })
})

module.exports = routes