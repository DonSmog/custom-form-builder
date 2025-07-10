"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Download, Trash2, FileText } from "lucide-react";
import type { Form } from "../types/form";

interface SavedFormsViewProps {
  savedForms: Form[];
  onLoadForm: (form: Form) => void;
  onDeleteForm: (formId: string) => void;
  onCreateNewForm: () => void;
  onBackToEditor: () => void;
  onExportForm: (form: Form) => void;
}

export function SavedFormsView({
  savedForms,
  onLoadForm,
  onDeleteForm,
  onCreateNewForm,
  onBackToEditor,
  onExportForm,
}: SavedFormsViewProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Saved Forms</h1>
          <div className="flex items-center space-x-2">
            <Button onClick={onCreateNewForm} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              New Form
            </Button>
            <Button onClick={onBackToEditor} variant="outline">
              Back to Editor
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedForms.map((savedForm) => (
            <Card
              key={savedForm.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  {savedForm.title}
                </CardTitle>
                {savedForm.description && (
                  <p className="text-sm text-gray-600">
                    {savedForm.description}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>Sections: {savedForm.sections.length}</p>
                  <p>
                    Created:{" "}
                    {new Date(savedForm.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    Updated:{" "}
                    {new Date(savedForm.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <Button size="sm" onClick={() => onLoadForm(savedForm)}>
                    Load
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onExportForm(savedForm);
                    }}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteForm(savedForm.id);
                    }}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {savedForms.length === 0 && (
          <Card>
            <CardContent className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg mb-2">No saved forms</p>
              <p>Create and save forms to see them here</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
