const inquirer = require('inquirer')
const gettextParser = require("gettext-parser")
const { readFileSync, writeFileSync, existsSync } = require('fs')
const { program } = require('commander')
const { DeepL } = require('./deepl')
const ConsoleProgressBar = require('console-progress-bar')
const noop = () => {}
require('dotenv').config()

function welcome() {
    console.log('Translate your app/site or service .po files? Read this https://github.com/uffou/deepl-po-translate for more info' );
    console.log('------------------');

};

program
  .option('-d, --debug', 'output extra debugging')
  .option('-a, --api <api>', 'free or paid api')
  .option('-k, --auth-key <auth_key>', 'auth_key')
  .option('-f, --po-file-path <po_file_path>', '.po File Path')
  .option('-d, --po-directory-path <po_directory_path>', '.po Folders Path')
  .option('-l, --target-lang <target_lang>', 'Target language')

program.parse(process.argv);

const options = program.opts();
let answers
if (options.debug) console.log(options);
if (options.api) console.log(options.api);
if (options.authKey) console.log(options.authKey);
if (options.targetLang) console.log(options.targetLang);
if (options.poFilePath) console.log(options.poFilePath);
if (options.poDirectoryPath) console.log(options.poDirectoryPath);
const debug = options.debug ? console.log : noop

welcome()
if(options)
inquirer.prompt([
    { type: 'list', message: "Free or paid api?", name:'api',choices:[
        "DeepL Free API (api-free.deepl.com)",
        "DeepL Paid API (api.deepl.com)"
    ]},
    // {
    //     type:'input',
    //     message: 'auth_key',
    //     name: 'authKey',
    // },
    // {
    //     type:'input',
    //     message: 'Source File Path',
    //     name: 'poFilePath',
    // },
    // {
    //     type:'input',
    //     message: 'Target language',
    //     name: 'targetLang',
    // },

]).then(answers => {
    answers = answers

    if(answers) console.log(answers)
    parseAndTranslate()
})

function escapeString(string){
    return string.replace(/{(.*)}/gm, '<NoTrans>$&</NoTrans>')
}
function unescapeString(string){
    return string.replace(/<NoTrans>/gm, '').replace(/<\/NoTrans>/gm, '')

}
async function parseAndTranslate(){
    const cwd = process.cwd()
    const poDirectoryPath = options.poDirectoryPath || (answers && answers.poDirectoryPath)
    
    const targetLang = options.targetLang || process.env.targetLang
    const languages = targetLang.includes(',') ? targetLang.split(",") : [targetLang]
    for(const language of languages){
        const poFilePath = poDirectoryPath
            ? poDirectoryPath + (poDirectoryPath.endsWith("/") ? '' : "/") + language + "/messages.po"
            : options.poFilePath || (answers && answers.poFilePath)
        
        if(!existsSync(poFilePath)) {
            console.log('poFilePath: ', poFilePath)
            throw 'PO file not found!'
        }
        const deepl = new DeepL(options.authKey || process.env.authKey, language)

        var input = readFileSync(poFilePath)
        var po = gettextParser.po.parse(input)
    
        const transObject = po.translations['']
        let keysWithoutTranslation = []
        Object.keys(transObject).forEach(key => {
            //TODO: handle multiline texts
            if(transObject[key].msgstr[0] === '') {
                keysWithoutTranslation.push(key)
                debug('\x1b[33m\x1b[0m',transObject[key].msgstr)
            }
        })
    
        if(keysWithoutTranslation.length === 0) {
            console.log('All strings translated', language.toUpperCase())
            continue
        }

        console.log('Translating:', keysWithoutTranslation.length, ' strings')
    
        function saveFile(){
            const output = gettextParser.po.compile(po)
            writeFileSync(poFilePath, output)
        }
    
        // keysWithoutTranslation = keysWithoutTranslation.slice(0,10) // TESTING
        const bar = new ConsoleProgressBar({ maxValue: keysWithoutTranslation.length })
    
        index = 0
        for(const key of keysWithoutTranslation){
            index += 1
            const sourceString = escapeString(transObject[key].msgid)
            const data = await deepl.translate(sourceString).catch(error => {
                console.error(error)
                deepl.usage()
            })
            // console.log(data)
            // TODO HANDLE ARRAYS
            transObject[key].msgstr[0] = unescapeString(data.translations[0].text)
            debug('\x1b[32m%s\x1b[0m',transObject[key].msgstr[0])
            bar.addValue(1)
            if(index % 20 === 0) {
                saveFile() // saving each 20 api calls just in case
            }
        }
    
        saveFile()
        console.log(`\n${language.toUpperCase()} Translated & Saved...\n`)
        deepl.usage()
    }

   
}