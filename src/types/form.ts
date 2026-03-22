export type FormFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'file'
  | 'date'
  | 'time'
  | 'hidden';

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface FormFieldValidation {
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  message?: string;
}

export interface FormFieldConfig {
  name: string;
  type: FormFieldType;
  label?: string;
  placeholder?: string;
  required?: boolean;
  options?: FormFieldOption[];
  accept?: string;
  multiple?: boolean;
  defaultValue?: string | string[];
  validation?: FormFieldValidation;
}

export interface FormConfig {
  id: string;
  title?: string;
  description?: string;
  fields: FormFieldConfig[];
  submitLabel?: string;
}
