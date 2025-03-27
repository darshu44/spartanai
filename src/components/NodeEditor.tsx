import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  description: z.string().optional(),
  nodeType: z.enum(["objective", "activity", "assessment"], {
    required_error: "Please select a node type",
  }),
  qmAlignment: z.enum(["aligned", "partially-aligned", "not-aligned"], {
    required_error: "Please select QM alignment status",
  }),
});

type NodeEditorProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  node?: {
    id: string;
    type: string;
    data: {
      title: string;
      description?: string;
      nodeType: "objective" | "activity" | "assessment";
      qmAlignment: "aligned" | "partially-aligned" | "not-aligned";
    };
  };
  onSave?: (data: z.infer<typeof formSchema>) => void;
};

const NodeEditor = ({
  open = true,
  onOpenChange = () => {},
  node = {
    id: "default-node",
    type: "default",
    data: {
      title: "Node Title",
      description: "Node description goes here",
      nodeType: "objective" as const,
      qmAlignment: "partially-aligned" as const,
    },
  },
  onSave = () => {},
}: NodeEditorProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: node.data.title,
      description: node.data.description || "",
      nodeType: node.data.nodeType,
      qmAlignment: node.data.qmAlignment,
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {node.id === "default-node" ? "Add New Node" : "Edit Node"}
          </DialogTitle>
          <DialogDescription>
            Modify the node properties to align with Quality Matters guidelines.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter node title" {...field} />
                  </FormControl>
                  <FormDescription>
                    The title that will appear in the node.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter node description"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Detailed information about this node.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nodeType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Node Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select node type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="objective">
                          Learning Objective
                        </SelectItem>
                        <SelectItem value="activity">Activity</SelectItem>
                        <SelectItem value="assessment">Assessment</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The type of element this node represents.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="qmAlignment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>QM Alignment</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select alignment status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="aligned">Aligned with QM</SelectItem>
                        <SelectItem value="partially-aligned">
                          Partially Aligned
                        </SelectItem>
                        <SelectItem value="not-aligned">Not Aligned</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How well this element aligns with Quality Matters
                      standards.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-medium mb-2">
                QM Guidelines Preview
              </h3>
              <div className="text-sm text-gray-600">
                {form.watch("nodeType") === "objective" && (
                  <p>
                    <strong>QM Standard 2.1:</strong> The course learning
                    objectives, or course/program competencies, describe
                    outcomes that are measurable.
                  </p>
                )}
                {form.watch("nodeType") === "activity" && (
                  <p>
                    <strong>QM Standard 5.1:</strong> The learning activities
                    promote the achievement of the stated learning objectives or
                    competencies.
                  </p>
                )}
                {form.watch("nodeType") === "assessment" && (
                  <p>
                    <strong>QM Standard 3.1:</strong> The assessments measure
                    the stated learning objectives or competencies.
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {node.id === "default-node" ? "Add Node" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NodeEditor;
