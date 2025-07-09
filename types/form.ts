export interface FormElement {
  id: string
  type:
    | "text"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio"
    | "number"
    | "email"
    | "date"
    | "tel"
    | "file"
    | "textfield"
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
  fileConfig?: {
    accept?: string
    multiple?: boolean
    maxSize?: number
  }
  textConfig?: {
    fontSize?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl"
    fontWeight?: "normal" | "medium" | "semibold" | "bold" | "extrabold"
    content?: string
  }
}

export interface FormGroup {
  id: string
  title: string
  description?: string
  layout: "single" | "two-column" | "three-column"
  elements: FormElement[]
}

export interface FormSection {
  id: string
  title: string
  description?: string
  groups: FormGroup[]
}

export interface Form {
  id: string
  title: string
  description?: string
  sections: FormSection[]
  createdAt: string
  updatedAt: string
}
