import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Download, Save, FileDown, Share2 } from "lucide-react";

interface ExportControlsProps {
  onSave?: () => void;
  onExport?: (format: string) => void;
  onShare?: () => void;
  exportFormats?: string[];
  disabled?: boolean;
}

const ExportControls: React.FC<ExportControlsProps> = ({
  onSave = () => console.log("Save clicked"),
  onExport = (format) => console.log(`Export as ${format} clicked`),
  onShare = () => console.log("Share clicked"),
  exportFormats = ["PDF", "PNG", "JSON", "Canvas Package"],
  disabled = false,
}) => {
  const [selectedFormat, setSelectedFormat] = useState(exportFormats[0]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 w-full max-w-md">
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-medium">Export Controls</h3>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onSave}
            disabled={disabled}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Progress
          </Button>

          <Button
            variant="outline"
            onClick={() => onShare()}
            disabled={disabled}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Export Format</label>
          <div className="flex items-center gap-2">
            <Select
              value={selectedFormat}
              onValueChange={setSelectedFormat}
              disabled={disabled}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                {exportFormats.map((format) => (
                  <SelectItem key={format} value={format}>
                    {format}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={() => onExport(selectedFormat)}
              disabled={disabled}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              disabled={disabled}
              className="w-full flex items-center gap-2"
            >
              <FileDown className="h-4 w-4" />
              Quick Export Options
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Export Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {exportFormats.map((format) => (
              <DropdownMenuItem key={format} onClick={() => onExport(format)}>
                Export as {format}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ExportControls;
