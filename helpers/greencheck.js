const axios = require("axios")

const GreenCheck = {

  async runGreenCheck(url) {
    const apiUrl = `http://api.thegreenwebfoundation.org/greencheck/${url}`
    let response = await axios.get(apiUrl)
    return response
  },

  async checkDomains(domains) {
    const greenChecks = await domains.map(async (domain) => {
      if (domain.length > 2) {
        const resp = await this.runGreenCheck(domain)

        return resp
      }
    })

    const greenCheckResults = await Promise.all(greenChecks).then(values => {
      return values.map(val => {
        if (val.data) {
          return val.data
        }
      })
    })

    const greenDomainResults = greenCheckResults.filter(res => { return res.green == true })

    let greenDomainScore
    if (greenDomainResults.length === 0) {
      greenDomainScore = 0
    } else {
      greenDomainScore = greenDomainResults.length / greenCheckResults.length
    }
    return {
      score: greenDomainScore,
      greenChecks: greenCheckResults
    }
  }

}


module.exports = GreenCheck;