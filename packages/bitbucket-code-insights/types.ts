export interface BitbucketReportData {
    title: string;
    type: string;
    value: number;
  }
  
  export interface BitbucketReportBody {
    title: string;
    report_type: string;
    details: string;
    result: string;
    data: BitbucketReportData[];
  }