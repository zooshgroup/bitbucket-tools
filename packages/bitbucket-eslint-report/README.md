# Zoosh bitbucket-eslint-report

Zoosh `bitbucket-eslint-report` is designed to facilitate the upload of eslint reports (including annotations) to Bitbucket Pull Requests. This package provides functions to automate the process of uploading reports generated during build processes.

## Installation

To install Zoosh bitbucket-eslint-report, simply include it as a dependency in your project's `package.json` file:

```bash
npm install @zooshdigital/bitbucket-eslint-report
```

or

```bash
yarn add @zooshdigital/bitbucket-eslint-report
```

## Usage

### uploadReport Function

The uploadReport function enables you to upload coverage reports to Bitbucket pipelines.

To utilize the functionality simply run it using npx. Below is an example of how to execute the command-line utility `@zooshdigital/bitbucket-eslint-report` with **npx** directly from your terminal:

#### Using npx

```bash
npx  @zooshdigital/bitbucket-eslint-report -n reportName -p ./path-to-the-eslint-report.json
```

#### Using yarn

```bash
yarn bitbucket-eslint-report -n reportName -p ./path-to-the-eslint-report.json
```

If you prefer using yarn, ensure that the @zooshdigital/bitbucket-eslint-report is listed in the dependencies of the current workspace if you're using multiple workspaces.

It takes the following arguments:

- -n (required): The name of the report.
- -p (required): The path to the eslint report file.

Ensure that the specified path leads to an eslint json report.

### Configuring eslint to collect JSON report

Eslint supports a JSON output by default. It can be enabled by a `--format json` CLI option.

We recommend creating a separate script in `package.json` (if you already had a lint script), for example:

```javascript
  ...
  "lint:json": "eslint --format json --quiet --max-warnings=0 --ext .js,.ts ./",
  ...
```

In this case, `--quiet` removes any warnings, so that only errors are captured (to reduce noise in bitbucket). The output of this could be piped into a `.json` file in your pipeline.

## Running within a Docker Container

You have the option to run the script inside a Docker container if needed. Ensure you pass the required environment variables **BITBUCKET_REPO_FULL_NAME**, **BITBUCKET_COMMIT** and **BITBUCKET_CLONE_DIR**. Additionally, to enable the container to resolve host.docker.internal to the host machine's address, you need to add the **--add-host=host.docker.internal:host-gateway** flag when running the container.

Below is an example of how to run the container:

```bash
docker run --rm \
  --add-host=host.docker.internal:host-gateway \
  -e BITBUCKET_REPO_FULL_NAME=<repo_full_name> \
  -e BITBUCKET_COMMIT=<commit_hash> \
  -e BITBUCKET_CLONE_DIR=<absolute path of repository root> \
  <docker_image_name>
```

Replace <repo_full_name> with the full name of your Bitbucket repository, <commit_hash> with the commit hash you want to analyze, and <docker_image_name> with the name of the Docker image you built.

## Authentication

Your requests will automatically be routed through a proxy server running alongside every pipeline on 'localhost:29418'. This proxy server adds a valid Auth-Header to your requests, eliminating the need for additional authentication configurations.

See more in the official Bitbucket documentation [here](https://support.atlassian.com/bitbucket-cloud/docs/code-insights/).

## License

This project is licensed under the GNU General Public License v3.0 - see the LICENSE file for details.
