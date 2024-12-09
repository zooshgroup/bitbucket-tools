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

This tool enables you to upload coverage reports to Bitbucket pipelines.

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

### Consuming the analysis

Simply run the tool using npx. Below is an example of how to execute the command-line utility `@zooshdigital/bitbucket-v8-coverage-report` with **npx** directly from your terminal or a pipeline:

```bash
npx  @zooshdigital/bitbucket-v8-coverage-report -n reportName -p ./path-to-the-v8-coverage-report
```

or

```bash
yarn bitbucket-v8-coverage-report -n reportName -p ./path-to-the-v8-coverage-report
```

If you prefer using yarn, ensure that the @zooshdigital/bitbucket-v8-coverage-report is listed in the dependencies of the current workspace if you're using multiple workspaces.

### Configuration

It takes the following arguments:

- `-n [name]` or `--name [name]` (required): The name of the report in Bitbucket.
- `-p [path]` or `--path [path]` (required): The path to the V8 coverage report file.
- `-c [percentage]` or `--min-coverage [percentage]` (optional): Optional threshold for the average coverage (average of the other four metrics).
- `-l [percentage]` or `--min-lines-coverage [percentage]` (optional): Optional threshold for the line coverage value.
- `-s [percentage]` or `--min-statements-coverage [percentage]` (optional): Optional threshold for the statements coverage value.
- `-f [percentage]` or `--min-functions-coverage [percentage]` (optional): Optional threshold for the functions coverage value.
- `-b [percentage]` or `--min-branches-coverage [percentage]` (optional): Optional threshold for the branches coverage value.
- `-a` or `--add-build` (optional): Create a success/failed "build" as well besides the report.

Ensure that the specified path leads to a V8 coverage report that can be passed to the Bitbucket API.

## Prerequisites

### Authentication

While some requests could be automatically authenticated running in a pipeline, Bitbucket doesn't allow that for all endpoints. Thus, for simplicity, the library expects an access token for all API calls. This can be a repository, project or workspace access token in the BITBUCKET_BUILD_TOKEN environment variable. Create a token and make it available as a repository or deployment variable to the pipeline.

### Other identifiers

Since information is attached to a commit (even in case of a pull request), the library needs the BITBUCKET_REPO_FULL_NAME and BITBUCKET_COMMIT environment variables to do that. These two are standard Bitbucket pipeline variables, so there is no need to set them explicitly if running the script in a pipeline.

## License

This project is licensed under the GNU General Public License v3.0 - see the LICENSE file for details.
