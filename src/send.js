import chalk from 'chalk'
import Dat from './lib/dat'
import DatCp from './lib/dat-cp'
import logger from './lib/logger'
import monitorUpload from './lib/monitor-upload'

export default async function send(paths, options) {
	const dat = await Dat()
	const datCp = new DatCp(dat, options)
	await datCp.upload(paths)
	logger.info('Receive files/directories on another host with:')
	logger.info(chalk.yellow.bold(`  dcp ${datCp.dat.key.toString('hex')}`))
	monitorUpload(datCp.dat)
}
