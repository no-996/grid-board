// const colors = require('colors')
const portfinder = require('portfinder')

// colors.setTheme({
//   root: 'blue',
//   error: 'red',
//   ignored: 'magenta',
//   format: 'cyan',
//   pass: 'yellow',
//   changed: 'green',
// })
const exec = require('child_process').exec

const start = async () => {
  portfinder.basePort = 80

  const serverPort = await portfinder.getPortPromise()

  var devProcess = exec(
    `${__dirname.replace(/\\/g, '/')}/node_modules/.bin/webpack-dev-server --config ${__dirname.replace(
      /\\/g,
      '/'
    )}/webpack.config.js --hot --host 0.0.0.0 --port ${serverPort}`
  )
  devProcess.stdout.pipe(process.stdout)
}

start()

return
