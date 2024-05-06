# Zoosh bitbucket-v8-coverage-report

Zoosh `bitbucket-v8-coverage-report` is a boilerplate package designed to facilitate the upload of reports to Bitbucket. This package provides functions to automate the process of uploading reports generated during build processes.

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

To utilize the functionality provided by this package, simply run it using npx. Below is an example of how to execute the command-line utility `@zooshdigital/bitbucket-v8-coverage-report` with **npx** directly from your terminal:

```bash
npx  @zooshdigital/bitbucket-v8-coverage-report -n reportName -p ./path-to-the-v8-coverage-report
```

This takes the following arguments:

- -n (required): The name of the report.
- -p (required): The path to the V8 coverage report file.

Ensure that the specified path leads to a V8 coverage report that can be passed to the Bitbucket API.

## Running within a Docker Container

You have the option to run the script inside a Docker container if needed. Ensure you pass the required environment variables **BITBUCKET_REPO_FULL_NAME** and **BITBUCKET_COMMIT**. Additionally, to enable the container to resolve host.docker.internal to the host machine's address, you need to add the **--add-host=host.docker.internal:host-gateway** flag when running the container. 

Below is an example of how to run the container:

```bash
docker run --rm \
  --add-host=host.docker.internal:host-gateway \
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