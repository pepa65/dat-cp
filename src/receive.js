import Dat from './lib/dat'
import DatCp from './lib/dat-cp'

export default async function receive(key, options) {
	const dat = await Dat({key, sparse: true})
	if (options.prompt) {
		const datCpDryRun = new DatCp(dat, {...options, dryRun: true})
		await datCpDryRun.download()
		if (options.dryRun || datCpDryRun.files === 0) {
			datCpDryRun.printTotal()
			process.exit()
		}
		const proceed = await datCpDryRun.downloadPrompt()
		if (!proceed) process.exit()
	}
	const datCpDownload = new DatCp(dat, {...options})
	await datCpDownload.download()
	if (!options.prompt || datCpDownload.files > 20) datCpDownload.printTotal()
	process.exit()
}
