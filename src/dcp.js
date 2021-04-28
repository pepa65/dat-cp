#! /usr/bin/env node

import program from 'commander'
import send from './send'
import logger from './lib/logger'
import receive from './receive'
import pkgJson from '../package.json'

program.on('-h | --help', function() {
  console.log('Examples:')
  console.log('    Send files/directories:       dcp foo_file bar_directory\n')
  console.log('    Receive files/directories:    dcp <public key from sender>\n')
})

program
  .version(pkgJson.version)
  .usage('[options] {files... | key}')
  .description('Dat Copy v'+pkgJson.version+' - Remote file transfer, powered by the Hypercore protocol')
  .option('-V | --version', 'Output the version number.')
  .option('-n, --dry-run', 'show what would have been transferred.')
  .option('-P, --skip-prompt', 'automatically download without a prompt.')
  .option('-v, --verbose', 'verbose mode: output more information.')
  .parse(process.argv)

if (!process.argv.slice(2).length || !program.args.length) {
  program.outputHelp()
  process.exit(1)
}

if (program.verbose) {
  logger.enableDebug()
}

if (program.args[0].length === 64) {
  receive(program.args[0], program)
} else {
  send(program.args, program)
}

process.on('unhandledRejection', (reason, promise) => {
  console.error({reason, promise})
})
