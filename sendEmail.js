var nodeMailer = require('nodemailer');
var cons = require('consolidate');

module.exports.sendInviteMail = function (email_data, callback) {
    
    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'hktech6@gmail.com',
            pass: 'kumarmohit'
        }
    });

    cons.swig('templates/invite.html', {}, function (err, html) {
        if (err) {
            throw err;
        } else {
            let mailOptions = {
                from: '"RKCL Admin" <hktech6@gmail.com>', // sender address
                to: email_data.email, // list of receivers
                subject: 'Test Email for Rkcl', // Subject line
                text: "This is test email", // plain text body
                html: html // html body
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                response = {'status':1, 'message':'Message sent'};
                callback(response);
                return;

            });
        }
    });




}