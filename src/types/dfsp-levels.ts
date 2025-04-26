export type FormLevel = {
  id: number;
  name: string;
  code: string;
  parent: number;
  input_type: string;
  level_type: string;
  validation_regex: string;
  options?: FormLevelValue[];
};

export type FormLevelValue = {
  id: number;
  name: string;
  code: string;
  level_id: number;
  parent: number;
  strategy_id: number;
  description: string;
};

export type KeyValue = {
  key: string;
  value: string;
  code?: string;
  strategy?: number;
};

export type LinkOrUpdate = {
  strategy_id?: 0;
  fa_type?: string;
  bank_name?: string;
  bank_code?: string;
  branch_name?: string;
  branch_code?: string;
  account_number?: string;
  wallet_provider_name?: string;
  wallet_provider_code?: string;
  mobile_number?: string;
  email_address?: string;
};
