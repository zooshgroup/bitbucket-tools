#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import commandLineArgs from 'command-line-args';
import {
  uploadReportToBitbucket,
  uploadAnnotationsToBitbucket,
  createBuildOnBitbucket,
} from '@zooshdigital/bitbucket-code-insights';
import { BitbucketAnnotation, BitbucketSeverity } from '@zooshdigital/bitbucket-code-insights/dist/types';

import { createLogger } from 'utils/logger';

type LintMessage = {
  ruleId: string;
  severity: number;
  line: number;
  column: number;
  fix?: {
    text: string;
  };
};

type LintFile = {
  filePath: string;
  errorCount: number;
  fixableErrorCount: number;
  warningCount: number;
  fixableWarningCount: number;
  messages: LintMessage[];
};

const optionDefinitions = [
  { name: 'name', alias: 'n', type: String },
  { name: 'path', alias: 'p', type: String, multiple: true },
  { name: 'build', alias: 'b', type: Boolean },
];

const args = commandLineArgs(optionDefinitions);

const logger = createLogger('Zoosh Bitbucket Eslint Report');

const severities: Record<number, BitbucketSeverity> = {
  0: 'LOW',
  1: 'MEDIUM',
  2: 'HIGH',
};

async function uploadReport() {
  const items: BitbucketAnnotation[] = [];

  let counter = 0;
  let totalErrors = 0;
  let fixableErrors = 0;
  let totalWarnings = 0;
  let fixableWarnings = 0;

  try {
    const { name, path: reportPaths, build } = args;

    if (!name || !reportPaths || reportPaths.length === 0) {
      throw new Error('Bitbucket Eslint Report - Usage: bitbucket-eslint-report -n <report-name> -p <report-path>');
    }

    reportPaths.forEach(async (reportPath: string) => {
      const lint: LintFile[] = JSON.parse(await fs.readFile(reportPath, 'utf8'));
      lint.forEach((file) => {
        // const filePath = file.filePath.replace(/^\/opt\/atlassian\/pipelines\/agent\/build\//, '');
        const filePath = path.relative(process.env.BITBUCKET_CLONE_DIR ?? process.cwd(), file.filePath);
        totalErrors += file.errorCount;
        fixableErrors != file.fixableErrorCount;
        totalWarnings += file.warningCount;
        fixableWarnings != file.fixableWarningCount;
        file.messages.forEach((message) => {
          counter++;
          items.push({
            external_id: `${name}.${process.env.BITBUCKET_COMMIT}.${counter}`,
            title: `Eslint: ${message.ruleId}`,
            annotation_type: 'CODE_SMELL',
            summary: `Eslint error: ${message.ruleId} ${message.fix ? `| fix: ${message.fix.text}` : ''}`,
            severity: severities[message.severity],
            path: filePath,
            line: message.line,
          });
        });
      });
    });

    const reportResult = items.length > 0 ? 'FAILED' : 'PASSED';

    await uploadReportToBitbucket('eslint', {
      title: name,
      report_type: 'TEST',
      details: `${reportResult} report`,
      result: reportResult,
      data: [
        {
          title: 'Errors',
          type: 'NUMBER',
          value: totalErrors,
        },
        {
          title: 'Fixable Errors',
          type: 'NUMBER',
          value: fixableErrors,
        },
        {
          title: 'Warnings',
          type: 'NUMBER',
          value: totalWarnings,
        },
        {
          title: 'Fixable Warnings',
          type: 'NUMBER',
          value: fixableWarnings,
        },
      ],
    });

    if (items.length > 0) {
      await uploadAnnotationsToBitbucket('eslint', items);
    }
    logger.log('Report uploaded successfully', name);

    if (build) {
      createBuildOnBitbucket({
        key: name,
        state: items.length > 0 ? 'FAILED' : 'SUCCESSFUL',
        name,
        description: `${name} result`,
        url: '#',
      });
    }
  } catch (error) {
    logger.log(`Error uploading report: ${error}`);
    process.exit(1);
  }
}

uploadReport();
