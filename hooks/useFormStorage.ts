"use client"

import { useState, useEffect, useCallback } from "react"
import type { Form } from "../types/form"
import { saveFormsToStorage, loadFormsFromStorage } from "../utils/storage"

export function useFormStorage() {
  const [savedForms, setSavedForms] = useState<Form[]>([])

  useEffect(() => {
    const forms = loadFormsFromStorage()
    setSavedForms(forms)
  }, [])

  const saveForm = useCallback((form: Form) => {
    const updatedForm = { ...form, updatedAt: new Date().toISOString() }
    const existingForms = loadFormsFromStorage()
    const existingIndex = existingForms.findIndex((f) => f.id === form.id)

    if (existingIndex >= 0) {
      existingForms[existingIndex] = updatedForm
    } else {
      existingForms.push(updatedForm)
    }

    saveFormsToStorage(existingForms)
    setSavedForms(existingForms)
    return updatedForm
  }, [])

  const deleteForm = useCallback(
    (formId: string) => {
      const updatedForms = savedForms.filter((f) => f.id !== formId)
      saveFormsToStorage(updatedForms)
      setSavedForms(updatedForms)
    },
    [savedForms],
  )

  const exportForm = useCallback((form: Form) => {
    const dataStr = JSON.stringify(form, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = `${form.title.replace(/\s+/g, "_")}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }, [])

  return {
    savedForms,
    saveForm,
    deleteForm,
    exportForm,
  }
}
