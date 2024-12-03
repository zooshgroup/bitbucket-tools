#!/usr/bin/env node

import fs from 'fs/promises';
import commandLineArgs from 'command-line-args';
import { uploadReportToBitbucket, uploadAnnotationsToBitbucket } from '@zooshdigital/bitbucket-code-insights';
import { createLogger } from 'utils/logger';
import { BitbucketReportBody, BitbucketAnnotation } from '@zooshdigital/bitbucket-code-insights/dist/types';

const optionDefinitions = [
  { name: 'name', alias: 'n', type: String },
  { name: 'path', alias: 'p', type: String },
];

const args = commandLineArgs(optionDefinitions);

const logger = createLogger('Zoosh Bitbucket Eslint Report');

const severities = {
  0: 'LOW',
  1: 'MEDIUM',
  2: 'HIGH',
};

const items = [];

let counter = 0;
let totalErrors = 0;
let fixableErrors = 0;

function getReportResult(coverageResult: CoverageResult, minCoverage: MinCoverage): 'PASSED' | 'FAILED' {
  if (minCoverage.lines !== undefined && coverageResult.lines < minCoverage.lines) {
    return 'FAILED';
  }
  if (minCoverage.statements !== undefined && coverageResult.statements < minCoverage.statements) {
    return 'FAILED';
  }
  if (minCoverage.functions !== undefined && coverageResult.functions < minCoverage.functions) {
    return 'FAILED';
  }
  if (minCoverage.branches !== undefined && coverageResult.branches < minCoverage.branches) {
    return 'FAILED';
  }

  return 'PASSED';
}

async function uploadReport() {
  try {
    data.forEach((file) => {
      const path = file.filePath.replace(/^\/opt\/atlassian\/pipelines\/agent\/build\//, '');
      totalErrors += file.errorCount;
      fixableErrors != file.fixableErrorCount;
      file.messages.forEach((message) => {
        // https://api.bitbucket.org/2.0/repositories/zooshltd/slack-gpt-ts/commit/ccee2953303aa29d35a029fb6745c9238e70a161/statuses/build/
        counter++;
        items.push({
          external_id: `eslint${counter}`,
          title: `Eslint: ${message.ruleId}`,
          annotation_type: 'CODE_SMELL',
          summary: `Eslint error: ${message.ruleId} ${message.fix ? `| fix: ${message.fix.text}` : ''}`,
          severity: severities[message.severity],
          path,
          line: message.line,
        });
      });
    });

    if (items.length > 0) {
      console.log(
        `https://api.bitbucket.org/2.0/repositories/zooshltd/miljo/commit/d839fd9d0c27a8ea6441dc88ba4f6665c768a2dc/reports/eslint/annotations`,
        items,
      );
      await uploadReportToBitbucket('eslint', {
        title: 'Eslint',
        report_type: 'BUG',
        details: 'Eslint',
        result: 'FAILED',
        data: [
          {
            title: 'Errors',
            type: 'NUMBER',
            value: totalErrors,
          },
          {
            title: 'Fixable',
            type: 'NUMBER',
            value: fixableErrors,
          },
        ],
      });
      await uploadAnnotationsToBitbucket('eslint', items);
    } else {
      await uploadReportToBitbucket('eslint', {
        title: 'Eslint',
        report_type: 'BUG',
        details: 'Eslint',
        result: 'PASSED',
        data: [
          {
            title: 'Errors',
            type: 'NUMBER',
            value: 0,
          },
          {
            title: 'Fixable',
            type: 'NUMBER',
            value: 0,
          },
        ],
      });
    }

    const {
      name,
      path: reportPath,
      'min-lines-coverage': minLinesCoverage,
      'min-statements-coverage': minStatementsCoverage,
      'min-functions-coverage': minFunctionsCoverage,
      'min-branches-coverage': minBranchesCoverage,
    } = args;

    if (!name || !reportPath) {
      throw new Error('Bitbucket v8 Coverage Report - Usage: uploadReport -n <report-name> -p <report-path>');
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
