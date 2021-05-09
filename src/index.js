const inquirer = require('inquirer')
const gettextParser = require("gettext-parser")
const { writeFileSync } = require('fs')

inquirer.prompt([
    { type: 'list', message: "Free or paid api?", name:'api',choices:[
        "DeepL Free API (api-free.deepl.com)",
        "DeepL Paid API (api.deepl.com)"
    ]},
    {
        type:'input',
        message: 'auth_key',
        name: 'auth_key',
    },
    {
        type:'input',
        message: 'Target language',
        name: 'target_lang',
    },

]).then(answers => {
    console.log(answers)
    
    const cwd = process.cwd()
    console.log(cwd)
    writeFileSync(cwd + '/' + answers.target_lang + '.po', 'test')
})