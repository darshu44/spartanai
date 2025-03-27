import React, { useState } from "react";
import Header from "./Header";
import FileUpload from "./FileUpload";
import CourseMapView from "./CourseMapView";
import NodeEditor from "./NodeEditor";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { AlertCircle, Info, Upload, FileText } from "lucide-react";

import QMFeedbackPanel from "./QMFeedbackPanel";

const Home = () => {
  const [currentStep, setCurrentStep] = useState<"upload" | "map">("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("");
  const [showFeedbackPanel, setShowFeedbackPanel] = useState(false);
  const [showNodeEditor, setShowNodeEditor] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");

  // Handle file upload
  const handleFileUploaded = (file: File) => {
    setSelectedFile(file);
    setUploadError("");
  };

  // Process the uploaded file
  const handleProcessFile = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProcessingProgress(10);

    try {
      // Import the parser dynamically to avoid issues with SSR
      const { parseIMSCCFile } = await import("../utils/imsccParser");

      // Start parsing the file
      setProcessingProgress(30);
      const courseData = await parseIMSCCFile(selectedFile);
      setProcessingProgress(80);

      // Store the extracted data
      localStorage.setItem("courseData", JSON.stringify(courseData));
      setProcessingProgress(100);

      // Move to the map view
      setTimeout(() => {
        setIsProcessing(false);
        setCurrentStep("map");
      }, 500);
    } catch (error) {
      console.error("Error processing file:", error);
      setUploadError(
        error instanceof Error ? error.message : "Failed to process the file",
      );
      setIsProcessing(false);
    }
  };

  // Handle node selection in the course map
  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setShowFeedbackPanel(true);
    // Uncomment the line below to also show the node editor when a node is selected
    // setShowNodeEditor(true);
  };

  // Handle module selection in the course map
  const handleModuleSelect = (moduleId: string) => {
    // Reset node selection when changing modules
    setSelectedNodeId("");
    setShowFeedbackPanel(false);
  };

  // Open node editor
  const handleOpenNodeEditor = () => {
    setShowNodeEditor(true);
  };

  // Apply suggestion from QM feedback
  const handleApplySuggestion = (nodeId: string, suggestion: string) => {
    console.log(`Applying suggestion to node ${nodeId}: ${suggestion}`);
    // In a real implementation, this would update the node data
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        {currentStep === "upload" ? (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Canvas Course Mapper</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Upload your Canvas course export to generate an interactive
                course map with Quality Matters guidelines feedback.
              </p>
            </div>

            <Tabs defaultValue="upload" className="max-w-3xl mx-auto">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Course
                </TabsTrigger>
                <TabsTrigger value="info">
                  <Info className="h-4 w-4 mr-2" />
                  About QM Guidelines
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="pt-6">
                <FileUpload
                  onFileUploaded={handleFileUploaded}
                  isUploading={isProcessing}
                  uploadProgress={processingProgress}
                  error={uploadError}
                />

                {selectedFile && !isProcessing && (
                  <div className="mt-6 flex justify-center">
                    <Button onClick={handleProcessFile} size="lg">
                      Generate Course Map
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="info" className="pt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">
                            Quality Matters Standards
                          </h3>
                          <p className="text-gray-600 mt-1">
                            Quality Matters (QM) is a faculty-centered, peer
                            review process designed to certify the quality of
                            online courses and online components.
                          </p>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                        <h4 className="font-medium flex items-center gap-2">
                          <Info className="h-4 w-4 text-blue-500" />
                          How This Tool Works
                        </h4>
                        <ul className="mt-2 space-y-2 text-sm">
                          <li className="flex gap-2">
                            <span className="font-medium">1.</span>
                            <span>Upload your Canvas course export file</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-medium">2.</span>
                            <span>
                              Our system analyzes your course structure and
                              content
                            </span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-medium">3.</span>
                            <span>
                              View an interactive module-based course map
                            </span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-medium">4.</span>
                            <span>
                              Receive QM-based feedback and recommendations
                            </span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-medium">5.</span>
                            <span>
                              Make improvements directly in the visual editor
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-md p-4">
                          <h4 className="font-medium">Key QM Standards</h4>
                          <ul className="mt-2 space-y-1 text-sm">
                            <li>Course Overview and Introduction</li>
                            <li>Learning Objectives</li>
                            <li>Assessment and Measurement</li>
                            <li>Instructional Materials</li>
                            <li>Learning Activities and Interaction</li>
                            <li>Course Technology</li>
                            <li>Learner Support</li>
                            <li>Accessibility and Usability</li>
                          </ul>
                        </div>

                        <div className="border rounded-md p-4">
                          <h4 className="font-medium">Benefits</h4>
                          <ul className="mt-2 space-y-1 text-sm">
                            <li>Identify gaps in course alignment</li>
                            <li>Improve course structure and organization</li>
                            <li>Enhance student learning experience</li>
                            <li>Prepare for QM certification</li>
                            <li>
                              Visualize connections between course elements
                            </li>
                            <li>Receive actionable improvement suggestions</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="flex h-[calc(100vh-12rem)]">
            <div className="flex-1 overflow-hidden rounded-lg border bg-white shadow">
              <CourseMapView
                courseTitle={
                  JSON.parse(localStorage.getItem("courseData") || "{}")
                    .title || "Uploaded Course"
                }
                courseCode={
                  JSON.parse(localStorage.getItem("courseData") || "{}").code ||
                  ""
                }
                modules={
                  JSON.parse(localStorage.getItem("courseData") || "{}")
                    .modules || []
                }
                onNodeSelect={handleNodeSelect}
                onModuleSelect={handleModuleSelect}
              />
            </div>

            {showFeedbackPanel && (
              <div className="w-96 ml-4">
                <QMFeedbackPanel
                  selectedNode={selectedNodeId}
                  onClose={() => setShowFeedbackPanel(false)}
                  onApplySuggestion={handleApplySuggestion}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Node Editor Dialog */}
      <NodeEditor
        open={showNodeEditor}
        onOpenChange={setShowNodeEditor}
        onSave={(data) => {
          console.log("Node saved:", data);
          setShowNodeEditor(false);
        }}
      />

      {/* Footer */}
      <footer className="bg-white border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          Canvas Course Mapper with QM Guidelines Integration ©{" "}
          {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default Home;
