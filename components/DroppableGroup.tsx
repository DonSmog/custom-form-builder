"use client";

import type React from "react";
import { useDrag, useDrop } from "react-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Trash2, Users, Plus } from "lucide-react";
import type { DropTargetMonitor } from "react-dnd";
import type { FormElement, FormGroup } from "../types/form";
import {
  ItemTypes,
  layoutOptions,
  alignmentOptions,
  alignItemsOptions,
  justifyContentOptions,
} from "../constants/formElements";
import {
  getAlignItemsClasses,
  getJustifyContentClasses,
  getLayoutStyles,
} from "@/utils/formHelpers";
import { useRef } from "react";

interface DroppableGroupProps {
  group: FormGroup;
  sectionId: string;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  moveGroup: (
    dragIndex: number,
    hoverIndex: number,
    sourceSectionId: string,
    targetSectionId: string
  ) => void;
  moveElement: (
    dragIndex: number,
    hoverIndex: number,
    sourceGroupId: string,
    targetGroupId: string
  ) => void;
  addElementToGroup: (
    elementType: FormElement["type"],
    groupId: string,
    sectionId: string
  ) => void;
  children: React.ReactNode;
  getLayoutClasses: (layout: FormGroup["layout"]) => string;
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
  });

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: [ItemTypes.ELEMENT_TYPE, ItemTypes.ELEMENT, ItemTypes.GROUP],
    drop: (item: any, monitor: DropTargetMonitor) => {
      if (monitor.getItemType() === ItemTypes.ELEMENT_TYPE) {
        addElementToGroup(item.elementType, group.id, sectionId);
      } else if (monitor.getItemType() === ItemTypes.ELEMENT) {
        if (item.groupId !== group.id) {
          moveElement(
            item.index,
            group.elements.length,
            item.groupId,
            group.id
          );
        }
      }
    },
    hover: (item: any, monitor: DropTargetMonitor) => {
      if (
        monitor.getItemType() === ItemTypes.GROUP &&
        item.sectionId === sectionId &&
        item.index !== index
      ) {
        moveGroup(item.index, index, item.sectionId, sectionId);
        item.index = index;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  // Get alignment classes
  const getAlignmentClasses = (alignment: FormGroup["alignment"]) => {
    switch (alignment) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  const layoutStyle = getLayoutStyles(group, group.layout);
  const flexClasses =
    group.layout === "single"
      ? `${getAlignItemsClasses(group.alignItems)} ${getJustifyContentClasses(
          group.justifyContent
        )}`
      : "";

  const ref = useRef<HTMLDivElement>(null);
  drag(drop(ref));

  return (
    <Card
      ref={ref}
      className={`${
        isSelected ? "ring-2 ring-green-500" : "border-gray-200"
      } transition-all duration-200 ${
        isOver && canDrop ? "ring-2 ring-blue-300 bg-blue-50" : ""
      } ${isDragging ? "opacity-50" : ""}`}
    >
      <CardHeader
        className="cursor-pointer hover:bg-gray-50 py-3"
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 flex items-center">
            <GripVertical className="w-4 h-4 mr-2 text-gray-400 cursor-grab" />
            <div className={`flex-1 ${getAlignmentClasses(group.alignment)}`}>
              <CardTitle className="text-md flex items-center justify-start">
                <Users className="w-4 h-4 mr-2" />
                {group.title}
              </CardTitle>
              {group.description && (
                <p className="text-xs text-gray-500 mt-1">
                  {group.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-1 flex-wrap">
            <Badge variant="outline" className="text-xs">
              {layoutOptions.find((l) => l.value === group.layout)?.label}
            </Badge>
            {group.alignment && group.alignment !== "left" && (
              <Badge variant="outline" className="text-xs">
                {
                  alignmentOptions.find((a) => a.value === group.alignment)
                    ?.label
                }
              </Badge>
            )}
            {group.alignItems && group.alignItems !== "start" && (
              <Badge variant="outline" className="text-xs">
                AI:{" "}
                {
                  alignItemsOptions.find((a) => a.value === group.alignItems)
                    ?.label
                }
              </Badge>
            )}
            {group.justifyContent && group.justifyContent !== "start" && (
              <Badge variant="outline" className="text-xs">
                JC:{" "}
                {
                  justifyContentOptions.find(
                    (j) => j.value === group.justifyContent
                  )?.label
                }
              </Badge>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className={`pt-0 ${getAlignmentClasses(group.alignment)}`}>
        {group.elements.length === 0 ? (
          <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            <Plus className="w-6 h-6 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Drop elements here</p>
            <p className="text-xs">
              Drag elements from the sidebar or select this group to add
              elements
            </p>
          </div>
        ) : (
          <div
            className={`${getLayoutClasses(group.layout)} ${flexClasses}`}
            style={layoutStyle}
          >
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
