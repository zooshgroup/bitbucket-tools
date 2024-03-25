# Zoosh bitbucket-v8-coverage-report

Zoosh bitbucket-v8-coverage-report is a boilerplate package designed to facilitate the upload of reports to Bitbucket pipelines. This package provides functions to automate the process of uploading reports generated during build processes.

## Installation

To install Zoosh bitbucket-v8-coverage-report, simply include it as a dependency in your project's `package.json` file:

```bash
npm install bitbucket-v8-coverage-report
```

or

```bash
yarn add bitbucket-v8-coverage-report
```

## Usage

### uploadReport Function

The uploadReport function provided by Zoosh bitbucket-v8-coverage-report enables you to upload coverage reports to Bitbucket pipelines. Below is an example of how to use this function

```typescript
import { uploadReport } from 'zoosh-bitbucket-tools';

uploadReport();
```

The uploadReport function takes the following parameters:

- name (required): The name of the report.
- path (required): The path to the report file.

```bash
uploadReport -n my-report -p /path/to/report.json
```

Your requests will automatically be routed through a proxy server running alongside every pipeline on 'localhost:29418'. This proxy server adds a valid Auth-Header to your requests, eliminating the need for additional authentication configurations.
 
See more in the official Bitbucket documentation [here](https://support.atlassian.com/bitbucket-cloud/docs/code-insights/).


## License

This project is licensed under the GNU General Public License v3.0 - see the LICENSE file for details.