var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '####.####.####.####',
        pass: '####.####.####.####'
    }
});

module.exports = function(to, subject, body){
    var mailOptions = {
        from: '####.####.####.#### <####.####.####.####>',
        to: to,
        subject: subject,
        html: body
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        else{
          return;
        }
    });
};
