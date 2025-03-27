import React, { useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { CheckCircle, AlertCircle, Circle, ChevronRight } from "lucide-react";

interface QMComplianceStatus {
  status: "compliant" | "partial" | "non-compliant";
  score: number;
}

interface Module {
  id: string;
  name: string;
  qmCompliance: QMComplianceStatus;
  objectives: number;
  activities: number;
  assessments: number;
}

interface ModuleSelectorProps {
  modules: Module[];
  selectedModuleId: string;
  onModuleSelect: (moduleId: string) => void;
}

const ModuleSelector = ({
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
  selectedModuleId = "module-1",
  onModuleSelect = () => {},
}: ModuleSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredModules = modules.filter((module) =>
    module.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getComplianceIcon = (status: QMComplianceStatus["status"]) => {
    switch (status) {
      case "compliant":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "partial":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "non-compliant":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getComplianceText = (status: QMComplianceStatus) => {
    switch (status.status) {
      case "compliant":
        return `QM Compliant (${status.score}%)`;
      case "partial":
        return `Partially Compliant (${status.score}%)`;
      case "non-compliant":
        return `Non-Compliant (${status.score}%)`;
      default:
        return "Not Evaluated";
    }
  };

  const getComplianceColor = (status: QMComplianceStatus["status"]) => {
    switch (status) {
      case "compliant":
        return "bg-green-100 text-green-800 border-green-300";
      case "partial":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "non-compliant":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <Card className="h-full w-full bg-white border-r">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Course Modules</CardTitle>
        <div className="relative">
          <input
            type="text"
            placeholder="Search modules..."
            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <div className="space-y-2 p-4">
            {filteredModules.length > 0 ? (
              filteredModules.map((module) => (
                <div
                  key={module.id}
                  className={`p-3 rounded-md cursor-pointer transition-colors border ${module.id === selectedModuleId ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50 border-gray-200"}`}
                  onClick={() => onModuleSelect(module.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getComplianceIcon(module.qmCompliance.status)}
                      <span className="font-medium">{module.name}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge
                            variant="outline"
                            className={getComplianceColor(
                              module.qmCompliance.status,
                            )}
                          >
                            {module.qmCompliance.score}%
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{getComplianceText(module.qmCompliance)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-800 border-blue-200"
                    >
                      {module.objectives} Objectives
                    </Badge>

                    <Badge
                      variant="outline"
                      className="bg-purple-50 text-purple-800 border-purple-200"
                    >
                      {module.activities} Activities
                    </Badge>

                    <Badge
                      variant="outline"
                      className="bg-orange-50 text-orange-800 border-orange-200"
                    >
                      {module.assessments} Assessments
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No modules found matching your search.
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <Button className="w-full" variant="outline">
            View Course Overview
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleSelector;
