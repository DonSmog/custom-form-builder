"use client"

import type React from "react"
import { useDrag, useDrop } from "react-dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GripVertical, Trash2, Layers } from "lucide-react"
import type { DragDropMonitor } from "react-dnd"
import type { FormSection } from "../types/form"
import { ItemTypes, alignmentOptions, alignItemsOptions, justifyContentOptions } from "../constants/formElements"

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

  // Get alignment classes
  const getAlignmentClasses = (alignment: FormSection["alignment"]) => {
    switch (alignment) {
      case "center":
        return "text-center"
      case "right":
        return "text-right"
      default:
        return "text-left"
    }
  }

  // Get flexbox classes for align items
  const getAlignItemsClasses = (alignItems: FormSection["alignItems"]) => {
    switch (alignItems) {
      case "center":
        return "items-center"
      case "end":
        return "items-end"
      case "stretch":
        return "items-stretch"
      default:
        return "items-start"
    }
  }

  // Get flexbox classes for justify content
  const getJustifyContentClasses = (justifyContent: FormSection["justifyContent"]) => {
    switch (justifyContent) {
      case "center":
        return "justify-center"
      case "end":
        return "justify-end"
      case "between":
        return "justify-between"
      case "around":
        return "justify-around"
      case "evenly":
        return "justify-evenly"
      default:
        return "justify-start"
    }
  }

  const sectionContentClasses = `space-y-4 flex flex-col ${getAlignmentClasses(section.alignment)} ${getAlignItemsClasses(section.alignItems)} ${getJustifyContentClasses(section.justifyContent)}`

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
            <div className={`flex-1 ${getAlignmentClasses(section.alignment)}`}>
              <CardTitle className="text-lg flex items-center justify-start">
                <Layers className="w-4 h-4 mr-2" />
                {section.title}
              </CardTitle>
              {section.description && <p className="text-sm text-gray-600 mt-1">{section.description}</p>}
            </div>
          </div>
          <div className="flex items-center space-x-1 flex-wrap">
            {section.alignment && section.alignment !== "left" && (
              <Badge variant="outline" className="text-xs">
                {alignmentOptions.find((a) => a.value === section.alignment)?.label}
              </Badge>
            )}
            {section.alignItems && section.alignItems !== "start" && (
              <Badge variant="outline" className="text-xs">
                AI: {alignItemsOptions.find((a) => a.value === section.alignItems)?.label}
              </Badge>
            )}
            {section.justifyContent && section.justifyContent !== "start" && (
              <Badge variant="outline" className="text-xs">
                JC: {justifyContentOptions.find((j) => j.value === section.justifyContent)?.label}
              </Badge>
            )}
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
      <CardContent className={sectionContentClasses}>{children}</CardContent>
    </Card>
  )
}
