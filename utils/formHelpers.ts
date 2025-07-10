import type { Form, FormGroup } from "../types/form";

export const getSelectedElement = (
  form: Form,
  selectedElement: string | null
) => {
  for (const section of form.sections) {
    for (const group of section.groups) {
      const element = group.elements.find((el) => el.id === selectedElement);
      if (element) return { element, groupId: group.id, sectionId: section.id };
    }
  }
  return null;
};

export const getSelectedGroup = (form: Form, selectedGroup: string | null) => {
  for (const section of form.sections) {
    const group = section.groups.find((g) => g.id === selectedGroup);
    if (group) return { group, sectionId: section.id };
  }
  return null;
};

export const getSelectedSection = (
  form: Form,
  selectedSection: string | null
) => {
  return form.sections.find((section) => section.id === selectedSection);
};

export const getLayoutClasses = (layout: FormGroup["layout"]) => {
  switch (layout) {
    case "two-column":
      return "grid grid-cols-1 sm:grid-cols-2 gap-4";
    case "three-column":
      return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4";
    case "four-column":
      return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4";
    default:
      return "space-y-4";
  }
};

export const getAlignItemsClasses = (alignItems: FormGroup["alignItems"]) => {
  switch (alignItems) {
    case "center":
      return "items-center";
    case "end":
      return "items-end";
    case "stretch":
      return "items-stretch";
    default:
      return "items-start";
  }
};

export const getJustifyContentClasses = (
  justifyContent: FormGroup["justifyContent"]
) => {
  switch (justifyContent) {
    case "center":
      return "justify-center";
    case "end":
      return "justify-end";
    case "between":
      return "justify-between";
    case "around":
      return "justify-around";
    case "evenly":
      return "justify-evenly";
    default:
      return "justify-start";
  }
};

export const getLayoutStyles = (
  group: FormGroup,
  layout: FormGroup["layout"]
) => {
  switch (layout) {
    case "two-column":
    case "three-column":
    case "four-column":
      return {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit)",
        gap: "1rem",
        alignItems: group.alignItems || "start",
        justifyContent: group.justifyContent || "start",
      };
    default:
      return {
        display: "flex",
        flexDirection: "column" as const,
        gap: "1rem",
      };
  }
};

export type FontSize =
  | "xs"
  | "sm"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl";

export type FontWeight =
  | "normal"
  | "medium"
  | "semibold"
  | "bold"
  | "extrabold";

export type Layout = "horizontal" | "vertical";
