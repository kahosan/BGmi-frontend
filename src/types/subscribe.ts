export interface FetchFilterResp {
  available_subtitle: string[];
  selected_subtitle: string[];
  include: string[];
  exclude: string[];
  regex: '';
}

export interface SaveFilterBody {
  include: string[] | null;
  exclude: string[] | null;
  regex: string | null;
  selected_subtitle: string[] | null;
}
