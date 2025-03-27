import React, { useState } from "react";
import ModuleSelector from "./ModuleSelector";
import FlowCanvas from "./FlowCanvas";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Download, ZoomIn, ZoomOut, Save, Share2 } from "lucide-react";

interface Module {
  id: string;
  name: string;
  qmCompliance: {
    status: "compliant" | "partial" | "non-compliant";
    score: number;
  };
  objectives: number;
  activities: number;
  assessments: number;
}

interface CourseMapViewProps {
  courseTitle?: string;
  courseCode?: string;
  modules?: Module[];
  onNodeSelect?: (nodeId: string) => void;
  onModuleSelect?: (moduleId: string) => void;
  readOnly?: boolean;
}

const CourseMapView = ({
  courseTitle = "Introduction to Educational Technology",
  courseCode = "EDU 101",
  modules = [
    {
      id: "module-1",
      name: "Module 1: Introduction to Course",
      qmCompliance: { status: "compliant", score: 92 },
      objectives: 3,
      activities: 5,
      assessments: 2,
    },
    {
      id: "module-2",
      name: "Module 2: Theoretical Foundations",
      qmCompliance: { status: "partial", score: 78 },
      objectives: 4,
      activities: 6,
      assessments: 3,
    },
    {
      id: "module-3",
      name: "Module 3: Applied Concepts",
      qmCompliance: { status: "non-compliant", score: 45 },
      objectives: 5,
      activities: 4,
      assessments: 2,
    },
    {
      id: "module-4",
      name: "Module 4: Advanced Topics",
      qmCompliance: { status: "partial", score: 65 },
      objectives: 6,
      activities: 8,
      assessments: 4,
    },
    {
      id: "module-5",
      name: "Module 5: Final Project",
      qmCompliance: { status: "compliant", score: 88 },
      objectives: 2,
      activities: 3,
      assessments: 1,
    },
  ],
  onNodeSelect = () => {},
  onModuleSelect = () => {},
  readOnly = false,
}: CourseMapViewProps) => {
  const [selectedModuleId, setSelectedModuleId] = useState(
    modules[0]?.id || "",
  );
  const [activeTab, setActiveTab] = useState("map");
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleModuleSelect = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    onModuleSelect(moduleId);
  };

  const handleNodeSelect = (nodeId: string) => {
    onNodeSelect(nodeId);
  };

  const handleZoomIn = () => {
    setZoomLevel(Math.min(zoomLevel + 10, 150));
  };

  const handleZoomOut = () => {
    setZoomLevel(Math.max(zoomLevel - 10, 50));
  };

  const selectedModule = modules.find(
    (module) => module.id === selectedModuleId,
  );

  // Calculate overall QM compliance score
  const overallScore = Math.round(
    modules.reduce((sum, module) => sum + module.qmCompliance.score, 0) /
      modules.length,
  );

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* Course header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{courseTitle}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-600">{courseCode}</span>
              <Separator orientation="vertical" className="h-4" />
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {modules.length} Modules
              </Badge>
              <Badge
                variant="outline"
                className={`${
                  overallScore >= 85
                    ? "bg-green-50 text-green-700"
                    : overallScore >= 70
                      ? "bg-amber-50 text-amber-700"
                      : "bg-red-50 text-red-700"
                }`}
              >
                QM Score: {overallScore}%
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex gap-1">
              <Save size={16} />
              <span>Save</span>
            </Button>
            <Button variant="outline" size="sm" className="flex gap-1">
              <Download size={16} />
              <span>Export</span>
            </Button>
            <Button variant="outline" size="sm" className="flex gap-1">
              <Share2 size={16} />
              <span>Share</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Module selector */}
        <div className="w-80 border-r">
          <ModuleSelector
            modules={modules}
            selectedModuleId={selectedModuleId}
            onModuleSelect={handleModuleSelect}
          />
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Module header */}
          <div className="p-4 border-b flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">
                {selectedModule?.name || "Select a module"}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {selectedModule?.objectives || 0} Objectives
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-700"
                >
                  {selectedModule?.activities || 0} Activities
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-orange-50 text-orange-700"
                >
                  {selectedModule?.assessments || 0} Assessments
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleZoomOut}>
                <ZoomOut size={18} />
              </Button>
              <span className="text-sm">{zoomLevel}%</span>
              <Button variant="ghost" size="icon" onClick={handleZoomIn}>
                <ZoomIn size={18} />
              </Button>
            </div>
          </div>

          {/* Tabs and content */}
          <div className="flex-1 overflow-hidden">
            <Tabs
              defaultValue="map"
              value={activeTab}
              onValueChange={setActiveTab}
              className="h-full flex flex-col"
            >
              <div className="px-4 border-b">
                <TabsList>
                  <TabsTrigger value="map">Map View</TabsTrigger>
                  <TabsTrigger value="list">List View</TabsTrigger>
                  <TabsTrigger value="qm">QM Analysis</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent
                value="map"
                className="flex-1 overflow-hidden p-0 m-0"
              >
                <div
                  className="h-full"
                  style={{
                    transform: `scale(${zoomLevel / 100})`,
                    transformOrigin: "center center",
                  }}
                >
                  <FlowCanvas
                    moduleId={selectedModuleId}
                    onNodeSelect={handleNodeSelect}
                    readOnly={readOnly}
                  />
                </div>
              </TabsContent>

              <TabsContent
                value="list"
                className="flex-1 overflow-auto p-4 m-0"
              >
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Module Elements List View
                    </h3>
                    <p className="text-gray-500">
                      This view shows all module elements in a list format for
                      easier scanning and editing.
                    </p>

                    {/* Placeholder for list view content */}
                    <div className="mt-4 space-y-4">
                      <div className="p-3 border rounded-md">
                        <div className="flex justify-between">
                          <div>
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 mb-2"
                            >
                              Objective
                            </Badge>
                            <p>
                              Students will be able to identify key components
                              of the course structure
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700"
                          >
                            QM Compliant
                          </Badge>
                        </div>
                      </div>

                      <div className="p-3 border rounded-md">
                        <div className="flex justify-between">
                          <div>
                            <Badge
                              variant="outline"
                              className="bg-purple-50 text-purple-700 mb-2"
                            >
                              Activity
                            </Badge>
                            <p>Discussion: Canvas Course Structure Analysis</p>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-amber-50 text-amber-700"
                          >
                            Needs Improvement
                          </Badge>
                        </div>
                      </div>

                      <div className="p-3 border rounded-md">
                        <div className="flex justify-between">
                          <div>
                            <Badge
                              variant="outline"
                              className="bg-orange-50 text-orange-700 mb-2"
                            >
                              Assessment
                            </Badge>
                            <p>Quiz: Course Structure Identification</p>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-amber-50 text-amber-700"
                          >
                            Needs Improvement
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="qm" className="flex-1 overflow-auto p-4 m-0">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Quality Matters Analysis
                    </h3>
                    <p className="text-gray-500">
                      This view provides a detailed analysis of how this module
                      aligns with Quality Matters standards.
                    </p>

                    {/* QM score overview */}
                    <div className="mt-6 mb-8">
                      <h4 className="text-md font-medium mb-2">
                        Module QM Score
                      </h4>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className={`h-4 rounded-full ${
                            selectedModule?.qmCompliance.score >= 85
                              ? "bg-green-500"
                              : selectedModule?.qmCompliance.score >= 70
                                ? "bg-amber-500"
                                : "bg-red-500"
                          }`}
                          style={{
                            width: `${selectedModule?.qmCompliance.score || 0}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1 text-sm">
                        <span>0%</span>
                        <span className="font-medium">
                          {selectedModule?.qmCompliance.score || 0}%
                        </span>
                        <span>100%</span>
                      </div>
                    </div>

                    {/* Placeholder for QM standards analysis */}
                    <div className="space-y-4">
                      <div className="p-3 border rounded-md">
                        <h5 className="font-medium">
                          QM Standard 2.1: Learning Objectives
                        </h5>
                        <p className="text-sm mt-1 mb-2">
                          The module learning objectives describe outcomes that
                          are measurable.
                        </p>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700"
                        >
                          Meets Standard
                        </Badge>
                      </div>

                      <div className="p-3 border rounded-md">
                        <h5 className="font-medium">
                          QM Standard 2.2: Learning Objectives Alignment
                        </h5>
                        <p className="text-sm mt-1 mb-2">
                          The module learning objectives are aligned with
                          course-level objectives.
                        </p>
                        <Badge
                          variant="outline"
                          className="bg-amber-50 text-amber-700"
                        >
                          Partially Meets Standard
                        </Badge>
                        <p className="text-sm mt-2 text-amber-700">
                          Recommendation: Explicitly connect module objectives
                          to course-level outcomes.
                        </p>
                      </div>

                      <div className="p-3 border rounded-md">
                        <h5 className="font-medium">
                          QM Standard 5.1: Learning Activities
                        </h5>
                        <p className="text-sm mt-1 mb-2">
                          Learning activities promote achievement of stated
                          learning objectives.
                        </p>
                        <Badge
                          variant="outline"
                          className="bg-amber-50 text-amber-700"
                        >
                          Partially Meets Standard
                        </Badge>
                        <p className="text-sm mt-2 text-amber-700">
                          Recommendation: Add more specific instructions to the
                          discussion activity.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseMapView;
