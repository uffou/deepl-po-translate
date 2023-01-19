const axios = require('axios')

class DeepL {
    constructor( auth_key, target_lang, free = true ){
        this.auth_key = auth_key
        this.target_lang = target_lang === 'zh-Hans' ? 'zh' : target_lang
        this.api = free ? 'https://api-free.deepl.com/v2/' : 'https://api.deepl.com/v2/'
    }

    translate(text, source_lang = 'en'){
        return new Promise((resolve) => {
            var config = {
                method: 'post',
                url: `${this.api}translate?auth_key=${this.auth_key}&target_lang=${this.target_lang}&source_lang=${source_lang}&tag_handling=xml&split_sentences=nonewlines&ignore_tags=NoTrans&text=${encodeURIComponent(text)}`,
                headers: {
                    "Content-Type": 'application/x-www-form-urlencoded'
                }
            };

            // console.log(config)

            axios(config)
            .then(function (response) {
                // console.table(response.data.text)
                resolve(response.data)
            })
            .catch(function (error) {
                console.log(error);
            });
        })
    }
    usage(){
        var config = {
            method: 'post',
            url: `${this.api}usage?auth_key=${this.auth_key}`,
            headers: { }
          };

          return axios(config)
          .then(function (response) {
            console.log('\n'+ JSON.stringify(response.data));
          })
          .catch(function (error) {
                console.error(error);
          });

    }
}

module.exports = {
    DeepL
}