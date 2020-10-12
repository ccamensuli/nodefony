/**
 *  OVERRIDE MAIL Bundle
 *
 *   @see FRAMEWORK MAIL config for more options
 *     https://nodemailer.com
 *
 *   @examples :   gmail
 *    https://myaccount.google.com/security
 *
 *    nodemailer :{
 *      default : "gmail",
 *      transporters :{
 *        gmail : {
 *          host: "smtp.gmail.com",
 *          port: 465,
 *          secure: true, // true for 465, false for other ports
 *          auth: {
 *            user: "user@gmail.com",
 *            pass: "xxxxxxxxx"
 *          },
 *          tls: {
 *            // do not fail on invalid certs
 *            rejectUnauthorized: false
 *          }
 *        }
 *      }
 *    }
 */
module.exports = {
  nodemailer: {
    default: "free",
    transporters: {
      /*free: {
        host: "smtp.free.fr",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: "", // generated  user
          pass: "" // generated  password
        }
      }*/
    }
  }
};