"use client"
import { useCallback } from "react"
import type { Form, FormElement } from "../types/form"
import { elementTypes } from "../constants/formElements"

export function useFormElements(
  form: Form,
  setForm: (form: Form) => void, // Changed from React.Dispatch<React.SetStateAction<Form>>
  selectedElement: string | null,
  setSelectedElement: (id: string | null) => void,
  setSelectedGroup: (id: string | null) => void,
  setSelectedSection: (id: string | null) => void,
) {
  const addElement = useCallback(
    (type: FormElement["type"], groupId: string, sectionId: string) => {
      const newElement: FormElement = {
        id: `element-${Date.now()}`,
        type,
        label: `${elementTypes.find((et) => et.type === type)?.label} Field`,
        placeholder:
          type === "textarea"
            ? "Enter your message..."
            : type === "file"
              ? ""
              : type === "textfield"
                ? ""
                : "Enter value...",
        required: false,
        options: ["select", "radio"].includes(type) ? ["Option 1", "Option 2"] : undefined,
        fileConfig:
          type === "file"
            ? {
                accept: "all",
                multiple: false,
                maxSize: 10,
              }
            : undefined,
        textConfig:
          type === "textfield"
            ? {
                fontSize: "base",
                fontWeight: "normal",
                content: "Your text content here",
              }
            : undefined,
      }

      const newForm = {
        ...form,
        sections: form.sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                groups: section.groups.map((group) =>
                  group.id === groupId ? { ...group, elements: [...group.elements, newElement] } : group,
                ),
              }
            : section,
        ),
      }
      setForm(newForm)
      setSelectedElement(newElement.id)
      setSelectedGroup(null)
      setSelectedSection(null)
    },
    [form, setForm, setSelectedElement, setSelectedGroup, setSelectedSection],
  )

  const removeElement = useCallback(
    (elementId: string, groupId: string, sectionId: string) => {
      const newForm = {
        ...form,
        sections: form.sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                groups: section.groups.map((group) =>
                  group.id === groupId
                    ? { ...group, elements: group.elements.filter((el) => el.id !== elementId) }
                    : group,
                ),
              }
            : section,
        ),
      }
      setForm(newForm)
      if (selectedElement === elementId) {
        setSelectedElement(null)
      }
    },
    [form, selectedElement, setForm, setSelectedElement],
  )

  const updateElement = useCallback(
    (elementId: string, groupId: string, sectionId: string, updates: Partial<FormElement>) => {
      const newForm = {
        ...form,
        sections: form.sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                groups: section.groups.map((group) =>
                  group.id === groupId
                    ? {
                        ...group,
                        elements: group.elements.map((el) => (el.id === elementId ? { ...el, ...updates } : el)),
                      }
                    : group,
                ),
              }
            : section,
        ),
      }
      setForm(newForm)
    },
    [form, setForm],
  )

  const moveElement = useCallback(
    (dragIndex: number, hoverIndex: number, sourceGroupId: string, targetGroupId: string) => {
      if (sourceGroupId === targetGroupId) {
        const newForm = {
          ...form,
          sections: form.sections.map((section) => ({
            ...section,
            groups: section.groups.map((group) => {
              if (group.id === sourceGroupId) {
                const newElements = [...group.elements]
                const [draggedElement] = newElements.splice(dragIndex, 1)
                newElements.splice(hoverIndex, 0, draggedElement)
                return { ...group, elements: newElements }
              }
              return group
            }),
          })),
        }
        setForm(newForm)
      } else {
        let draggedElement: FormElement | null = null

        const updatedSections = form.sections.map((section) => ({
          ...section,
          groups: section.groups.map((group) => {
            if (group.id === sourceGroupId) {
              draggedElement = group.elements[dragIndex]
              return {
                ...group,
                elements: group.elements.filter((_, index) => index !== dragIndex),
              }
            } else if (group.id === targetGroupId && draggedElement) {
              const newElements = [...group.elements]
              newElements.splice(hoverIndex, 0, draggedElement)
              return { ...group, elements: newElements }
            }
            return group
          }),
        }))

        const newForm = { ...form, sections: updatedSections }
        setForm(newForm)
      }
    },
    [form, setForm],
  )

  return {
    addElement,
    removeElement,
    updateElement,
    moveElement,
  }
}
