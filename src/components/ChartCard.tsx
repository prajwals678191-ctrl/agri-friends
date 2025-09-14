import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from "@/lib/utils";

interface ChartData {
  time: string;
  value: number;
}

interface ChartCardProps {
  title: string;
  data: ChartData[];
  color: string;
  unit: string;
  currentValue: number;
  trend: "up" | "down" | "stable";
  className?: string;
}

const trendIcons = {
  up: "↗",
  down: "↘", 
  stable: "→"
};

const trendColors = {
  up: "text-success",
  down: "text-destructive",
  stable: "text-muted-foreground"
};

export function ChartCard({ 
  title, 
  data, 
  color, 
  unit, 
  currentValue, 
  trend, 
  className 
}: ChartCardProps) {
  return (
    <Card className={cn("animate-slide-up", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <Badge variant="outline" className={cn("text-xs", trendColors[trend])}>
          {trendIcons[trend]} {currentValue}{unit}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 10 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                tick={{ fontSize: 10 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  fontSize: "12px"
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={color}
                strokeWidth={2}
                dot={{ fill: color, strokeWidth: 2, r: 3 }}
                activeDot={{ r: 4, stroke: color, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}