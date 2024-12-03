#!/usr/bin/env node

import fs from 'fs/promises';
import commandLineArgs from 'command-line-args';
import { uploadReportToBitbucket } from '@zooshdigital/bitbucket-code-insights';
import { BitbucketReportBody } from '@zooshdigital/bitbucket-code-insights/dist/types';

import { createLogger } from 'utils/logger';

type CoverageType = 'statements' | 'lines' | 'functions' | 'branches';

type CoverageResult = Record<CoverageType, number>;

type MinCoverage = Record<CoverageType, number | undefined>;

const optionDefinitions = [
  { name: 'name', alias: 'n', type: String },
  { name: 'path', alias: 'p', type: String },
  { name: 'min-lines-coverage', alias: 'l', type: Number },
  { name: 'min-statements-coverage', alias: 's', type: Number },
  { name: 'min-functions-coverage', alias: 'f', type: Number },
  { name: 'min-branches-coverage', alias: 'b', type: Number },
];

const args = commandLineArgs(optionDefinitions);

const logger = createLogger('Zoosh Bitbucket v8 Coverage Report');

function getReportResult(coverageResult: CoverageResult, minCoverage: MinCoverage): 'PASSED' | 'FAILED' {
  const failedThreshold = Object.keys(minCoverage).some((key) => {
    const coverageType = key as CoverageType;
    return coverageResult[coverageType] < (minCoverage[coverageType] ?? 0);
  });
  if (failedThreshold) {
    return 'FAILED';
  }
  return 'PASSED';
}

async function uploadReport() {
  try {
    const {
      name,
      path: reportPath,
      'min-lines-coverage': minLinesCoverage,
      'min-statements-coverage': minStatementsCoverage,
      'min-functions-coverage': minFunctionsCoverage,
      'min-branches-coverage': minBranchesCoverage,
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

    const reportResult = getReportResult(coverageResultPercentage, {
      statements: minStatementsCoverage,
      lines: minLinesCoverage,
      functions: minFunctionsCoverage,
      branches: minBranchesCoverage,
    });

    const body: BitbucketReportBody = {
      title: name,
      report_type: 'COVERAGE',
      details: `Coverage report for ${name}.`,
      result: reportResult,
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
    logger.log('Report uploaded successfully', name);
  } catch (error) {
    logger.log(`Error uploading report: ${error}`);
    process.exit(1);
  }
}

uploadReport();
