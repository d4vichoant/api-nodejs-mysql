const nodemailer = require('nodemailer');
const crypto = require('crypto');

async function enviarCorreo(destinatario, codigo) {
  try {
    // Configurar el servicio de transporte (por ejemplo, usando Gmail)
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'davidalexantambalarrea@gmail.com', // Coloca aquí el correo desde el cual enviarás los mensajes
        pass: 'eqkjuvvfwnphxzlk', // Coloca aquí la contraseña del correo
      },
    });

    // Configurar el contenido del mensaje con formato HTML
    let mensaje = {
      from: 'davidalexantambalarrea@gmail.com', // Coloca aquí el correo desde el cual enviarás los mensajes
      to: destinatario, // El correo del destinatario
      subject: `Código de verificación de HomeFitGo ${codigo}`,
      html: `
        <div style="display: flex; justify-content: center; align-items: flex-start; height: auto; width:100vh;padding: 0% 0% 0% 3%; margin: 0;">
          <div class="container-body" style="display: flex; flex-direction: column; width:100%">
              <div class="up-title" style="color: #6069e8; padding: 0% 0% 0% 2%;">
                  <h1 style="padding: 0; margin: 0; font-size: 1.2rem; font-family: sans-serif; font-weight: 200;">
                  </h1>
              </div>
              <div class="content" style="width: 50%; text-align: center; background: #fafafa; box-shadow: -2px 5px 12px 5px rgba(0, 0, 0, 0.2); border-radius: 5px;">
                  <div>
                      <h1 style="color: #ffffff; background-color: #6069e8; border-radius: 5px 5px 0px 0px; padding: 5% 0% 5% 3%; width: 97%; text-align: start; margin: 0; font-size: 1.2rem; font-family: sans-serif; font-weight: 300;">
                          Código de verificación de Home Fit Go
                      </h1>
                      <p style="color: #292222; font-size: .92rem; font-family: sans-serif; font-weight: 200; text-align: start; padding: 2% 2% 0% 2%; margin: 0% 0% 3% 0%;">
                          Estimado usuario de HomeFitGo:
                      </p>
                      <p style="color: #292222; font-size: .92rem; font-family: sans-serif; font-weight: 200; text-align: start; padding: 2% 2% 0% 2%; margin: 0% 0% 3% 0%;">
                          Hemos recibido una solicitud de código de tu cuenta de HomeFitGo,
                          <span style="color: #6069e8; font-family: monospaces; font-weight: 400; font-size: 1rem;">
                              ${destinatario}
                          </span>,
                          a través de tu dirección de correo electrónico. Tu código de verificación de HomeFitGo es:
                      </p>
                      <strong style="color: #000000; font-family: monospaces; font-weight: 500; font-size: 2.5rem; margin: 3% 0% 3% 0%;">
                          ${codigo}
                      </strong>
                      <p style="color: #292222; font-size: .92rem; font-family: sans-serif; font-weight: 200; text-align: start; padding: 2% 2% 0% 2%; margin: 0% 0% 3% 0%; padding: 4% 0% 0% 2%;">
                          Si no has solicitado este código, puede que alguien esté intentado acceder a la cuenta de Home Fit Go
                          <span style="color: #6069e8; font-family: monospaces; font-weight: 400; font-size: 1rem;">
                              ${destinatario}
                          </span>.
                          No reenvíes este correo electrónico ni des el código a nadie.
                      </p>
                      <p style="color: #292222; font-size: .92rem; font-family: sans-serif; font-weight: 200; text-align: start; padding: 2% 2% 0% 2%; margin: 0% 0% 3% 0%;">
                          Atentamente,
                      </p>
                      <p style="color: #292222; font-size: .92rem; font-family: sans-serif; font-weight: 200; text-align: start; padding: 2% 2% 0% 2%; margin: 0% 0% 3% 0%;">
                          El equipo de Cuentas de HomeFitGo
                      </p>
                  </div>
                  <br/>
                  <p style="color: #292222; font-size: .92rem; font-family: sans-serif; font-weight: 200; text-align: start; padding: 2% 2% 0% 2%; margin: 0% 2% 3% 2%; padding: 3% 0% 2% 0%;">
                      Este correo electrónico no puede recibir respuestas. Para obtener más información, accede al Centro de ayuda de Cuentas de HomeFitGo.
                  </p>
                  <p style="color: #292222; font-size: .92rem; font-family: sans-serif; font-weight: 200; text-align: start; padding: 2% 2% 3% 4%; margin: 0% 2% 3% 2%; padding: 0%;">
                      © D2 Inc., 170101 Sangolqui, Quito, SR 170101, (EC)
                  </p>
              </div>
          </div>
      </div>
      `,
    };

    // Enviar el mensaje
    let info = await transporter.sendMail(mensaje);
    return ('Código enviado');
  } catch (error) {
    return ('Error en enviar el Código');
  }
}

  module.exports = {
    enviarCorreo: enviarCorreo,
  };