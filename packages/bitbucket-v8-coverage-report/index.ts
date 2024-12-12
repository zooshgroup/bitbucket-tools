#!/usr/bin/env node

import fs from 'fs/promises';
import commandLineArgs from 'command-line-args';
import { parse as parseJUnit, TestSuites } from 'junit2json';
import {
  createBuildOnBitbucket,
  createCommentOnBitbucket,
  uploadReportToBitbucket,
} from '@zooshdigital/bitbucket-code-insights';
import { BitbucketReportBody } from '@zooshdigital/bitbucket-code-insights/dist/types';

import { createLogger } from 'utils/logger';

type CoverageType = 'statements' | 'lines' | 'functions' | 'branches';

type CoverageResult = Record<CoverageType, number>;

type MinCoverage = Record<CoverageType, number | undefined>;

const optionDefinitions = [
  { name: 'name', alias: 'n', type: String },
  { name: 'path', alias: 'p', type: String },
  { name: 'min-coverage', alias: 'c', type: Number },
  { name: 'min-lines-coverage', alias: 'l', type: Number },
  { name: 'min-statements-coverage', alias: 's', type: Number },
  { name: 'min-functions-coverage', alias: 'f', type: Number },
  { name: 'min-branches-coverage', alias: 'b', type: Number },
  { name: 'add-build', alias: 'a', type: Boolean },
  { name: 'junit-path', alias: 'j', type: String },
  { name: 'failed-test-comment', alias: 't', type: Boolean },
];

const args = commandLineArgs(optionDefinitions);

const logger = createLogger('Zoosh Bitbucket v8 Coverage Report');

function getReportResult(
  coverageResult: CoverageResult,
  minCoverage: MinCoverage,
  averageCoverage: number,
  minAverageCoverage: number | undefined,
): boolean {
  const failedThreshold = Object.keys(minCoverage).some((key) => {
    const coverageType = key as CoverageType;
    return coverageResult[coverageType] < (minCoverage[coverageType] ?? 0);
  });
  if (failedThreshold) {
    return false;
  }
  if (averageCoverage < (minAverageCoverage ?? 0)) {
    return false;
  }
  return true;
}

async function uploadReport() {
  try {
    const {
      name,
      path: reportPath,
      'min-coverage': minAverageCoverage,
      'min-lines-coverage': minLinesCoverage,
      'min-statements-coverage': minStatementsCoverage,
      'min-functions-coverage': minFunctionsCoverage,
      'min-branches-coverage': minBranchesCoverage,
      'add-build': addBuild,
      'junit-path': junitPath,
      'failed-test-comment': failedTestComment,
    } = args;

    if (!name || !reportPath) {
      throw new Error(
        'Bitbucket v8 Coverage Report - Usage: bitbucket-v8-coverage-report -n <report-name> -p <report-path>',
      );
    }

    const coverageResults = JSON.parse(await fs.readFile(reportPath, 'utf8'));

    const coverageResultPercentage = {
      statements: coverageResults.total.statements.pct,
      lines: coverageResults.total.lines.pct,
      functions: coverageResults.total.functions.pct,
      branches: coverageResults.total.branches.pct,
    };

    const coverageValues = Object.values(coverageResultPercentage);
    const averageCoverage = coverageValues.length
      ? Math.round(coverageValues.reduce((acc, val) => acc + val, 0) / coverageValues.length)
      : 0;

    const passed = getReportResult(
      coverageResultPercentage,
      {
        statements: minStatementsCoverage,
        lines: minLinesCoverage,
        functions: minFunctionsCoverage,
        branches: minBranchesCoverage,
      },
      averageCoverage,
      minAverageCoverage,
    );

    const body: BitbucketReportBody = {
      title: `${name} (average ${averageCoverage}%)`,
      report_type: 'COVERAGE',
      details: `${name} report`,
      result: passed ? 'PASSED' : 'FAILED',
      data: [
        {
          title: 'Lines',
          type: 'PERCENTAGE',
          value: coverageResultPercentage.lines,
        },
        {
          title: 'Statements',
          type: 'PERCENTAGE',
          value: coverageResultPercentage.statements,
        },
        {
          title: 'Functions',
          type: 'PERCENTAGE',
          value: coverageResultPercentage.functions,
        },
        {
          title: 'Branches',
          type: 'PERCENTAGE',
          value: coverageResultPercentage.branches,
        },
      ],
    };

    await uploadReportToBitbucket(name, body);

    if (addBuild) {
      const url = process.env.BITBUCKET_PR_ID
        ? `https://bitbucket.org/${process.env.BITBUCKET_REPO_FULL_NAME}/pull-requests/${process.env.BITBUCKET_PR_ID}/overview`
        : `https://bitbucket.org/${process.env.BITBUCKET_REPO_FULL_NAME}/commit/${process.env.BITBUCKET_COMMIT}`;
      await createBuildOnBitbucket({
        key: name,
        state: passed ? 'SUCCESSFUL' : 'FAILED',
        name,
        description: `Average: ${averageCoverage}%`,
        url,
      });

    if (failedTestComment && junitPath) {
      const jUnitResult = (await parseJUnit(await fs.readFile(junitPath, 'utf8'))) as TestSuites;
      if (jUnitResult) {
        const failedTestCases =
          jUnitResult.testsuite?.flatMap(
            (testSuite) => testSuite.testcase?.filter((testCase) => !!testCase.failure) ?? [],
          ) ?? [];
        if (failedTestCases.length) {
          const comment = `## ${failedTestCases.length} test case(s) failed!

${failedTestCases.map(
  (testCase) => `### ${testCase.name}

${testCase.failure
  ?.map(
    (failure) => `\`\`\`
${failure.inner}
\`\`\`

`,
  )
  .join('\n')}`,
)}`;
          await createCommentOnBitbucket({
            content: {
              raw: comment,
              //markup: 'markdown',
            },
          });
        }
      }
    }

    logger.log('Report uploaded successfully', name);
  } catch (error) {
    logger.log(`Error uploading report: ${error}`);
    process.exit(1);
  }
}

uploadReport();
