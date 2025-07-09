import type { Form, FormGroup } from "../types/form"

export const getSelectedElement = (form: Form, selectedElement: string | null) => {
  for (const section of form.sections) {
    for (const group of section.groups) {
      const element = group.elements.find((el) => el.id === selectedElement)
      if (element) return { element, groupId: group.id, sectionId: section.id }
    }
  }
  return null
}

export const getSelectedGroup = (form: Form, selectedGroup: string | null) => {
  for (const section of form.sections) {
    const group = section.groups.find((g) => g.id === selectedGroup)
    if (group) return { group, sectionId: section.id }
  }
  return null
}

export const getSelectedSection = (form: Form, selectedSection: string | null) => {
  return form.sections.find((section) => section.id === selectedSection)
}

export const getLayoutClasses = (layout: FormGroup["layout"]) => {
  switch (layout) {
    case "two-column":
      return "grid grid-cols-1 md:grid-cols-2 gap-4"
    case "three-column":
      return "grid grid-cols-1 md:grid-cols-3 gap-4"
    default:
      return "space-y-4"
  }
}
