const axios = require('axios')
const crypto = require('crypto')

function passwordHash(password) {
	const buffer = new TextEncoder().encode(password)
	const hash = crypto
		.createHash('sha1')
		.update(buffer)
		.digest('hex')
		.toLocaleUpperCase()
	const prefix = hash.substring(0, 5)
	const suffix = hash.substring(5)
	return { prefix, suffix }
}

const passwordPWNED = async (password) => {
	const { prefix, suffix } = passwordHash(password)
    try{
        const res = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`)
        const results = {}
    
        for (const line of res.data.split(/\r?\n/)) {
            let [line_suffix, times] = line.split(':')
            results[line_suffix] = parseInt(times)
        }
    
        return suffix in results ? results[suffix] : 0

    }catch(err){
        return err
    }

}

module.exports = passwordPWNED;