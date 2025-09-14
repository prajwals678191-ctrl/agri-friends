import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SensorCardProps {
  title: string;
  value: number;
  unit: string;
  max: number;
  min?: number;
  icon: React.ReactNode;
  status: "good" | "warning" | "critical";
  className?: string;
}

const statusColors = {
  good: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground", 
  critical: "bg-destructive text-destructive-foreground"
};

const statusText = {
  good: "Optimal",
  warning: "Attention",
  critical: "Critical"
};

export function SensorCard({ 
  title, 
  value, 
  unit, 
  max, 
  min = 0, 
  icon, 
  status, 
  className 
}: SensorCardProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <Card className={cn("relative overflow-hidden animate-slide-up", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-3">
          <div className="text-2xl font-bold">
            {value}
            <span className="text-sm font-normal text-muted-foreground ml-1">
              {unit}
            </span>
          </div>
          <Badge variant="secondary" className={cn("text-xs", statusColors[status])}>
            {statusText[status]}
          </Badge>
        </div>
        <Progress 
          value={percentage} 
          className={cn(
            "h-2 transition-all duration-500",
            status === "good" && "[&>div]:bg-success",
            status === "warning" && "[&>div]:bg-warning", 
            status === "critical" && "[&>div]:bg-destructive"
          )}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </CardContent>
    </Card>
  );
}