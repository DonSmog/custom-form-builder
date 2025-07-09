import type { Form } from "../types/form"

const STORAGE_KEY = "form-builder-forms"
const CURRENT_FORM_KEY = "form-builder-current"

export const saveFormsToStorage = (forms: Form[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(forms))
  } catch (error) {
    console.error("Failed to save forms to localStorage:", error)
  }
}

export const loadFormsFromStorage = (): Form[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Failed to load forms from localStorage:", error)
    return []
  }
}

export const saveCurrentFormToStorage = (form: Form) => {
  try {
    localStorage.setItem(CURRENT_FORM_KEY, JSON.stringify(form))
  } catch (error) {
    console.error("Failed to save current form to localStorage:", error)
  }
}

export const loadCurrentFormFromStorage = (): Form | null => {
  try {
    const stored = localStorage.getItem(CURRENT_FORM_KEY)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error("Failed to load current form from localStorage:", error)
    return null
  }
}
