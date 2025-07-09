"use client"

import { useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { FormElement } from "../types/form"

interface FormRendererProps {
  element: FormElement
  isPreview?: boolean
}

export function FormRenderer({ element, isPreview = false }: FormRendererProps) {
  const renderFormElement = useCallback(() => {
    const commonProps = {
      id: element.id,
      placeholder: element.placeholder,
      required: element.required,
      className: "w-full",
    }

    switch (element.type) {
      case "text":
      case "email":
      case "tel":
      case "number":
      case "date":
        return <Input type={element.type} {...commonProps} />

      case "textarea":
        return <Textarea {...commonProps} />

      case "textfield":
        const fontSize = element.textConfig?.fontSize || "base"
        const fontWeight = element.textConfig?.fontWeight || "normal"
        const content = element.textConfig?.content || element.label

        return (
          <div
            className={`text-${fontSize} font-${fontWeight} text-gray-900`}
            style={{
              fontSize:
                fontSize === "xs"
                  ? "12px"
                  : fontSize === "sm"
                    ? "14px"
                    : fontSize === "base"
                      ? "16px"
                      : fontSize === "lg"
                        ? "18px"
                        : fontSize === "xl"
                          ? "20px"
                          : fontSize === "2xl"
                            ? "24px"
                            : fontSize === "3xl"
                              ? "30px"
                              : fontSize === "4xl"
                                ? "36px"
                                : "16px",
              fontWeight:
                fontWeight === "normal"
                  ? "400"
                  : fontWeight === "medium"
                    ? "500"
                    : fontWeight === "semibold"
                      ? "600"
                      : fontWeight === "bold"
                        ? "700"
                        : fontWeight === "extrabold"
                          ? "800"
                          : "400",
            }}
          >
            {content}
          </div>
        )

      case "select":
        return (
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={element.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {element.options?.map((option, index) => (
                <SelectItem key={index} value={option.toLowerCase().replace(/\s+/g, "-")}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "checkbox":
        const checkboxLayout = element.displayConfig?.layout || "vertical"

        // If checkbox has options, render multiple checkboxes
        if (element.options && element.options.length > 0) {
          return (
            <div className={checkboxLayout === "horizontal" ? "flex flex-wrap gap-4" : "space-y-2"}>
              {element.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox id={`${element.id}-${index}`} />
                  <Label htmlFor={`${element.id}-${index}`}>{option}</Label>
                </div>
              ))}
            </div>
          )
        } else {
          // Single checkbox (original behavior)
          return (
            <div className="flex items-center space-x-2">
              <Checkbox id={element.id} />
              <Label htmlFor={element.id}>{element.label}</Label>
            </div>
          )
        }

      case "radio":
        const radioLayout = element.displayConfig?.layout || "vertical"

        return (
          <RadioGroup className={radioLayout === "horizontal" ? "flex flex-wrap gap-4" : "space-y-2"}>
            {element.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option.toLowerCase().replace(/\s+/g, "-")} id={`${element.id}-${index}`} />
                <Label htmlFor={`${element.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "file":
        return (
          <div className="space-y-2">
            <Input
              type="file"
              {...commonProps}
              accept={element.fileConfig?.accept === "all" ? "" : element.fileConfig?.accept || ""}
              multiple={element.fileConfig?.multiple || false}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {element.fileConfig && (
              <div className="text-xs text-gray-500">
                {element.fileConfig.accept && element.fileConfig.accept !== "all" && (
                  <p>Accepted: {element.fileConfig.accept}</p>
                )}
                {element.fileConfig.maxSize && <p>Max size: {element.fileConfig.maxSize}MB</p>}
                {element.fileConfig.multiple && <p>Multiple files allowed</p>}
              </div>
            )}
          </div>
        )

      default:
        return <Input {...commonProps} />
    }
  }, [element])

  return renderFormElement()
}
