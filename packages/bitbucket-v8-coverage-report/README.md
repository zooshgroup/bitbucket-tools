# Zoosh bitbucket-v8-coverage-report

Zoosh bitbucket-v8-coverage-report is a boilerplate package designed to facilitate the upload of reports to Bitbucket pipelines. This package provides functions to automate the process of uploading reports generated during build processes.

## Installation

To install Zoosh bitbucket-v8-coverage-report, simply include it as a dependency in your project's `package.json` file:

```bash
npm install @zooshdigital/bitbucket-v8-coverage-report
```

or

```bash
yarn add @zooshdigital/bitbucket-v8-coverage-report
```

## Usage

### uploadReport Function

The uploadReport function provided by Zoosh bitbucket-v8-coverage-report enables you to upload coverage reports to Bitbucket pipelines. 

This package includes a command-line utility named `bitbucket-v8-coverage-report`. This allows you to execute the tool using `npx` from your terminal.

```bash
bitbucket-v8-coverage-report
```

This takes the following arguments:

- -n (required): The name of the report.
- -p (required): The path to the report file.

```bash
npx bitbucket-v8-coverage-report -n reportName -p ./path
```

Your requests will automatically be routed through a proxy server running alongside every pipeline on 'localhost:29418'. This proxy server adds a valid Auth-Header to your requests, eliminating the need for additional authentication configurations.
 
See more in the official Bitbucket documentation [here](https://support.atlassian.com/bitbucket-cloud/docs/code-insights/).


## License

This project is licensed under the GNU General Public License v3.0 - see the LICENSE file for details.