"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Download, Trash2, FileText, ArrowLeft } from "lucide-react";
import type { Form } from "../../types/form";
import { useFormStorage } from "../../hooks/useFormStorage";
import { saveCurrentFormToStorage } from "../../utils/storage";
import toast from "react-hot-toast";

export default function SavedFormsPage() {
  const router = useRouter();
  const { savedForms, deleteForm, exportForm } = useFormStorage();

  // Handle loading a form
  const handleLoadForm = (form: Form) => {
    // Save the selected form as the current form
    saveCurrentFormToStorage(form);
    // Navigate back to the main editor
    router.push("/");
  };

  // Handle creating a new form
  const handleCreateNewForm = () => {
    const newForm: Form = {
      id: `form-${Date.now()}`,
      title: "Untitled Form",
      sections: [
        {
          id: `section-${Date.now()}`,
          title: "Section 1",
          description: "",
          groups: [
            {
              id: `group-${Date.now()}`,
              title: "Group 1",
              description: "",
              layout: "single",
              elements: [],
            },
          ],
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save the new form as the current form
    saveCurrentFormToStorage(newForm);
    // Navigate to the main editor
    router.push("/");
  };

  // Handle deleting a form
  const handleDeleteForm = (formId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this form? This action cannot be undone."
      )
    ) {
      deleteForm(formId);
      toast.success("Form Deleted");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-[80vw] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Editor
            </Button>
            <h1 className="text-2xl font-bold">Saved Forms</h1>
          </div>
          <Button onClick={handleCreateNewForm} variant="default">
            <Plus className="w-4 h-4 mr-2" />
            New Form
          </Button>
        </div>

        {savedForms.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg mb-2">No saved forms</p>
              <p className="mb-4">Create and save forms to see them here</p>
              <Button onClick={handleCreateNewForm}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Form
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedForms.map((savedForm) => (
              <Card
                key={savedForm.id}
                className="hover:shadow-lg transition-shadow duration-200"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    <span className="truncate">{savedForm.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Form Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                      <div>
                        <span className="font-medium">Sections:</span>{" "}
                        {savedForm.sections.length}
                      </div>
                      <div>
                        <span className="font-medium">Elements:</span>{" "}
                        {savedForm.sections.reduce(
                          (total, section) =>
                            total +
                            section.groups.reduce(
                              (groupTotal, group) =>
                                groupTotal + group.elements.length,
                              0
                            ),
                          0
                        )}
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="text-xs text-gray-400 space-y-1">
                      <p>
                        Created:{" "}
                        {new Date(savedForm.createdAt).toLocaleDateString()}
                      </p>
                      <p>
                        Updated:{" "}
                        {new Date(savedForm.updatedAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <Button
                        size="sm"
                        onClick={() => handleLoadForm(savedForm)}
                        className="flex-1 mr-2"
                      >
                        Load Form
                      </Button>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            exportForm(savedForm);
                          }}
                          title="Export Form"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteForm(savedForm.id);
                          }}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          title="Delete Form"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
