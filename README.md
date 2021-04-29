# `dcp' - Dat Copy v0.8.1

> Remote file transfer, powered by the Hypercore protocol.

[![CircleCI branch](https://img.shields.io/circleci/project/github/pepa65/datcp/master.svg)](https://circleci.com/gh/pepa65/workflows/datcp/tree/master)
[![npm](https://img.shields.io/npm/v/@pepa65/datcp.svg)](https://www.npmjs.com/package/@pepa65/datcp)
[![npm](https://img.shields.io/node/v/@pepa65/datcp.svg)](https://www.npmjs.com/package/@pepa65/datcp)
[![NpmLicense](https://img.shields.io/npm/l/@pepa65/datcp.svg)](https://www.npmjs.com/package/@pepa65/datcp)

`dcp` copies files between hosts on a network using the peer-to-peer [Dat network](https://datproject.org/). `dcp` can be seen as an alternative to tools like `scp`, removing the need to configure SSH access between hosts. This lets you transfer files between two remote hosts, without you needing to worry about the specifics of how said hosts reach each other and regardless of whether hosts are behind NATs.

`dcp` requires zero configuration and is secure, [fast](#Performance), and peer-to-peer.

**WARNING - this is not production-ready software. Use at your own risk**

### Contents

- [How dcp works](#how-dcp-works)
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)

### Use cases

* Send files to multiple colleagues - just send the generated public key via chat and they can receive the files on their machine.
* Sync files between two physical computers on your local network, without needing to set up SSH access.
* Easily send files to a friend without needing to create a zip and upload it the cloud.
* Transfer files to a remote server when you have shell access but not SSH, for example on a kubernetes pod.
* Share files between Linux/macOS and Windows, which isn't exactly known for great SSH support.

## How `dcp` works

`dcp` will create a Dat archive for a specified set of files or directories and, using the generated public key, lets you download said archive from other hosts. Any data shared over the network is encrypted using the public key of the archive, meaning data access is limited to those who have access to said key. For more information on how Dat works, you can browse [the docs](https://docs.datproject.org/) or [read their whitepaper](https://github.com/datproject/docs/blob/master/papers/dat-paper.pdf).

### Advantages over plain [dat](https://github.com/datproject/dat)

`dcp` is designed to have an API that is more reminiscent of `scp` and `rsync`. The standard cli `dat` program requires the additional mental overhead of understanding how the underlying Dat protocol works. `dat` forces you to share a single whole folder, whilst with `dcp` you can transfer an arbitrary set of paths. `dat` also pollutes the filesystem with metadata files, whereas with `dcp` these are kept in-memory instead.

### Performance

You can expect `dcp` to transfer at a similar speed to both `rsync` and `scp`.

Here's a benchmark for moving a 396.12MB file from my personal computer to a remote server over my 50mpbs connection.

| Method | Time  |
|--------|-------|
| rsync  | 1m07s |
| scp    | 1m07s |
| dcp    | 1m10s |

## Installation

```
npm i -g @pepa65/datcp
```

### Installing without npm

Alternatively, packaged binaries are available on [the releases page](https://github.com/pepa65/datcp/releases). These bundle all dependencies into a single standalone binary.

Simply extract the zip and move the `dcp[.exe]` binary to a folder in your path, e.g. `/usr/local/bin`.

## Usage

```
Usage: dcp [options] {path... | key}

Dat Copy v0.8.1 - Remote file transfer, powered by the Hypercore protocol

Options:
  -n | --dry-run    Show what would have been transferred
  -p | --prompt     Download after being prompted
  -P | --no-prompt  Automatically download without prompting
  -v | --verbose    Verbose mode: show more information
  -V | --version    Just show the program version
  -h | --help       Just show this help text

Examples:
    Send files/directories:     dcp foo_file bar_directory
    Receive files/directories:  dcp <public key from sender>
```

### Sending files

Pass an arbitrary set of files or directories to `dcp` to be transferred. Copy the generated public key and use it to receive the files on a different host.

```bash
dcp [-n] [-v] files ...
```

* Use `-n`/`--dry-run` to see what files would have been sent
* Use `-v`/`--verbose` to output more information

### Receiving files

Invoke `dcp` with the generated public key to receive the copied files.

```bash
dcp [-n] [-v] [-P|-p] <generated public key>
```

* Use `-n`/`--dry-run` to see what files would have been received
* Use `-v`/`--verbose` to output more information
* Use `-P`/`--no-prompt` to skip the download prompt, or `-p`/`--prompt` to get it (default)

## Development

Install dependencies:

```
npm i
```

Run the tests:

```
npm t
```

Test the CLI executable

```
npm run cli -- foo.txt -v
```

*Note the `--` preceding the arguments.*
