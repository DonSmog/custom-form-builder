import { Type, AlignLeft, List, CheckSquare, Circle, Hash, Mail, Calendar, Phone, Upload, FileText } from "lucide-react"

export const elementTypes = [
  { type: "text", label: "Text Input", icon: Type },
  { type: "textarea", label: "Textarea", icon: AlignLeft },
  { type: "textfield", label: "Text Field", icon: FileText },
  { type: "select", label: "Select Dropdown", icon: List },
  { type: "checkbox", label: "Checkbox", icon: CheckSquare },
  { type: "radio", label: "Radio Group", icon: Circle },
  { type: "number", label: "Number", icon: Hash },
  { type: "email", label: "Email", icon: Mail },
  { type: "date", label: "Date", icon: Calendar },
  { type: "tel", label: "Phone", icon: Phone },
  { type: "file", label: "File Upload", icon: Upload },
]

export const layoutOptions = [
  { value: "single", label: "Single Column" },
  { value: "two-column", label: "Two Columns" },
  { value: "three-column", label: "Three Columns" },
]

export const fileAcceptOptions = [
  { value: "all", label: "All Files" },
  { value: "image/*", label: "Images Only" },
  { value: "image/jpeg,image/png", label: "JPEG/PNG Images" },
  { value: ".pdf", label: "PDF Files" },
  { value: ".doc,.docx", label: "Word Documents" },
  { value: ".xls,.xlsx", label: "Excel Files" },
  { value: ".txt", label: "Text Files" },
  { value: "audio/*", label: "Audio Files" },
  { value: "video/*", label: "Video Files" },
]

export const fontSizeOptions = [
  { value: "xs", label: "Extra Small (12px)" },
  { value: "sm", label: "Small (14px)" },
  { value: "base", label: "Base (16px)" },
  { value: "lg", label: "Large (18px)" },
  { value: "xl", label: "Extra Large (20px)" },
  { value: "2xl", label: "2X Large (24px)" },
  { value: "3xl", label: "3X Large (30px)" },
  { value: "4xl", label: "4X Large (36px)" },
]

export const fontWeightOptions = [
  { value: "normal", label: "Normal (400)" },
  { value: "medium", label: "Medium (500)" },
  { value: "semibold", label: "Semibold (600)" },
  { value: "bold", label: "Bold (700)" },
  { value: "extrabold", label: "Extra Bold (800)" },
]

export const displayLayoutOptions = [
  { value: "vertical", label: "Vertical" },
  { value: "horizontal", label: "Horizontal" },
]

export const ItemTypes = {
  ELEMENT_TYPE: "element-type",
  ELEMENT: "element",
  GROUP: "group",
  SECTION: "section",
}
