#! /usr/bin/env node

import program from 'commander'
import send from './send'
import logger from './lib/logger'
import receive from './receive'
import pkgJson from '../package.json'

program.on('--help', function() {
  console.log('\nExamples:')
  console.log('\n    Send files/directories:  dcp foo_file bar_directory\n')
  console.log('\n    Receive files/directories:  dcp <public key from sender>\n')
})

program
  .version(pkgJson.version)
  .usage('[options] {files... | key}')
  .description('dcp - Remote file copy, powered by the Dat protocol.')
  .option('-n | --dry-run', 'Show what would have been transferred')
  .option('-P | --skip-prompt', 'Automatically download without a prompt')
  .option('-v | --verbose', 'Verbose mode: output more information')
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
