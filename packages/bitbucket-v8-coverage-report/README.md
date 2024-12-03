# Zoosh bitbucket-v8-coverage-report

Zoosh `bitbucket-v8-coverage-report` is designed to facilitate the upload of V8 test coverage reports to Bitbucket Pull Requests. This package provides functions to automate the process of uploading reports generated during build processes.

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

The uploadReport function enables you to upload coverage reports to Bitbucket pipelines.

To utilize the functionality simply run it using npx. Below is an example of how to execute the command-line utility `@zooshdigital/bitbucket-v8-coverage-report` with **npx** directly from your terminal:

#### Using npx

```bash
npx  @zooshdigital/bitbucket-v8-coverage-report -n reportName -p ./path-to-the-v8-coverage-report
```

#### Using yarn

```bash
yarn bitbucket-v8-coverage-report -n reportName -p ./path-to-the-v8-coverage-report
```

If you prefer using yarn, ensure that the @zooshdigital/bitbucket-v8-coverage-report is listed in the dependencies of the current workspace if you're using multiple workspaces.

It takes the following arguments:

- -n (required): The name of the report.
- -p (required): The path to the V8 coverage report file.
- -l (optional): Optional threshold for the line coverage value.
- -s (optional): Optional threshold for the statements coverage value.
- -f (optional): Optional threshold for the functions coverage value.
- -b (optional): Optional threshold for the branches coverage value.

Ensure that the specified path leads to a V8 coverage report that can be passed to the Bitbucket API.

### Configuring Jest for Code Coverage Analysis

When configuring Jest for code coverage analysis, you may need to specify which files should be included in the coverage report. The `collectCoverageFrom` property in Jest configuration allows you to specify these files. Here's an example of a possible configuration:

```javascript
coverageProvider: 'v8',
coverageReporters: ['json-summary'],
collectCoverageFrom: [
  './**/*.{js,ts}',
  '!**/node_modules/**',
  '!./.eslintrc.js',
  '!./jest.config.ts',
  '!./coverage/**',
],
```

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
