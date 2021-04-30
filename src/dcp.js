#!/usr/bin/env node

import cli from 'commander'
import fs from 'fs'
import send from './send'
import logger from './lib/logger'
import receive from './receive'
import pkgJson from '../package.json'

cli
	.usage('[options] {path... | key}')
	.description('Dat Copy v'+pkgJson.version+' - Remote file transfer with the Dat protocol')
	.helpOption('-h | --help', 'Just show this help text')
	.option('-n | --dry-run', 'Show what would have been transferred')
	.option('-p | --prompt', 'Receive after confirmation prompt')
	.option('-P | --no-prompt', 'Receive without prompt')
	.option('-v | --verbose', 'Verbose mode: show more information')
	.version(pkgJson.version, '-V | --version', 'Just show the program version')
	.on('--help', function() {
		logger.info('\nExamples:')
		logger.info('    Send files/directories:     dcp foo_file bar_directory')
		logger.info('    Receive files/directories:  dcp <public key from sender>')
	})
	.parse(process.argv)

if (!cli.args.length) {
	cli.outputHelp()
	logger.info('\nError: needed either one or more paths, or a key')
	process.exit(1)
}

if (cli.verbose) logger.enableDebug()

// Only receive if 1 arg of 64 chars and either no file or (no-)prompt given
if (cli.args[0].length === 64 && cli.args.length === 1) {
	if (cli.opts().prompt !== undefined || !fs.existsSync(cli.args[0]))
		receive(cli.args[0], cli)
	else send(cli.args, cli)
}
else { // Error if (no-)prompt given but not a single 64-char key
	if (cli.opts().prompt !== undefined) {
		logger.info('Error: (no-)prompt implies receiving, which requires a single 64-character key')
		process.exit(2)
	}
	else send(cli.args, cli)
}
