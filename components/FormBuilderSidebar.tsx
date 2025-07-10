"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Trash2,
  Save,
  FileText,
  FolderPlus,
  Users,
  Layers,
  Undo,
  Redo,
} from "lucide-react";
import type { Form, FormElement, FormGroup, FormSection } from "../types/form";
import {
  elementTypes,
  layoutOptions,
  alignmentOptions,
  alignItemsOptions,
  justifyContentOptions,
  fileAcceptOptions,
  fontSizeOptions,
  fontWeightOptions,
  displayLayoutOptions,
} from "../constants/formElements";
import { DraggableElementType } from "./DraggableElementType";
import { FontSize, FontWeight, Layout } from "@/utils/formHelpers";

interface FormBuilderSidebarProps {
  form: Form;
  updateForm: (updates: Partial<Form>) => void;
  selectedElement: string | null;
  selectedElementData: {
    element: FormElement;
    groupId: string;
    sectionId: string;
  } | null;
  selectedGroup?: string | null;
  selectedGroupData: { group: FormGroup; sectionId: string } | null;
  selectedSection: string | null;
  selectedSectionData?: FormSection | null;
  addSection: () => void;
  addGroup: (sectionId: string) => void;
  addElement: (
    type: FormElement["type"],
    groupId: string,
    sectionId: string
  ) => void;
  updateSection: (sectionId: string, updates: Partial<FormSection>) => void;
  updateGroup: (
    groupId: string,
    sectionId: string,
    updates: Partial<FormGroup>
  ) => void;
  updateElement: (
    elementId: string,
    groupId: string,
    sectionId: string,
    updates: Partial<FormElement>
  ) => void;
  saveForm: () => void;
  onShowSavedForms: () => void;
  onCreateNewForm: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

export function FormBuilderSidebar({
  form,
  updateForm,
  selectedElement,
  selectedElementData,
  selectedGroup,
  selectedGroupData,
  selectedSection,
  selectedSectionData,
  addSection,
  addGroup,
  addElement,
  updateSection,
  updateGroup,
  updateElement,
  saveForm,
  onShowSavedForms,
  onCreateNewForm,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: FormBuilderSidebarProps) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <div className="space-y-4">
        {/* Form Management */}
        <div className="space-y-2">
          <Button onClick={saveForm} className="w-full" variant="default">
            <Save className="w-4 h-4 mr-2" />
            Save Form
          </Button>
          <div className="flex space-x-2">
            <Button
              onClick={onShowSavedForms}
              className="flex-1 bg-transparent"
              variant="outline"
            >
              <FileText className="w-4 h-4 mr-2" />
              Saved Forms
            </Button>
            <Button
              onClick={onCreateNewForm}
              className="flex-1 bg-transparent"
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-2" />
              New
            </Button>
          </div>

          {/* Undo/Redo Buttons */}
          <div className="flex space-x-2">
            <Button
              onClick={onUndo}
              className="flex-1 bg-transparent"
              variant="outline"
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-4 h-4 mr-2" />
              Undo
            </Button>
            <Button
              onClick={onRedo}
              className="flex-1 bg-transparent"
              variant="outline"
              disabled={!canRedo}
              title="Redo (Ctrl+Y)"
            >
              <Redo className="w-4 h-4 mr-2" />
              Redo
            </Button>
          </div>
        </div>

        <Separator />

        {/* Add Section Button */}
        <div>
          <Button
            onClick={addSection}
            className="w-full bg-transparent"
            variant="outline"
          >
            <FolderPlus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        </div>

        {/* Add Group Button */}
        <div>
          <Button
            onClick={() => {
              const targetSectionId = selectedSection || form.sections[0]?.id;
              if (targetSectionId) {
                addGroup(targetSectionId);
              }
            }}
            className="w-full bg-transparent"
            variant="outline"
            disabled={!selectedSection && form.sections.length === 0}
          >
            <Users className="w-4 h-4 mr-2" />
            Add Group
          </Button>
          {!selectedSection && form.sections.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Select a section to add groups to it
            </p>
          )}
        </div>

        <Separator />

