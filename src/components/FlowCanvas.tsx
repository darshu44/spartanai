import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Panel,
  NodeTypes,
  ConnectionLineType,
} from "reactflow";
import "reactflow/dist/style.css";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  AlertCircle,
  CheckCircle,
  Info,
  Edit,
  Plus,
  Trash2,
  Link,
  Unlink,
} from "lucide-react";

// Custom node types
const ObjectiveNode = ({ data, isConnectable }: any) => {
  return (
    <Card className="p-3 min-w-[250px] border-l-4 border-l-blue-500 bg-white shadow-md">
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-sm">Learning Objective</h3>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
          Objective
        </Badge>
      </div>
      <p className="mt-2 text-sm">
        {data.content ||
          "Students will be able to identify key components of the course structure"}
      </p>
      <div className="flex mt-3 gap-1 justify-end">
        {data.qmStatus === "warning" && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-amber-500"
                >
                  <AlertCircle size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  QM Warning: Objective needs more specificity
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {data.qmStatus === "success" && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-green-500"
                >
                  <CheckCircle size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">QM Compliant: Well-defined objective</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Edit size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Edit objective</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </Card>
  );
};

const ActivityNode = ({ data, isConnectable }: any) => {
  return (
    <Card className="p-3 min-w-[250px] border-l-4 border-l-purple-500 bg-white shadow-md">
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-sm">Learning Activity</h3>
        <Badge
          variant="outline"
          className="bg-purple-50 text-purple-700 text-xs"
        >
          Activity
        </Badge>
      </div>
      <p className="mt-2 text-sm">
        {data.content || "Discussion: Canvas Course Structure Analysis"}
      </p>
      <div className="flex mt-3 gap-1 justify-end">
        {data.qmStatus === "warning" && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-amber-500"
                >
                  <AlertCircle size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  QM Warning: Activity needs clearer instructions
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {data.qmStatus === "success" && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-green-500"
                >
                  <CheckCircle size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">QM Compliant: Well-designed activity</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Edit size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Edit activity</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </Card>
  );
};

const AssessmentNode = ({ data, isConnectable }: any) => {
  return (
    <Card className="p-3 min-w-[250px] border-l-4 border-l-orange-500 bg-white shadow-md">
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-sm">Assessment</h3>
        <Badge
          variant="outline"
          className="bg-orange-50 text-orange-700 text-xs"
        >
          Assessment
        </Badge>
      </div>
      <p className="mt-2 text-sm">
        {data.content || "Quiz: Course Structure Identification"}
      </p>
      <div className="flex mt-3 gap-1 justify-end">
        {data.qmStatus === "warning" && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-amber-500"
                >
                  <AlertCircle size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  QM Warning: Assessment needs alignment with objectives
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {data.qmStatus === "success" && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-green-500"
                >
                  <CheckCircle size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">QM Compliant: Well-aligned assessment</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Edit size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Edit assessment</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </Card>
  );
};

// Define node types
const nodeTypes: NodeTypes = {
  objective: ObjectiveNode,
  activity: ActivityNode,
  assessment: AssessmentNode,
};

// Sample initial data
const initialNodes: Node[] = [
  {
    id: "objective-1",
    type: "objective",
    position: { x: 250, y: 50 },
    data: {
      content:
        "Students will be able to identify key components of the course structure",
      qmStatus: "success",
    },
  },
  {
    id: "activity-1",
    type: "activity",
    position: { x: 100, y: 200 },
    data: {
      content: "Discussion: Canvas Course Structure Analysis",
      qmStatus: "warning",
    },
  },
  {
    id: "activity-2",
    type: "activity",
    position: { x: 400, y: 200 },
    data: {
      content: "Reading: Quality Matters Standards Guide",
      qmStatus: "success",
    },
  },
  {
    id: "assessment-1",
    type: "assessment",
    position: { x: 250, y: 350 },
    data: {
      content: "Quiz: Course Structure Identification",
      qmStatus: "warning",
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "objective-1",
    target: "activity-1",
    animated: true,
    type: "smoothstep",
  },
  {
    id: "e1-3",
    source: "objective-1",
    target: "activity-2",
    animated: true,
    type: "smoothstep",
  },
  {
    id: "e2-4",
    source: "activity-1",
    target: "assessment-1",
    animated: true,
    type: "smoothstep",
  },
  {
    id: "e3-4",
    source: "activity-2",
    target: "assessment-1",
    animated: true,
    type: "smoothstep",
  },
];

interface FlowCanvasProps {
  moduleId?: string;
  onNodeSelect?: (nodeId: string) => void;
  readOnly?: boolean;
}

const FlowCanvas = ({
  moduleId = "1",
  onNodeSelect = () => {},
  readOnly = false,
}: FlowCanvasProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Handle node click
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setSelectedNode(node.id);
      onNodeSelect(node.id);
    },
    [onNodeSelect],
  );

  // Handle connection between nodes
  const onConnect = useCallback(
    (params: any) => {
      setEdges((eds) => [
        ...eds,
        {
          ...params,
          animated: true,
          type: "smoothstep",
          id: `e${params.source}-${params.target}`,
        },
      ]);
    },
    [setEdges],
  );

  // Add new node
  const addNode = useCallback(
    (type: "objective" | "activity" | "assessment") => {
      const newId = `${type}-${nodes.length + 1}`;
      const newNode: Node = {
        id: newId,
        type,
        position: { x: 250, y: nodes.length * 100 + 50 },
        data: { content: "", qmStatus: "warning" },
      };
      setNodes((nds) => [...nds, newNode]);
      setSelectedNode(newId);
      onNodeSelect(newId);
    },
    [nodes, setNodes, onNodeSelect],
  );

  // Delete selected node
  const deleteSelectedNode = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode));
      setEdges((eds) =>
        eds.filter(
          (edge) =>
            edge.source !== selectedNode && edge.target !== selectedNode,
        ),
      );
      setSelectedNode(null);
    }
  }, [selectedNode, setNodes, setEdges]);

  // Load module data when moduleId changes
  useEffect(() => {
    // In a real implementation, this would fetch data based on moduleId
    console.log(`Loading module data for module ${moduleId}`);
    // For now, we'll just use our initial data
  }, [moduleId]);

  return (
    <div className="w-full h-full bg-gray-50" ref={reactFlowWrapper}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
          attributionPosition="bottom-right"
        >
          <Background color="#f0f0f0" gap={16} size={1} />
          <Controls />
          <MiniMap nodeStrokeWidth={3} zoomable pannable />
          {!readOnly && (
            <Panel
              position="top-right"
              className="bg-white p-2 rounded-md shadow-md"
            >
              <div className="flex flex-col gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => addNode("objective")}
                        variant="outline"
                        size="sm"
                        className="flex gap-1"
                      >
                        <Plus size={14} />
                        <span>Objective</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Add new learning objective</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => addNode("activity")}
                        variant="outline"
                        size="sm"
                        className="flex gap-1"
                      >
                        <Plus size={14} />
                        <span>Activity</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Add new learning activity</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => addNode("assessment")}
                        variant="outline"
                        size="sm"
                        className="flex gap-1"
                      >
                        <Plus size={14} />
                        <span>Assessment</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Add new assessment</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {selectedNode && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={deleteSelectedNode}
                          variant="outline"
                          size="sm"
                          className="flex gap-1 text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Delete selected node</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </Panel>
          )}
          <Panel
            position="bottom-left"
            className="bg-white p-2 rounded-md shadow-md"
          >
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>QM Compliant</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span>Needs Improvement</span>
              </div>
            </div>
          </Panel>
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default FlowCanvas;
