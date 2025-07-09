"use client";

import { useDrag, useDrop } from "react-dnd";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { GripVertical, Trash2 } from "lucide-react";
import type { DropTargetMonitor } from "react-dnd";
import type { FormElement } from "../types/form";
import { ItemTypes, elementTypes } from "../constants/formElements";
import { FormRenderer } from "./FormRenderer";
import { useRef } from "react";

interface DraggableElementProps {
  element: FormElement;
  groupId: string;
  sectionId: string;
  index: number;
  moveElement: (
    dragIndex: number,
    hoverIndex: number,
    sourceGroupId: string,
    targetGroupId: string
  ) => void;
  onSelect: () => void;
  isSelected: boolean;
  onRemove: () => void;
}

export function DraggableElement({
  element,
  groupId,
  sectionId,
  index,
  moveElement,
  onSelect,
  isSelected,
  onRemove,
}: DraggableElementProps) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ELEMENT,
    item: { id: element.id, index, groupId, sectionId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.ELEMENT,
    hover: (
      item: { id: string; index: number; groupId: string; sectionId: string },
      monitor: DropTargetMonitor
    ) => {
      if (item.groupId === groupId && item.index !== index) {
        moveElement(item.index, index, item.groupId, groupId);
        item.index = index;
      }
    },
  });

  const ref = useRef<HTMLDivElement>(null);
  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`group relative p-3 border-2 border-dashed rounded-lg transition-colors cursor-grab active:cursor-grabbing ${
        isSelected
          ? "border-purple-500 bg-purple-50"
          : "border-gray-200 hover:border-gray-300"
      } ${isDragging ? "opacity-50" : ""}`}
      onClick={onSelect}
    >
      {/* Element Controls */}
      <div className="absolute top-1 right-1 flex items-center space-x-1">
        <GripVertical className="w-3 h-3 text-gray-400" />
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          size="sm"
          variant="ghost"
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>

      {/* Element Badge */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-1">
          <Badge variant="secondary" className="text-xs">
            {elementTypes.find((et) => et.type === element.type)?.label}
          </Badge>
          {element.required && (
            <Badge variant="destructive" className="text-xs">
              Required
            </Badge>
          )}
        </div>
      </div>

      {/* Element Preview */}
      <div className="space-y-2">
        {element.type !== "checkbox" && (
          <Label htmlFor={element.id} className="text-sm">
            {element.label}
            {element.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}
        <FormRenderer element={element} />
      </div>
    </div>
  );
}
