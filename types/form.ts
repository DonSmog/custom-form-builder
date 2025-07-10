export interface FormElement {
  id: string;
  type:
    | "text"
    | "textarea"
    | "select"
    | "checkbox"
    | "table"
    | "radio"
    | "number"
    | "email"
    | "date"
    | "tel"
    | "file"
    | "textfield";
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  fileConfig?: {
    accept?: string;
    multiple?: boolean;
    maxSize?: number;
  };
  tableConfig?: {
    rows: number;
    columns: number;
    headings?: string[];
    fontSize?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
    fontWeight?: "normal" | "medium" | "semibold" | "bold" | "extrabold";
    content?: string;
  };
  textConfig?: {
    fontSize?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
    fontWeight?: "normal" | "medium" | "semibold" | "bold" | "extrabold";
    content?: string;
  };
  displayConfig?: {
    layout?: "vertical" | "horizontal";
  };
}

export interface FormGroup {
  id: string;
  title: string;
  description?: string;
  layout: "single" | "two-column" | "three-column" | "four-column";
  alignment?: "left" | "center" | "right";
  alignItems?: "start" | "center" | "end" | "stretch";
  justifyContent?: "start" | "center" | "end" | "between" | "around" | "evenly";
  elements: FormElement[];
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  alignment?: "left" | "center" | "right";
  alignItems?: "start" | "center" | "end" | "stretch";
  justifyContent?: "start" | "center" | "end" | "between" | "around" | "evenly";
  groups: FormGroup[];
}

export interface Form {
  id: string;
  title: string;
  sections: FormSection[];
  createdAt: string;
  updatedAt: string;
}
