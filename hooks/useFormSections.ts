"use client";
import { useCallback } from "react";
import type { Form, FormSection } from "../types/form";

export function useFormSections(
  form: Form,
  setForm: (form: Form) => void, // Changed from React.Dispatch<React.SetStateAction<Form>>
  selectedSection: string | null,
  setSelectedSection: (id: string | null) => void,
  setSelectedGroup: (id: string | null) => void,
  setSelectedElement: (id: string | null) => void
) {
  const addSection = useCallback(() => {
    const newSection: FormSection = {
      id: `section-${Date.now()}`,
      title: `Section ${form.sections.length + 1}`,
      description: "",
      alignItems: "stretch",
      groups: [
        {
          id: `group-${Date.now()}`,
          title: "Group 1",
          description: "",
          alignItems: "stretch",
          layout: "single",
          elements: [],
        },
      ],
    };
    const newForm = {
      ...form,
      sections: [...form.sections, newSection],
    };
    setForm(newForm);
    setSelectedSection(newSection.id);
    setSelectedGroup(null);
    setSelectedElement(null);
  }, [form, setForm, setSelectedSection, setSelectedGroup, setSelectedElement]);

  const removeSection = useCallback(
    (sectionId: string) => {
      if (form.sections.length === 1) return;
      const newForm = {
        ...form,
        sections: form.sections.filter((section) => section.id !== sectionId),
      };
      setForm(newForm);
      if (selectedSection === sectionId) {
        setSelectedSection(null);
      }
    },
    [form, selectedSection, setForm, setSelectedSection]
  );

  const updateSection = useCallback(
    (sectionId: string, updates: Partial<FormSection>) => {
      const newForm = {
        ...form,
        sections: form.sections.map((section) =>
          section.id === sectionId ? { ...section, ...updates } : section
        ),
      };
      setForm(newForm);
    },
    [form, setForm]
  );

  const moveSection = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const newSections = [...form.sections];
      const [draggedSection] = newSections.splice(dragIndex, 1);
      newSections.splice(hoverIndex, 0, draggedSection);
      const newForm = { ...form, sections: newSections };
      setForm(newForm);
    },
    [form, setForm]
  );

  return {
    addSection,
    removeSection,
    updateSection,
    moveSection,
  };
}
