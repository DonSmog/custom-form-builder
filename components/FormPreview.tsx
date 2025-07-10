"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import type { Form } from "../types/form";
import { FormRenderer } from "./FormRenderer";
import { getLayoutClasses, getLayoutStyles } from "../utils/formHelpers";

interface FormPreviewProps {
  form: Form;
  onBackToEditor: () => void;
}

export function FormPreview({ form, onBackToEditor }: FormPreviewProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-[80vw] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{form.title} Preview</h1>
          <Button onClick={onBackToEditor} variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Edit Form
          </Button>
        </div>

        <Card>
          <CardContent className="space-y-8">
            <div className="space-y-6">
              {form.sections.map((section) => {
                return (
                  <div key={section.id} className="space-y-6">
                    <CardHeader className="px-0 py-4">
                      <CardTitle>{section.title}</CardTitle>
                      {section.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {section.description}
                        </p>
                      )}
                    </CardHeader>

                    {section.groups.map((group) => {
                      const layoutStyle = getLayoutStyles(group, group.layout);

                      return (
                        <div
                          key={group.id}
                          className={getLayoutClasses(group.layout)}
                          style={layoutStyle}
                        >
                          {group.elements.map((element) => (
                            <div key={element.id} className="space-y-2">
                              {element.type !== "checkbox" &&
                                element.type !== "textfield" && (
                                  <Label htmlFor={element.id}>
                                    {element.label}
                                    {element.required && (
                                      <span className="text-red-500 ml-1">
                                        *
                                      </span>
                                    )}
                                  </Label>
                                )}
                              <FormRenderer
                                element={element}
                                isPreview={true}
                              />
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center items-center">
              <Button className="w-fit">Submit Form</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
