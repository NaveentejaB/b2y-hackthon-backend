const nodemailer = require('nodemailer')

const mailSender = async (email, title, body)=>{
    try {
        console.log(11);
        //to send email ->  firstly create a Transporter
        let transporter = nodemailer.createTransport({
            service : process.env.MAIL_HOST,
            // host:process.env.MAIL_HOST,  //-> Host SMTP detail
                auth:{
                    user: process.env.MAIL_USER,  //-> User's mail for authentication
                    pass: process.env.MAIL_PASS,  //-> User's password for authentication
                }
        }) 
        //now Send e-mails to users
        let info = await transporter.sendMail({
            from: 'naveentejasd@gmail.com',
            to:`${email}`,
                subject: `${title}`,
                html: `${body}`,
            // to:'naveenteja1912@gmail.com',
            //     subject:'test',
            //     text:'hellloo'
        })
        // console.log(info);
        console.log("Info is here: ",info)
        return info

    } catch (error) {
        console.log(error.message);
    }
}

module.exports = mailSender;