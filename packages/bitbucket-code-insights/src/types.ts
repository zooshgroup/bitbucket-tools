export interface BitbucketReportData {
  title: string;
  type: 'BOOLEAN' | 'DATE' | 'DURATION' | 'LINK' | 'NUMBER' | 'PERCENTAGE' | 'TEXT';
  value: number;
}

export interface BitbucketAnnotation {
  external_id: string;
  annotation_type: 'VULNERABILITY' | 'CODE_SMELL' | 'BUG';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  path: string;
  line: number;
  title: string;
  summary: string;
  details: string;
  result?: 'PASSED' | 'FAILED' | 'SKIPPED' | 'IGNORED';
  link?: string;
}

export interface BitbucketReportBody {
  title: string;
  report_type: 'SECURITY' | 'COVERAGE' | 'TEST' | 'BUG';
  details: string;
  result: 'PASSED' | 'FAILED' | 'PENDING';
  data: BitbucketReportData[];
}
