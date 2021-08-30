#!/usr/bin/env node

import { resolve } from 'node:path'
import { read, write } from 'to-vfile'
import { globby } from 'globby'
import { Command, Option } from 'commander/esm.mjs'
import { wod } from '../lib/wod.js'

const program = new Command()

program
  .name('wod')
  .description('A Node CLI to aggregate markdown files into one HTML file.')
  .addOption(
    new Option('-d, --dir <path>', 'Path to client folders').default('.', 'cwd')
  )
  .addOption(
    new Option('-c, --client <folder>', 'Specify a client folder').default(
      '*',
      'all'
    )
  )
  .addOption(
    new Option('-f, --files [file...]', 'List markdown files').default(
      ['*.md'],
      'all'
    )
  )
  .addOption(
    new Option('-o, --out <file>', 'Write result to file').default('', 'stdout')
  )
  .helpOption('-h, --help', 'Display help for command')

program.addHelpText(
  'after',
  `
Notes:
  1. '--dir <path>' is relative to current working directory.
  2. '--client <folder>' is relative to '--dir'
  1. '--out <file>' is relative to current working directory.

Examples:
  # Process all files in
  $ wod -d clients

  # Process all files in a client folder
  $ wod -c jon-doe -o ../out/jon.html

  # Process a file for a client
  $ wod -c jon-doe -f 2021.01.01.md -o jon.html

  # Process specific files for all clients
  $ wod -f 2021-01-01.md 2021-01-03.md
`
)

program.parse()

const options = program.opts()
const globs = options.files.map((file) =>
  resolve(options.dir, options.client, file)
)
const files = await globby(globs)
const vfiles = await Promise.all(
  files.map(async (file) => await read(file, 'utf8'))
)
const vfile = await wod(vfiles)

if (options.out) {
  vfile.path = options.out
  await write(vfile)
} else {
  console.log(vfile.toString())
}
