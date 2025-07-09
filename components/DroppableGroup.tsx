"use client"

import type React from "react"
import { useDrag, useDrop } from "react-dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GripVertical, Trash2, Users, Plus } from "lucide-react"
import type { DragDropMonitor } from "react-dnd"
import type { FormGroup } from "../types/form"
import { ItemTypes, layoutOptions } from "../constants/formElements"

interface DroppableGroupProps {
  group: FormGroup
  sectionId: string
  index: number
  isSelected: boolean
  onSelect: () => void
  onRemove: () => void
  moveGroup: (dragIndex: number, hoverIndex: number, sourceSectionId: string, targetSectionId: string) => void
  moveElement: (dragIndex: number, hoverIndex: number, sourceGroupId: string, targetGroupId: string) => void
  addElementToGroup: (elementType: string, groupId: string, sectionId: string) => void
  children: React.ReactNode
  getLayoutClasses: (layout: FormGroup["layout"]) => string
}

export function DroppableGroup({
  group,
  sectionId,
  index,
  isSelected,
  onSelect,
  onRemove,
  moveGroup,
  moveElement,
  addElementToGroup,
  children,
  getLayoutClasses,
}: DroppableGroupProps) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.GROUP,
    item: { id: group.id, index, sectionId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: [ItemTypes.ELEMENT_TYPE, ItemTypes.ELEMENT, ItemTypes.GROUP],
    drop: (item: any, monitor: DragDropMonitor) => {
      if (monitor.getItemType() === ItemTypes.ELEMENT_TYPE) {
        addElementToGroup(item.elementType, group.id, sectionId)
      } else if (monitor.getItemType() === ItemTypes.ELEMENT) {
        if (item.groupId !== group.id) {
          moveElement(item.index, group.elements.length, item.groupId, group.id)
        }
      }
    },
    hover: (item: any, monitor: DragDropMonitor) => {
      if (monitor.getItemType() === ItemTypes.GROUP && item.sectionId === sectionId && item.index !== index) {
        moveGroup(item.index, index, item.sectionId, sectionId)
        item.index = index
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  // Get layout styles with fallback
  const getLayoutStyles = (layout: FormGroup["layout"]) => {
    switch (layout) {
      case "two-column":
        return {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
        }
      case "three-column":
        return {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
        }
      default:
        return {
          display: "flex",
          flexDirection: "column" as const,
          gap: "1rem",
        }
    }
  }

  return (
    <Card
      ref={(node) => drag(drop(node))}
      className={`${isSelected ? "ring-2 ring-green-500" : "border-gray-200"} transition-all duration-200 ${
        isOver && canDrop ? "ring-2 ring-blue-300 bg-blue-50" : ""
      } ${isDragging ? "opacity-50" : ""}`}
    >
      <CardHeader
        className="cursor-pointer hover:bg-gray-50 py-3"
        onClick={(e) => {
          e.stopPropagation()
          onSelect()
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 flex items-center">
            <GripVertical className="w-4 h-4 mr-2 text-gray-400 cursor-grab" />
            <div className="flex-1">
              <CardTitle className="text-md flex items-center">
                <Users className="w-4 h-4 mr-2" />
                {group.title}
              </CardTitle>
              {group.description && <p className="text-xs text-gray-500 mt-1">{group.description}</p>}
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Badge variant="outline" className="text-xs">
              {layoutOptions.find((l) => l.value === group.layout)?.label}
            </Badge>
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
      <CardContent className="pt-0">
        {group.elements.length === 0 ? (
          <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            <Plus className="w-6 h-6 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Drop elements here</p>
            <p className="text-xs">Drag elements from the sidebar or select this group to add elements</p>
          </div>
        ) : (
          <div className={getLayoutClasses(group.layout)} style={getLayoutStyles(group.layout)}>
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
