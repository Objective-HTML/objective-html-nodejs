/*//////////////////////////////
         OBJECTIVE HTML
              Main
//////////////////////////////*/

const Transpiler = require('./core/transpiler'),
      Parser     = require('./core/parser'),
      FS         = require('fs'),
      PATH       = require('path')

const files = []

module.exports = class Objective {
     
     transpile (file) {
          function readFile (file) {
               const content = FS.readFileSync(file, 'UTF-8')
               files.push(file)
               for (const item of new Parser(content).parse()) {
                    if (item.type === 'START' && item.block === 'import') {
                         for (const param of item.params) {
                              if (param.name === 'src') {
                                   readFile(PATH.dirname(file) + '/' + param.value + '.html')
                              }
                         }
                    }
               }
          }
          
          readFile(file)
          
          for (const file of new Transpiler(files.reverse()).transpile()) FS.writeFileSync(file[0].replace('.html', '.js'), file[1])

     }

}