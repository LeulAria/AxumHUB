const express = require('express')
const router = express.Router();
const passport = require('passport')
const transporter = require('../../utils/node_mailer')

router.post('/sendJoinRequest', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { sender, destination, projectname } = req.body;

  console.log('This is it wohoo: ', req.body)
  console.log('The Project name is: ', projectname)

  const mailOptions = {
    from: 'AxumHUB axumhub@gmail.com',
    to: destination,
    subject: `sender Sent you project join request`,
    html: `
      <div style="width: 80%; margin: 10px auto; color: #fff; background: #121212; text-align: center; font-family: Roboto;border-radius: 10px;padding:2em;">
        <img src="https://vignette.wikia.nocookie.net/totalwar/images/9/9d/Aksum_Faction_Card.png/revision/latest?cb=20151209062036" style="width:200px;height:200px;margin: 10px auto;" />
        <h1 style="color: #fff;">AxumHUB</h1>
        <br>
        <p style="color: #fff;">axum hub is an online community communication and colaboation platform.</p>
        <p>${sender} sent a project join request</p>
        <a href="https://axumhubio.netlify.app" style="background: #56B;color:#fff;text-decoration:none;font-size: 1.1em;padding: 10px 1em;margin:1em auto;border-radius:5px;box-shadow: 0 2px 10px rgba(0,0,0,0.8)">Login/Signup in to Axumhub</a>

        <p  style="color: #fff;">after loggin in try to search <b style="margin: 0 10px;text-decoration: underline;">${projectname}</b> in the projects app and click the join request icon.</p>
        <br>
        <p style="width: 300px; margin: 10px auto; border-radius: 15px; background: #fff; color: #333; padding: 5px 1em;">Thanks for using our service!</p>
      </div>
    `
  }

  return transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.json({ error: error.toString() })
    }
    res.json({ success: 'Email Sent!' });
  })
})

module.exports = router

// 0919787878