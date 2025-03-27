import React, { useState } from "react";
import { cn } from "../lib/utils";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Button } from "./ui/button";
import {
  AlertCircle,
  CheckCircle,
  Info,
  X,
  ExternalLink,
  Lightbulb,
} from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface QMGuideline {
  id: string;
  standard: string;
  description: string;
  status: "met" | "partially-met" | "not-met";
  feedback: string;
  recommendations: string[];
}

interface FeedbackItem {
  nodeId: string;
  nodeName: string;
  nodeType: "objective" | "activity" | "assessment";
  complianceScore: number;
  guidelines: QMGuideline[];
}

interface QMFeedbackPanelProps {
  selectedNode?: string;
  feedbackItems?: FeedbackItem[];
  onClose?: () => void;
  onApplySuggestion?: (nodeId: string, suggestion: string) => void;
}

const QMFeedbackPanel = ({
  selectedNode = "node-1",
  feedbackItems = defaultFeedbackItems,
  onClose = () => {},
  onApplySuggestion = () => {},
}: QMFeedbackPanelProps) => {
  const [activeTab, setActiveTab] = useState<string>("guidelines");

  const selectedFeedback =
    feedbackItems.find((item) => item.nodeId === selectedNode) ||
    feedbackItems[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "met":
        return "bg-green-100 text-green-800 border-green-300";
      case "partially-met":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "not-met":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "met":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "partially-met":
        return <Info className="h-4 w-4 text-amber-600" />;
      case "not-met":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-md h-full bg-white border rounded-lg shadow-lg flex flex-col overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h3 className="text-lg font-semibold">QM Feedback</h3>
          <p className="text-sm text-gray-500">{selectedFeedback.nodeName}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                "px-2 py-1",
                getNodeTypeColor(selectedFeedback.nodeType),
              )}
            >
              {selectedFeedback.nodeType.charAt(0).toUpperCase() +
                selectedFeedback.nodeType.slice(1)}
            </Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>QM compliance score based on applicable guidelines</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="text-sm font-medium">
            {selectedFeedback.complianceScore}% Compliant
          </div>
        </div>
        <Progress value={selectedFeedback.complianceScore} className="h-2" />
      </div>

      <Tabs
        defaultValue="guidelines"
        className="flex-1 flex flex-col"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-2 mx-4 mt-2">
          <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="guidelines" className="flex-1 p-0">
          <ScrollArea className="h-[calc(100%-1rem)] p-4">
            <Accordion type="single" collapsible className="w-full">
              {selectedFeedback.guidelines.map((guideline) => (
                <AccordionItem key={guideline.id} value={guideline.id}>
                  <AccordionTrigger className="py-3">
                    <div className="flex items-center gap-2 text-left">
                      {getStatusIcon(guideline.status)}
                      <span className="font-medium">{guideline.standard}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-1">
                      <p className="text-sm">{guideline.description}</p>
                      <div className="p-3 rounded-md border text-sm bg-gray-50">
                        <p className="font-medium mb-1">Feedback:</p>
                        <p>{guideline.feedback}</p>
                      </div>

                      {guideline.recommendations.length > 0 && (
                        <div>
                          <p className="font-medium text-sm mb-1">
                            Recommendations:
                          </p>
                          <ul className="space-y-2">
                            {guideline.recommendations.map((rec, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex justify-end">
                        <Button variant="outline" size="sm" className="text-xs">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View QM Standard
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="recommendations" className="flex-1 p-0">
          <ScrollArea className="h-[calc(100%-1rem)] p-4">
            <div className="space-y-4">
              <h4 className="font-medium">Suggested Improvements</h4>

              {getAllRecommendations(selectedFeedback).map((rec, idx) => (
                <div
                  key={idx}
                  className="p-3 border rounded-md bg-amber-50 border-amber-200"
                >
                  <div className="flex gap-2 mb-2">
                    <Lightbulb className="h-5 w-5 text-amber-500 flex-shrink-0" />
                    <p className="text-sm">{rec}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() =>
                        onApplySuggestion(selectedFeedback.nodeId, rec)
                      }
                    >
                      Apply Suggestion
                    </Button>
                  </div>
                </div>
              ))}

              {getAllRecommendations(selectedFeedback).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                  <p>All guidelines have been met for this element!</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <div className="p-4 border-t bg-gray-50">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {getGuidelineStatusCounts(selectedFeedback)}
          </div>
          <Button size="sm" variant="default">
            View All Guidelines
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Helper functions
const getNodeTypeColor = (type: string) => {
  switch (type) {
    case "objective":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "activity":
      return "bg-purple-100 text-purple-800 border-purple-300";
    case "assessment":
      return "bg-orange-100 text-orange-800 border-orange-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

const getAllRecommendations = (feedbackItem: FeedbackItem) => {
  return feedbackItem.guidelines
    .filter((g) => g.status !== "met")
    .flatMap((g) => g.recommendations);
};

const getGuidelineStatusCounts = (feedbackItem: FeedbackItem) => {
  const met = feedbackItem.guidelines.filter((g) => g.status === "met").length;
  const partiallyMet = feedbackItem.guidelines.filter(
    (g) => g.status === "partially-met",
  ).length;
  const notMet = feedbackItem.guidelines.filter(
    (g) => g.status === "not-met",
  ).length;

  return `${met} Met · ${partiallyMet} Partially Met · ${notMet} Not Met`;
};

// Default mock data
const defaultFeedbackItems: FeedbackItem[] = [
  {
    nodeId: "node-1",
    nodeName: "Learning Objective 1.1",
    nodeType: "objective",
    complianceScore: 75,
    guidelines: [
      {
        id: "qm-2.1",
        standard: "QM Standard 2.1",
        description:
          "The course learning objectives, or course/program competencies, describe outcomes that are measurable.",
        status: "met",
        feedback:
          "The learning objective uses measurable action verbs and clearly states what students will be able to do.",
        recommendations: [],
      },
      {
        id: "qm-2.2",
        standard: "QM Standard 2.2",
        description:
          "The module/unit learning objectives or competencies describe outcomes that are measurable and consistent with the course-level objectives.",
        status: "partially-met",
        feedback:
          "The objective is measurable but could be more clearly aligned with course-level objectives.",
        recommendations: [
          "Revise the objective to explicitly connect to course-level objective #3.",
          "Add specific criteria for how students will demonstrate mastery of this objective.",
        ],
      },
      {
        id: "qm-2.5",
        standard: "QM Standard 2.5",
        description:
          "The learning objectives or competencies are stated clearly, are written from the learner's perspective, and are prominently located in the course.",
        status: "not-met",
        feedback:
          "The objective is not written from the learner's perspective and is buried within the module content.",
        recommendations: [
          'Rewrite the objective to use "Students will be able to..." format.',
          "Move the objective to the beginning of the module and highlight it visually.",
        ],
      },
    ],
  },
  {
    nodeId: "node-2",
    nodeName: "Discussion Activity 1.2",
    nodeType: "activity",
    complianceScore: 60,
    guidelines: [
      {
        id: "qm-5.1",
        standard: "QM Standard 5.1",
        description:
          "The learning activities promote the achievement of the stated learning objectives or competencies.",
        status: "partially-met",
        feedback:
          "The discussion activity is related to the learning objective but doesn't fully support achievement of all aspects.",
        recommendations: [
          "Modify discussion prompts to directly address all components of Learning Objective 1.1.",
          "Add a reflection component that asks students to connect their discussion to the learning objective.",
        ],
      },
      {
        id: "qm-5.2",
        standard: "QM Standard 5.2",
        description:
          "Learning activities provide opportunities for interaction that support active learning.",
        status: "met",
        feedback:
          "The discussion format effectively promotes student-to-student interaction and active engagement with the content.",
        recommendations: [],
      },
      {
        id: "qm-5.3",
        standard: "QM Standard 5.3",
        description:
          "The instructor's plan for classroom response time and feedback on assignments is clearly stated.",
        status: "not-met",
        feedback:
          "There is no information about when or how the instructor will provide feedback on discussion contributions.",
        recommendations: [
          "Add explicit information about when students can expect instructor feedback.",
          "Include details about the format and criteria for instructor feedback.",
        ],
      },
    ],
  },
  {
    nodeId: "node-3",
    nodeName: "Quiz Assessment 1.3",
    nodeType: "assessment",
    complianceScore: 85,
    guidelines: [
      {
        id: "qm-3.1",
        standard: "QM Standard 3.1",
        description:
          "The assessments measure the stated learning objectives or competencies.",
        status: "met",
        feedback:
          "The quiz questions directly align with and measure the stated learning objective.",
        recommendations: [],
      },
      {
        id: "qm-3.2",
        standard: "QM Standard 3.2",
        description:
          "The course grading policy is stated clearly at the beginning of the course.",
        status: "met",
        feedback:
          "The weight of this assessment in the overall course grade is clearly stated.",
        recommendations: [],
      },
      {
        id: "qm-3.3",
        standard: "QM Standard 3.3",
        description:
          "Specific and descriptive criteria are provided for the evaluation of learners' work, and their connection to the course grading policy is clearly explained.",
        status: "partially-met",
        feedback:
          "While point values are assigned to questions, there are no descriptive criteria for how partial credit might be awarded.",
        recommendations: [
          "Add rubric or scoring criteria for questions that might receive partial credit.",
          "Provide examples of complete vs. partial answers to help students understand expectations.",
        ],
      },
    ],
  },
];

export default QMFeedbackPanel;
