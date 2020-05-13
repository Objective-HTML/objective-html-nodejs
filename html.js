/*//////////////////////////////
         OBJECTIVE HTML
              Main
//////////////////////////////*/

const Transpiler = require('./core/transpiler')
const FS         = require('fs')
const Parser     = require('./core/parser')
const path       = require('path')

module.exports = class Objective {

     constructor (input) {

          this.input = input

     }
 
     transpile () {
          
          const test = []

          function readFile (file) {
               const content = FS.readFileSync(path.resolve(path.join(__dirname, file)), 'UTF-8')
               test.push(file)
               for (const item of new Parser(content).parse()) {
                    if (item.type.endsWith('_START') && item.block === 'import') {
                         for (const param of item.parameters) {
                              if (param.name === 'src') {
                                   readFile(path.dirname(file) + '/' + param.value + '.html')
                              }
                         }
                    }
               }
          }

          readFile(this.input)

          const files = new Transpiler(test.reverse()).transpile()

          for (const file of files) {
               FS.writeFileSync(path.resolve(path.join(file[0].replace('.html', '.js'))), file[1])
          }


     }

}
