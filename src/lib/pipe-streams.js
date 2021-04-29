import cliProgress from 'cli-progress'
import chalk from 'chalk'
import {formatSize, getUnit, getUnitLabel} from './format-size'
import logger from './logger'

export default function pipeStreams(readStream, writeStream, filesize, label) {
	return new Promise(async (resolve) => {
		const unit = getUnit(filesize)
		const unitLabel = getUnitLabel(unit)
		const labelWidth = (process.stdout.columns / 3).toFixed()
		label = label.substr(0, labelWidth).padEnd(labelWidth, ' ')
		const progress = new cliProgress.Bar({
			format: `${label} [${chalk.green('{bar}')}] {percentage}% | {duration_formatted} | {transfer}{unitLabel}`,
		}, cliProgress.Presets.legacy)

		progress.start(filesize, 0, {
			transfer: `${formatSize(0, {unit})} / ${formatSize(filesize, {unit})}`,
			unitLabel
		})

		readStream.on('data', function(buffer) {
			progress.increment(buffer.length, {
				transfer: `${formatSize(progress.value, {unit})}/${formatSize(filesize, {unit})}`,
			})
		})

		readStream.on('error', (err) => {
			progress.stop()
			logger.error(err.toString())
			logger.error('Failed to read file.')
			process.exit(1)
		})

		readStream.pipe(writeStream)

		writeStream.on('finish', () => {
			progress.update(filesize, {
				transfer: formatSize(filesize, {unit}),
			})
			progress.stop()
			resolve()
		})

		writeStream.on('error', (err) => {
			progress.stop()
			logger.error(err.toString())
			logger.error('Failed to write file to archive.')
			process.exit(1)
		})
	})
}
