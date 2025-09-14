import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Power, Droplets, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface PumpControlProps {
  isRunning: boolean;
  mode: "manual" | "auto";
  onTogglePump: () => void;
  onToggleMode: () => void;
  flowRate: number;
  className?: string;
}

export function PumpControl({ 
  isRunning, 
  mode, 
  onTogglePump, 
  onToggleMode, 
  flowRate,
  className 
}: PumpControlProps) {
  return (
    <Card className={cn("relative overflow-hidden animate-slide-up", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Droplets className="h-5 w-5 text-primary" />
          Pump Control
        </CardTitle>
        <Badge variant={isRunning ? "default" : "secondary"} 
               className={cn(isRunning && "bg-success text-success-foreground animate-pulse-glow")}>
          {isRunning ? "Running" : "Stopped"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pump Status & Control */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Pump Status</p>
            <p className="text-xs text-muted-foreground">
              Flow Rate: {flowRate.toFixed(1)} L/min
            </p>
          </div>
          <Button
            variant={isRunning ? "destructive" : "default"}
            size="lg"
            onClick={onTogglePump}
            className={cn(
              "h-12 w-12 rounded-full p-0 transition-all duration-300",
              isRunning && "animate-pulse-glow shadow-lg",
              !isRunning && "bg-success hover:bg-success/90"
            )}
          >
            <Power className="h-6 w-6" />
          </Button>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Operation Mode</p>
              <p className="text-xs text-muted-foreground">
                {mode === "auto" ? "Automatic irrigation based on sensors" : "Manual pump control"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn("text-sm", mode === "manual" ? "text-foreground" : "text-muted-foreground")}>
              Manual
            </span>
            <Switch 
              checked={mode === "auto"} 
              onCheckedChange={onToggleMode}
              className="data-[state=checked]:bg-primary"
            />
            <span className={cn("text-sm", mode === "auto" ? "text-foreground" : "text-muted-foreground")}>
              Auto
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" size="sm" className="text-xs">
            Schedule
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            History
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}