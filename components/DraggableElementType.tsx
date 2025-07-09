"use client";

import { useDrag } from "react-dnd";
import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";
import { ItemTypes } from "../constants/formElements";

interface DraggableElementTypeProps {
  elementType: any;
  onAddElement: () => void;
}

export function DraggableElementType({
  elementType,
  onAddElement,
}: DraggableElementTypeProps) {
  const Icon = elementType.icon;

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ELEMENT_TYPE,
    item: { elementType: elementType.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <Button
      ref={drag}
      variant="outline"
      className={`justify-start h-auto p-3 bg-transparent cursor-grab active:cursor-grabbing ${
        isDragging ? "opacity-50" : ""
      }`}
      onClick={onAddElement}
    >
      <GripVertical className="w-4 h-4 mr-2 text-gray-400" />
      <Icon className="w-4 h-4 mr-2" />
      <span className="text-sm">{elementType.label}</span>
    </Button>
  );
}
