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

## Running within a Docker Container

You can run the script inside a Docker container. Ensure you pass the required environment variables **BITBUCKET_REPO_FULL_NAME** and **BITBUCKET_COMMIT**. Below is an example of how to run the container:

```bash
docker run --rm \
  -e BITBUCKET_REPO_FULL_NAME=<repo_full_name> \
  -e BITBUCKET_COMMIT=<commit_hash> \
  <docker_image_name>
```

Replace <repo_full_name> with the full name of your Bitbucket repository, <commit_hash> with the commit hash you want to analyze, and <docker_image_name> with the name of the Docker image you built.

## Authentication 

Your requests will automatically be routed through a proxy server running alongside every pipeline on 'localhost:29418'. This proxy server adds a valid Auth-Header to your requests, eliminating the need for additional authentication configurations.
 
See more in the official Bitbucket documentation [here](https://support.atlassian.com/bitbucket-cloud/docs/code-insights/).


## License

This project is licensed under the GNU General Public License v3.0 - see the LICENSE file for details.