"use client";
import { useCallback } from "react";
import type { Form, FormGroup } from "../types/form";

export function useFormGroups(
  form: Form,
  setForm: (form: Form) => void, // Changed from React.Dispatch<React.SetStateAction<Form>>
  selectedGroup: string | null,
  setSelectedGroup: (id: string | null) => void,
  setSelectedSection: (id: string | null) => void,
  setSelectedElement: (id: string | null) => void
) {
  const addGroup = useCallback(
    (sectionId: string) => {
      const section = form.sections.find((s) => s.id === sectionId);
      if (!section) return;

      const newGroup: FormGroup = {
        id: `group-${Date.now()}`,
        title: `Group ${section.groups.length + 1}`,
        description: "",
        alignItems: "stretch",
        layout: "single",
        elements: [],
      };

      const newForm = {
        ...form,
        sections: form.sections.map((s) =>
          s.id === sectionId ? { ...s, groups: [...s.groups, newGroup] } : s
        ),
      };
      setForm(newForm);
      setSelectedGroup(newGroup.id);
      setSelectedSection(null);
      setSelectedElement(null);
    },
    [form, setForm, setSelectedGroup, setSelectedSection, setSelectedElement]
  );

  const removeGroup = useCallback(
    (groupId: string, sectionId: string) => {
      const section = form.sections.find((s) => s.id === sectionId);
      if (!section || section.groups.length === 1) return;

      const newForm = {
        ...form,
        sections: form.sections.map((s) =>
          s.id === sectionId
            ? { ...s, groups: s.groups.filter((g) => g.id !== groupId) }
            : s
        ),
      };
      setForm(newForm);
      if (selectedGroup === groupId) {
        setSelectedGroup(null);
      }
    },
    [form, selectedGroup, setForm, setSelectedGroup]
  );

  const updateGroup = useCallback(
    (groupId: string, sectionId: string, updates: Partial<FormGroup>) => {
      const newForm = {
        ...form,
        sections: form.sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                groups: section.groups.map((group) =>
                  group.id === groupId ? { ...group, ...updates } : group
                ),
              }
            : section
        ),
      };
      setForm(newForm);
    },
    [form, setForm]
  );

  const moveGroup = useCallback(
    (
      dragIndex: number,
      hoverIndex: number,
      sourceSectionId: string,
      targetSectionId: string
    ) => {
      if (sourceSectionId === targetSectionId) {
        const newForm = {
          ...form,
          sections: form.sections.map((section) => {
            if (section.id === sourceSectionId) {
              const newGroups = [...section.groups];
              const [draggedGroup] = newGroups.splice(dragIndex, 1);
              newGroups.splice(hoverIndex, 0, draggedGroup);
              return { ...section, groups: newGroups };
            }
            return section;
          }),
        };
        setForm(newForm);
      } else {
        const sourceSection = form.sections.find(
          (s) => s.id === sourceSectionId
        );
        const draggedGroup = sourceSection?.groups[dragIndex];

        if (!draggedGroup) return;

        const newForm = {
          ...form,
          sections: form.sections.map((section) => {
            if (section.id === sourceSectionId) {
              return {
                ...section,
                groups: section.groups.filter(
                  (_, index) => index !== dragIndex
                ),
              };
            } else if (section.id === targetSectionId) {
              const newGroups = [...section.groups];
              newGroups.splice(hoverIndex, 0, draggedGroup);
              return { ...section, groups: newGroups };
            }
            return section;
          }),
        };
        setForm(newForm);
      }
    },
    [form, setForm]
  );

  return {
    addGroup,
    removeGroup,
    updateGroup,
    moveGroup,
  };
}
