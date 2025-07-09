"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { Form } from "../types/form"
import { saveCurrentFormToStorage, loadCurrentFormFromStorage } from "../utils/storage"
import { useFormHistory } from "./useFormHistory"

export function useFormBuilder() {
  const initialForm: Form = {
    id: `form-${Date.now()}`,
    title: "Untitled Form",
    description: "",
    sections: [
      {
        id: `section-${Date.now()}`,
        title: "Section 1",
        description: "",
        groups: [
          {
            id: `group-${Date.now()}`,
            title: "Group 1",
            description: "",
            layout: "single",
            elements: [],
          },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const { currentForm, canUndo, canRedo, undo, redo, pushToHistory, clearHistory } = useFormHistory(initialForm)

  const [form, setForm] = useState<Form>(currentForm)
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const shouldAutoSave = useRef(false)

  // Sync form with history
  useEffect(() => {
    setForm(currentForm)
  }, [currentForm])

  // Load current form on mount and when returning from saved forms
  useEffect(() => {
    const savedForm = loadCurrentFormFromStorage()
    if (savedForm) {
      setForm(savedForm)
      clearHistory(savedForm)
    }
    setIsInitialized(true)
    setTimeout(() => {
      shouldAutoSave.current = true
    }, 100)
  }, [clearHistory])

  // Auto-save with debouncing
  useEffect(() => {
    if (!isInitialized || !shouldAutoSave.current) return

    const timeoutId = setTimeout(() => {
      const updatedForm = { ...form, updatedAt: new Date().toISOString() }
      saveCurrentFormToStorage(updatedForm)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [form, isInitialized])

  const updateForm = useCallback(
    (updates: Partial<Form>) => {
      const newForm = { ...form, ...updates }
      setForm(newForm)
      pushToHistory(newForm)
    },
    [form, pushToHistory],
  )

  const setFormWithHistory = useCallback(
    (newForm: Form) => {
      setForm(newForm)
      pushToHistory(newForm)
    },
    [pushToHistory],
  )

  const loadForm = useCallback(
    (savedForm: Form) => {
      shouldAutoSave.current = false
      setForm(savedForm)
      clearHistory(savedForm)
      saveCurrentFormToStorage(savedForm)
      setSelectedElement(null)
      setSelectedGroup(null)
      setSelectedSection(null)
      setTimeout(() => {
        shouldAutoSave.current = true
      }, 100)
    },
    [clearHistory],
  )

  const createNewForm = useCallback(() => {
    shouldAutoSave.current = false
    const newForm: Form = {
      id: `form-${Date.now()}`,
      title: "Untitled Form",
      description: "",
      sections: [
        {
          id: `section-${Date.now()}`,
          title: "Section 1",
          description: "",
          groups: [
            {
              id: `group-${Date.now()}`,
              title: "Group 1",
              description: "",
              layout: "single",
              elements: [],
            },
          ],
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setForm(newForm)
    clearHistory(newForm)
    saveCurrentFormToStorage(newForm)
    setSelectedElement(null)
    setSelectedGroup(null)
    setSelectedSection(null)
    setTimeout(() => {
      shouldAutoSave.current = true
    }, 100)
  }, [clearHistory])

  const handleUndo = useCallback(() => {
    const previousForm = undo()
    if (previousForm) {
      setForm(previousForm)
    }
  }, [undo])

  const handleRedo = useCallback(() => {
    const nextForm = redo()
    if (nextForm) {
      setForm(nextForm)
    }
  }, [redo])

  return {
    form,
    setForm: setFormWithHistory,
    updateForm,
    loadForm,
    createNewForm,
    selectedElement,
    setSelectedElement,
    selectedGroup,
    setSelectedGroup,
    selectedSection,
    setSelectedSection,
    // History methods
    canUndo,
    canRedo,
    undo: handleUndo,
    redo: handleRedo,
  }
}
