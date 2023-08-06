# envan

envan helps you sync env files from AWS SSM. Allows you to share your environment variables in a simple way when you have a team.

- [Features](#features)
- [Installation](#installation)
- [Prerequisites](#prerequisites)
- [Usage](#usage)
  - [Usage as CLI](#usage-as-cli)
  - [Usage as package](#usage-as-package)
  - [CI/CD](#cicd)
- [Contributing](#contributing)
- [License](#license)

## Features

- Store and sync environment variables from AWS SSM Parameter Store.
- Works with mono repo. (Currently, it only supports pnpm package managers for mono repo)
- Works with CI/CD pipelines.
- Works with AWS profiles.
- Works with workspace mode.
- Generate .env.example files.

## Installation

```bash
npm i envan
```

```bash
yarn add envan
```

```bash
pnpm add envan
```

You can always run commands as cli tool or a npm or npx script inside a project. Add `-g` if you want to use envan globally.

## Prerequisites

- AWS credentials configured
  - Using [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)
  - Or setup environment variables
    - AWS_ACCESS_KEY_ID
    - AWS_SECRET_ACCESS_KEY
    - AWS_REGION
- AWS SSM Parameters created
- AWS SSM Parameters must be in the following format:
  ```
  /<environment>/<service>/<key>
  ```
- Add fields in package.json

Example:

```json
{
  "envan": {
    "ssmPaths": {
      "dev": "/dev/<service-name>",
      "prod": "/prod/<service-name>"
    }
  }
}
```

## Usage

## Usage as CLI

```bash
Usage: envan [options] [command]

Sync .env files from AWS SSM Parameter Store

Options:
  -v, --version    output the current version
  -h, --help       display help for command

Commands:
  pull [options]   envan helps you sync env files from AWS SSM
  clean [options]  clean .env files
  help [command]   display help for command


Examples:
--------
Pull dev .env files from Parameter Store:
  $ envan pull
Pull prod params with AWS profile:
  $ envan pull -e prod -p my-profile
Pull with AWS profile and force overwrite:
  $ envan pull -e dev -p my-profile -f
Pull with specified aws profile and force overwrite in workspace mode:
  $ envan pull -e dev -p my-profile -f -w
Pull .env and generate .env.example in workspace mode:
  $ envan pull -e dev -w -eg
Clean .env files:
  $ envan clean
Clean .env and  .env.example files:
  $ envan clean -eg
Clean .env and  .env.example files in workspace:
  $ envan clean -w -eg
```

## Usage as package

Load .env files to process.env:

```js
const { loadEnv } = require("envan");

loadEnv();
```

## CI/CD

You can use envan in your CI/CD pipeline to sync env files from AWS SSM Parameter Store. Configure AWS credentials in your CI/CD pipeline. And then you can use envan to sync env files.

Here is an example Github Actions Step:

```yaml
    - name: Get .env files
        run: pnpm envan pull -e dev
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: ${{ secrets.AWS_REGION }}

```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
