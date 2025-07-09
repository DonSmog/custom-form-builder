"use client"

import { useState, useEffect } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FolderPlus, Eye, Code, Undo, Redo } from "lucide-react"
import { useRouter } from "next/navigation"

// Hooks
import { useFormBuilder } from "../hooks/useFormBuilder"
import { useFormSections } from "../hooks/useFormSections"
import { useFormGroups } from "../hooks/useFormGroups"
import { useFormElements } from "../hooks/useFormElements"
import { useFormStorage } from "../hooks/useFormStorage"

// Components
import { FormBuilderSidebar } from "../components/FormBuilderSidebar"
import { FormPreview } from "../components/FormPreview"
import { DroppableSection } from "../components/DroppableSection"
import { DroppableGroup } from "../components/DroppableGroup"
import { DraggableElement } from "../components/DraggableElement"

// Utils
import { getSelectedElement, getSelectedGroup, getSelectedSection, getLayoutClasses } from "../utils/formHelpers"

function FormBuilderContent() {
  const [previewMode, setPreviewMode] = useState(false)
  const router = useRouter()

  // Form builder state
  const {
    form,
    setForm,
    updateForm,
    loadForm,
    createNewForm,
    selectedElement,
    setSelectedElement,
    selectedGroup,
    setSelectedGroup,
    selectedSection,
    setSelectedSection,
    canUndo,
    canRedo,
    undo,
    redo,
  } = useFormBuilder()

  // Form storage
  const { saveForm, exportForm } = useFormStorage()

  // Section management
  const { addSection, removeSection, updateSection, moveSection } = useFormSections(
    form,
    setForm,
    selectedSection,
    setSelectedSection,
    setSelectedGroup,
    setSelectedElement,
  )

  // Group management
  const { addGroup, removeGroup, updateGroup, moveGroup } = useFormGroups(
    form,
    setForm,
    selectedGroup,
    setSelectedGroup,
    setSelectedSection,
    setSelectedElement,
  )

  // Element management
  const { addElement, removeElement, updateElement, moveElement } = useFormElements(
    form,
    setForm,
    selectedElement,
    setSelectedElement,
    setSelectedGroup,
    setSelectedSection,
  )

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "z" && !event.shiftKey) {
        event.preventDefault()
        undo()
      } else if ((event.ctrlKey || event.metaKey) && (event.key === "y" || (event.key === "z" && event.shiftKey))) {
        event.preventDefault()
        redo()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [undo, redo])

  // Get selected data
  const selectedElementData = getSelectedElement(form, selectedElement)
  const selectedGroupData = getSelectedGroup(form, selectedGroup)
  const selectedSectionData = getSelectedSection(form, selectedSection)

  // Handle form save
  const handleSaveForm = () => {
    const updatedForm = saveForm(form)
    setForm(updatedForm)
  }

  if (previewMode) {
    return <FormPreview form={form} onBackToEditor={() => setPreviewMode(false)} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <FormBuilderSidebar
          form={form}
          updateForm={updateForm}
          selectedElement={selectedElement}
          selectedElementData={selectedElementData}
          selectedGroup={selectedGroup}
          selectedGroupData={selectedGroupData}
          selectedSection={selectedSection}
          selectedSectionData={selectedSectionData}
          addSection={addSection}
          addGroup={addGroup}
          addElement={addElement}
          updateSection={updateSection}
          updateGroup={updateGroup}
          updateElement={updateElement}
          saveForm={handleSaveForm}
          onShowSavedForms={() => router.push("/saved-forms")}
          onCreateNewForm={createNewForm}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
        />

        {/* Main Canvas */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1 mr-4">
                <Input
                  value={form.title}
                  onChange={(e) => updateForm({ title: e.target.value })}
                  className="text-xl font-semibold border-none shadow-none p-0 h-auto"
                  placeholder="Form Title"
                />
                {form.description && <p className="text-sm text-gray-600 mt-1">{form.description}</p>}
              </div>
              <div className="flex items-center space-x-2">
                <Button onClick={undo} variant="outline" size="sm" disabled={!canUndo} title="Undo (Ctrl+Z)">
                  <Undo className="w-4 h-4" />
                </Button>
                <Button onClick={redo} variant="outline" size="sm" disabled={!canRedo} title="Redo (Ctrl+Y)">
                  <Redo className="w-4 h-4" />
                </Button>
                <Button onClick={() => setPreviewMode(true)} variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button onClick={() => exportForm(form)} variant="outline">
                  <Code className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Form Canvas */}
            <div className="space-y-6">
              {form.sections.map((section, sectionIndex) => (
                <DroppableSection
                  key={section.id}
                  section={section}
                  index={sectionIndex}
                  isSelected={selectedSection === section.id}
                  onSelect={() => {
                    setSelectedSection(section.id)
                    setSelectedGroup(null)
                    setSelectedElement(null)
                  }}
                  onRemove={() => removeSection(section.id)}
                  moveSection={moveSection}
                  moveGroup={moveGroup}
                >
                  {section.groups.map((group, groupIndex) => (
                    <DroppableGroup
                      key={group.id}
                      group={group}
                      sectionId={section.id}
                      index={groupIndex}
                      isSelected={selectedGroup === group.id}
                      onSelect={() => {
                        setSelectedGroup(group.id)
                        setSelectedSection(null)
                        setSelectedElement(null)
                      }}
                      onRemove={() => removeGroup(group.id, section.id)}
                      moveGroup={moveGroup}
                      moveElement={moveElement}
                      addElementToGroup={addElement}
                      getLayoutClasses={getLayoutClasses}
                    >
                      {group.elements.map((element, elementIndex) => (
                        <DraggableElement
                          key={element.id}
                          element={element}
                          groupId={group.id}
                          sectionId={section.id}
                          index={elementIndex}
                          moveElement={moveElement}
                          onSelect={() => {
                            setSelectedElement(element.id)
                            setSelectedGroup(null)
                            setSelectedSection(null)
                          }}
                          isSelected={selectedElement === element.id}
                          onRemove={() => removeElement(element.id, group.id, section.id)}
                        />
                      ))}
                    </DroppableGroup>
                  ))}
                </DroppableSection>
              ))}

              {form.sections.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12 text-gray-500">
                    <FolderPlus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg mb-2">Start building your form</p>
                    <p>Add sections to organize your form elements</p>
                    <Button onClick={addSection} className="mt-4">
                      Add First Section
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FormBuilder() {
  return (
    <DndProvider backend={HTML5Backend}>
      <FormBuilderContent />
    </DndProvider>
  )
}
