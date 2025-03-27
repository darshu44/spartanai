import React from "react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  BookOpen,
  HelpCircle,
  LogOut,
  Menu,
  Save,
  Settings,
  User,
} from "lucide-react";

interface HeaderProps {
  userName?: string;
  userAvatar?: string;
  isAuthenticated?: boolean;
  onLogout?: () => void;
  onToggleMenu?: () => void;
}

const Header = ({
  userName = "Faculty User",
  userAvatar = "",
  isAuthenticated = true,
  onLogout = () => console.log("Logout clicked"),
  onToggleMenu = () => console.log("Toggle menu clicked"),
}: HeaderProps) => {
  return (
    <header className="w-full h-20 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 md:px-6 lg:px-8">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onToggleMenu}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-primary hidden md:inline">
            Canvas Course Mapper
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" className="hidden md:flex gap-2">
          <Save className="h-4 w-4" />
          Save Progress
        </Button>

        <Button variant="ghost" size="icon" className="text-gray-500">
          <HelpCircle className="h-5 w-5" />
        </Button>

        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BookOpen className="mr-2 h-4 w-4" />
                <span>Saved Course Maps</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="default" size="sm">
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