        {/* Form Elements */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Form Elements</h2>
          <div className="grid grid-cols-1 gap-2">
            {elementTypes.map((elementType) => (
              <DraggableElementType
                key={elementType.type}
                elementType={elementType}
                onAddElement={() => {
                  // Find target group and section
                  let targetGroupId = selectedGroup;
                  let targetSectionId = selectedSection;

                  // If group is selected, find its section
                  if (targetGroupId && !targetSectionId) {
                    for (const section of form.sections) {
                      if (section.groups.find((g) => g.id === targetGroupId)) {
                        targetSectionId = section.id;
                        break;
                      }
                    }
                  }

                  // If section is selected but no group, use first group in section
                  if (targetSectionId && !targetGroupId) {
                    const section = form.sections.find(
                      (s) => s.id === targetSectionId
                    );
                    targetGroupId = section?.groups[0]?.id;
                  }

                  // If nothing selected, use first available group
                  if (!targetGroupId && !targetSectionId) {
                    const firstSection = form.sections[0];
                    const firstGroup = firstSection?.groups[0];
                    if (firstGroup && firstSection) {
                      targetGroupId = firstGroup.id;
                      targetSectionId = firstSection.id;
                    }
                  }

                  // Add element if we have both group and section
                  if (targetGroupId && targetSectionId) {
                    addElement(
                      elementType.type as FormElement["type"],
                      targetGroupId,
                      targetSectionId
                    );
                  }
                }}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Drag elements to groups or click to add to selected group
          </p>
        </div>

        <Separator />

        {/* Form Configuration */}
        <div>
          <h3 className="text-md font-semibold mb-3">Form Settings</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="form-title">Form Title</Label>
              <Input
                id="form-title"
                value={form.title}
                onChange={(e) => updateForm({ title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="form-description">Description (Optional)</Label>
              <Textarea
                id="form-description"
                value={form.description || ""}
                onChange={(e) => updateForm({ description: e.target.value })}
                placeholder="Add a description for this form..."
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Section Configuration */}
        {selectedSectionData && (
          <div>
            <h3 className="text-md font-semibold mb-3 flex items-center">
              <Layers className="w-4 h-4 mr-2" />
              Section Settings
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="section-title">Section Title</Label>
                <Input
                  id="section-title"
                  value={selectedSectionData.title}
                  onChange={(e) =>
                    updateSection(selectedSection!, { title: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="section-description">
                  Description (Optional)
                </Label>
                <Textarea
                  id="section-description"
                  value={selectedSectionData.description || ""}
                  onChange={(e) =>
                    updateSection(selectedSection!, {
                      description: e.target.value,
                    })
                  }
                  placeholder="Add a description for this section..."
                />
              </div>
              <div>
                <Label htmlFor="section-alignment">Text Alignment</Label>
                <Select
                  value={selectedSectionData.alignment || "left"}
                  onValueChange={(value) =>
                    updateSection(selectedSection!, {
                      alignment: value as FormSection["alignment"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {alignmentOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="section-align-items">Align Items</Label>
                <Select
                  value={selectedSectionData.alignItems || "start"}
                  onValueChange={(value) =>
                    updateSection(selectedSection!, {
                      alignItems: value as FormSection["alignItems"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {alignItemsOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="section-justify-content">Justify Content</Label>
                <Select
                  value={selectedSectionData.justifyContent || "start"}
                  onValueChange={(value) =>
                    updateSection(selectedSection!, {
                      justifyContent: value as FormSection["justifyContent"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {justifyContentOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Group Configuration */}
        {selectedGroupData && (
          <div>
            <h3 className="text-md font-semibold mb-3 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Group Settings
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="group-title">Group Title</Label>
                <Input
                  id="group-title"
                  value={selectedGroupData.group.title}
                  onChange={(e) =>
                    updateGroup(selectedGroup!, selectedGroupData.sectionId, {
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="group-description">
                  Description (Optional)
                </Label>
                <Textarea
                  id="group-description"
                  value={selectedGroupData.group.description || ""}
                  onChange={(e) =>
                    updateGroup(selectedGroup!, selectedGroupData.sectionId, {
                      description: e.target.value,
                    })
                  }
                  placeholder="Add a description for this group..."
                />
              </div>
              <div>
                <Label htmlFor="group-layout">Layout</Label>
                <Select
                  value={selectedGroupData.group.layout}
                  onValueChange={(value) =>
                    updateGroup(selectedGroup!, selectedGroupData.sectionId, {
                      layout: value as FormGroup["layout"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {layoutOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="group-alignment">Text Alignment</Label>
                <Select
                  value={selectedGroupData.group.alignment || "left"}
                  onValueChange={(value) =>
                    updateGroup(selectedGroup!, selectedGroupData.sectionId, {
                      alignment: value as FormGroup["alignment"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {alignmentOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="group-align-items">Align Items</Label>
                <Select
                  value={selectedGroupData.group.alignItems || "start"}
                  onValueChange={(value) =>
                    updateGroup(selectedGroup!, selectedGroupData.sectionId, {
                      alignItems: value as FormGroup["alignItems"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {alignItemsOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="group-justify-content">Justify Content</Label>
                <Select
                  value={selectedGroupData.group.justifyContent || "start"}
                  onValueChange={(value) =>
                    updateGroup(selectedGroup!, selectedGroupData.sectionId, {
                      justifyContent: value as FormGroup["justifyContent"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {justifyContentOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Element Configuration */}
        {selectedElementData && (
          <div>
            <h3 className="text-md font-semibold mb-3">Element Settings</h3>
            <div className="space-y-4">
              {selectedElementData.element.type !== "textfield" && (
                <div>
                  <Label htmlFor="element-label">Label</Label>
                  <Input
                    id="element-label"
                    value={selectedElementData.element.label}
                    onChange={(e) =>
                      updateElement(
                        selectedElement!,
                        selectedElementData.groupId,
                        selectedElementData.sectionId,
                        {
                          label: e.target.value,
                        }
                      )
                    }
                  />
                </div>
              )}

              {selectedElementData.element.type !== "checkbox" &&
                selectedElementData.element.type !== "textfield" &&
                selectedElementData.element.type !== "file" && (
                  <div>
                    <Label htmlFor="element-placeholder">Placeholder</Label>
                    <Input
                      id="element-placeholder"
                      value={selectedElementData.element.placeholder || ""}
                      onChange={(e) =>
                        updateElement(
                          selectedElement!,
                          selectedElementData.groupId,
                          selectedElementData.sectionId,
                          {
                            placeholder: e.target.value,
                          }
                        )
                      }
                    />
                  </div>
                )}

              {selectedElementData.element.type !== "textfield" && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="element-required"
                    checked={selectedElementData.element.required}
                    onCheckedChange={(checked) =>
                      updateElement(
                        selectedElement!,
                        selectedElementData.groupId,
                        selectedElementData.sectionId,
                        {
                          required: checked,
                        }
                      )
                    }
                  />
                  <Label htmlFor="element-required">Required field</Label>
                </div>
              )}

              {/* Display Layout Configuration for Checkbox and Radio */}
              {(selectedElementData.element.type === "checkbox" ||
                selectedElementData.element.type === "radio") && (
                <div>
                  <Label htmlFor="display-layout">Display Layout</Label>
                  <Select
                    value={
                      selectedElementData.element.displayConfig?.layout ||
                      "vertical"
                    }
                    onValueChange={(value) =>
                      updateElement(
                        selectedElement!,
                        selectedElementData.groupId,
                        selectedElementData.sectionId,
                        {
                          displayConfig: {
                            ...selectedElementData.element.displayConfig,
                            layout: value as Layout,
                          },
                        }
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select display layout" />
                    </SelectTrigger>
                    <SelectContent>
                      {displayLayoutOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* File Upload Configuration */}
              {selectedElementData.element.type === "file" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="file-accept">Accepted File Types</Label>
                    <Select
                      value={
                        selectedElementData.element.fileConfig?.accept || "all"
                      }
                      onValueChange={(value) =>
                        updateElement(
                          selectedElement!,
                          selectedElementData.groupId,
                          selectedElementData.sectionId,
                          {
                            fileConfig: {
                              ...selectedElementData.element.fileConfig,
                              accept: value === "all" ? "" : value,
                            },
                          }
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select file types" />
                      </SelectTrigger>
                      <SelectContent>
                        {fileAcceptOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="file-max-size">Max File Size (MB)</Label>
                    <Input
                      id="file-max-size"
                      type="number"
                      min="1"
                      max="100"
                      value={
                        selectedElementData.element.fileConfig?.maxSize || 10
                      }
                      onChange={(e) =>
                        updateElement(
                          selectedElement!,
                          selectedElementData.groupId,
                          selectedElementData.sectionId,
                          {
                            fileConfig: {
                              ...selectedElementData.element.fileConfig,
                              maxSize: Number.parseInt(e.target.value) || 10,
                            },
                          }
                        )
                      }
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="file-multiple"
                      checked={
                        selectedElementData.element.fileConfig?.multiple ||
                        false
                      }
                      onCheckedChange={(checked) =>
                        updateElement(
                          selectedElement!,
                          selectedElementData.groupId,
                          selectedElementData.sectionId,
                          {
                            fileConfig: {
                              ...selectedElementData.element.fileConfig,
                              multiple: checked,
                            },
                          }
                        )
                      }
                    />
                    <Label htmlFor="file-multiple">Allow multiple files</Label>
                  </div>
                </div>
              )}

              {/* Text Field Configuration */}
              {selectedElementData.element.type === "textfield" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="text-content">Text Content</Label>
                    <Textarea
                      id="text-content"
                      value={
                        selectedElementData.element.textConfig?.content || ""
                      }
                      onChange={(e) =>
                        updateElement(
                          selectedElement!,
                          selectedElementData.groupId,
                          selectedElementData.sectionId,
                          {
                            textConfig: {
                              ...selectedElementData.element.textConfig,
                              content: e.target.value,
                            },
                          }
                        )
                      }
                      placeholder="Enter your text content..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="text-font-size">Font Size</Label>
                    <Select
                      value={
                        selectedElementData.element.textConfig?.fontSize ||
                        "base"
                      }
                      onValueChange={(value) =>
                        updateElement(
                          selectedElement!,
                          selectedElementData.groupId,
                          selectedElementData.sectionId,
                          {
                            textConfig: {
                              ...selectedElementData.element.textConfig,
                              fontSize: value as FontSize,
                            },
                          }
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select font size" />
                      </SelectTrigger>
                      <SelectContent>
                        {fontSizeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="text-font-weight">Font Weight</Label>
                    <Select
                      value={
                        selectedElementData.element.textConfig?.fontWeight ||
                        "normal"
                      }
                      onValueChange={(value) =>
                        updateElement(
                          selectedElement!,
                          selectedElementData.groupId,
                          selectedElementData.sectionId,
                          {
                            textConfig: {
                              ...selectedElementData.element.textConfig,
                              fontWeight: value as FontWeight,
                            },
                          }
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select font weight" />
                      </SelectTrigger>
                      <SelectContent>
                        {fontWeightOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Options Configuration for Select, Radio, and Checkbox */}
              {(selectedElementData.element.type === "select" ||
                selectedElementData.element.type === "radio" ||
                selectedElementData.element.type === "checkbox") && (
                <div>
                  <Label>Options</Label>
                  <div className="space-y-2">
                    {selectedElementData.element.options?.map(
                      (option, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <Input
                            value={option}
                            onChange={(e) => {
                              const newOptions = [
                                ...(selectedElementData.element.options || []),
                              ];
                              newOptions[index] = e.target.value;
                              updateElement(
                                selectedElement!,
                                selectedElementData.groupId,
                                selectedElementData.sectionId,
                                {
                                  options: newOptions,
                                }
                              );
                            }}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                              const newOptions =
                                selectedElementData.element.options?.filter(
                                  (_, i) => i !== index
                                );
                              updateElement(
                                selectedElement!,
                                selectedElementData.groupId,
                                selectedElementData.sectionId,
                                {
                                  options: newOptions,
                                }
                              );
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newOptions = [
                          ...(selectedElementData.element.options || []),
                          `Option ${
                            (selectedElementData.element.options?.length || 0) +
                            1
                          }`,
                        ];
                        updateElement(
                          selectedElement!,
                          selectedElementData.groupId,
                          selectedElementData.sectionId,
                          {
                            options: newOptions,
                          }
                        );
                      }}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Option
                    </Button>
                  </div>

                  {/* Show helper text for checkbox options */}
                  {selectedElementData.element.type === "checkbox" && (
                    <p className="text-xs text-gray-500 mt-2">
                      Leave options empty for a single checkbox, or add options
                      for multiple checkboxes
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
