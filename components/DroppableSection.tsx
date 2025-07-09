"use client"

import type React from "react"
import { useDrag, useDrop } from "react-dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GripVertical, Trash2, Layers } from "lucide-react"
import type { DragDropMonitor } from "react-dnd"
import type { FormSection } from "../types/form"
import { ItemTypes } from "../constants/formElements"

interface DroppableSectionProps {
  section: FormSection
  index: number
  isSelected: boolean
  onSelect: () => void
  onRemove: () => void
  moveSection: (dragIndex: number, hoverIndex: number) => void
  moveGroup: (dragIndex: number, hoverIndex: number, sourceSectionId: string, targetSectionId: string) => void
  children: React.ReactNode
}

export function DroppableSection({
  section,
  index,
  isSelected,
  onSelect,
  onRemove,
  moveSection,
  moveGroup,
  children,
}: DroppableSectionProps) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.SECTION,
    item: { id: section.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [{ isOver }, drop] = useDrop({
    accept: [ItemTypes.SECTION, ItemTypes.GROUP],
    drop: (item: any, monitor: DragDropMonitor) => {
      if (monitor.getItemType() === ItemTypes.GROUP && item.sectionId !== section.id) {
        moveGroup(item.index, section.groups.length, item.sectionId, section.id)
      }
    },
    hover: (item: any, monitor: DragDropMonitor) => {
      if (monitor.getItemType() === ItemTypes.SECTION && item.index !== index) {
        moveSection(item.index, index)
        item.index = index
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  return (
    <Card
      ref={(node) => drag(drop(node))}
      className={`${isSelected ? "ring-2 ring-blue-500" : ""} transition-all duration-200 ${
        isOver ? "ring-2 ring-green-300 bg-green-50" : ""
      } ${isDragging ? "opacity-50" : ""}`}
    >
      <CardHeader className="cursor-pointer hover:bg-gray-50" onClick={() => onSelect()}>
        <div className="flex items-center justify-between">
          <div className="flex-1 flex items-center">
            <GripVertical className="w-4 h-4 mr-2 text-gray-400 cursor-grab" />
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center">
                <Layers className="w-4 h-4 mr-2" />
                {section.title}
              </CardTitle>
              {section.description && <p className="text-sm text-gray-600 mt-1">{section.description}</p>}
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                onRemove()
              }}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  )
}
