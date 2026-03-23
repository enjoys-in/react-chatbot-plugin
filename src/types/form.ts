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
  required?: boolean;
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

// ─── Custom Form Field Renderer Types ────────────────────────────

/** Props passed to text-like custom field renderers */
export interface TextFieldRenderProps {
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'date' | 'time';
  field: FormFieldConfig;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

/** Props passed to select/multiselect custom field renderers */
export interface SelectFieldRenderProps {
  type: 'select' | 'multiselect';
  field: FormFieldConfig;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  error?: string;
}

/** Props passed to radio custom field renderers */
export interface RadioFieldRenderProps {
  type: 'radio';
  field: FormFieldConfig;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

/** Props passed to checkbox custom field renderers */
export interface CheckboxFieldRenderProps {
  type: 'checkbox';
  field: FormFieldConfig;
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}

/** Props passed to file custom field renderers */
export interface FileFieldRenderProps {
  type: 'file';
  field: FormFieldConfig;
  value: FileList | null;
  onChange: (value: FileList | null) => void;
  error?: string;
  primaryColor: string;
}

/** Union of all field render props — discriminated by `type` */
export type FormFieldRenderProps =
  | TextFieldRenderProps
  | SelectFieldRenderProps
  | RadioFieldRenderProps
  | CheckboxFieldRenderProps
  | FileFieldRenderProps;

/** Map of field type → custom renderer. The renderer receives strongly-typed props + the default element. */
export type FormFieldRenderMap = Partial<{
  text: (props: TextFieldRenderProps, defaultElement: React.ReactNode) => React.ReactNode;
  email: (props: TextFieldRenderProps, defaultElement: React.ReactNode) => React.ReactNode;
  password: (props: TextFieldRenderProps, defaultElement: React.ReactNode) => React.ReactNode;
  number: (props: TextFieldRenderProps, defaultElement: React.ReactNode) => React.ReactNode;
  tel: (props: TextFieldRenderProps, defaultElement: React.ReactNode) => React.ReactNode;
  url: (props: TextFieldRenderProps, defaultElement: React.ReactNode) => React.ReactNode;
  textarea: (props: TextFieldRenderProps, defaultElement: React.ReactNode) => React.ReactNode;
  date: (props: TextFieldRenderProps, defaultElement: React.ReactNode) => React.ReactNode;
  time: (props: TextFieldRenderProps, defaultElement: React.ReactNode) => React.ReactNode;
  select: (props: SelectFieldRenderProps, defaultElement: React.ReactNode) => React.ReactNode;
  multiselect: (props: SelectFieldRenderProps, defaultElement: React.ReactNode) => React.ReactNode;
  radio: (props: RadioFieldRenderProps, defaultElement: React.ReactNode) => React.ReactNode;
  checkbox: (props: CheckboxFieldRenderProps, defaultElement: React.ReactNode) => React.ReactNode;
  file: (props: FileFieldRenderProps, defaultElement: React.ReactNode) => React.ReactNode;
}>;
