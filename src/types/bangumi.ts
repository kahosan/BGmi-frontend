export interface BangumiData {
  update_time: string;
  cover: string;
  bangumi_name: string;
  episode: number;
  status: number;
  updated_time: number;
  player: Record<string, Record<(string & {}) | 'path', string>>;
}

export interface BangumiResponse {
  version: string;
  danmaku_api: string;
  data: BangumiData[];
}
