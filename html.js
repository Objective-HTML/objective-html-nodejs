/*//////////////////////////////
         OBJECTIVE HTML
              Main
//////////////////////////////*/

const Transpiler = require('./core/transpiler')
const File       = require('./core/file')
const FS         = require('fs')

module.exports = class Objective {

     constructor (input) {

          this.input = input

     }
 
     transpile () {
          return new Promise ((resolve, reject) => {
               FS.stat(this.input, (error, status) => {
                    if (error) throw error
                    if (status.isDirectory()) {
                         const code = new Map()
                         new File(this.input).filewalker((error, files) => {
                              if (error) throw error 
                              for (const i of files) {
                                   if (i.endsWith('.html')) {
                                        FS.readFile(i, 'UTF-8', (error, content) => {
                                             if (error) throw error
                                             code.set(i, new Transpiler(content).transpile())
                                             if (code.size === files.length) {
                                                  resolve(code)
                                             }
                                        })
                                   }
                              }
                         })
                    } else {
                         FS.readFile(this.input, 'UTF-8', (error, content) => {
                              if (error) throw error
                              resolve(new Transpiler(content).transpile())
                         })
                    }
               })

          })

     }

}
