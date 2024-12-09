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

This tool enables you to upload coverage reports to Bitbucket pipelines.

### Configuring eslint to collect JSON report

Eslint supports a JSON output by default. It can be enabled by a `--format json` CLI option.

We recommend creating a separate script in `package.json` (if you already had a lint script), for example:

```javascript
  ...
  "lint:json": "eslint --format json --quiet --max-warnings=0 --ext .js,.ts ./",
  ...
```

In this case, `--quiet` removes any warnings, so that only errors are captured (to reduce noise in bitbucket). The output of this could be piped into a `.json` file in your pipeline.

### Consuming the JSON report

Simply run the tool using npx. Below is an example of how to execute the command-line utility `@zooshdigital/bitbucket-eslint-report` directly from your terminal or a pipeline:

```bash
npx @zooshdigital/bitbucket-eslint-report -n reportName -p ./path-to-the-eslint-report.json
```

or

```bash
yarn bitbucket-eslint-report -n reportName -p ./path-to-the-eslint-report.json
```

If you prefer using yarn, ensure that the @zooshdigital/bitbucket-eslint-report is listed in the dependencies of the current workspace if you're using multiple workspaces.

### Configuration

It takes the following arguments:

- `-n [name]` or `--name [name]` (required): The name of the report in Bitbucket.
- `-p [path]` or `--path [path]` (required): The path to the eslint report file.
- `-a` or `--add-build` (optional): Create a success/failed "build" as well besides the report.
- `-s` or `--strict` (optional): Strict mode, consider report/build failed in case of eslint warnings as well (by default, only fails in case of eslint errors)

Ensure that the specified path leads to an eslint json report.

## Prerequisites

### Authentication

While some requests could be automatically authenticated running in a pipeline, Bitbucket doesn't allow that for all endpoints. Thus, for simplicity, the library expects an access token for all API calls. This can be a repository, project or workspace access token in the BITBUCKET_BUILD_TOKEN environment variable. Create a token and make it available as a repository or deployment variable to the pipeline.

### Other identifiers

Since information is attached to a commit (even in case of a pull request), the library needs the BITBUCKET_REPO_FULL_NAME and BITBUCKET_COMMIT environment variables to do that. These two are standard Bitbucket pipeline variables, so there is no need to set them explicitly if running the script in a pipeline.

## License

This project is licensed under the GNU General Public License v3.0 - see the LICENSE file for details.
