import { useState, useEffect } from "react";
import { SensorCard } from "./SensorCard";
import { PumpControl } from "./PumpControl";
import { ChartCard } from "./ChartCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Droplets, 
  Thermometer, 
  Gauge, 
  Battery, 
  TrendingUp,
  Bell,
  Settings,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock sensor data - In real app, this would come from Supabase real-time
const generateMockData = () => ({
  soilMoisture: Math.floor(Math.random() * 30) + 35, // 35-65%
  temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
  humidity: Math.floor(Math.random() * 20) + 60, // 60-80%
  tankLevel: Math.floor(Math.random() * 40) + 60, // 60-100%
  flowRate: Math.random() * 5 + 2, // 2-7 L/min
});

const generateChartData = (hours = 12) => {
  return Array.from({ length: hours }, (_, i) => ({
    time: `${23 - i}:00`,
    value: Math.floor(Math.random() * 20) + 40,
  }));
};

export function Dashboard() {
  const [sensorData, setSensorData] = useState(generateMockData());
  const [pumpRunning, setPumpRunning] = useState(false);
  const [pumpMode, setPumpMode] = useState<"manual" | "auto">("auto");
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData(generateMockData());
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getSensorStatus = (value: number, min: number, max: number, optimal: [number, number]) => {
    if (value < optimal[0] || value > optimal[1]) return "warning";
    if (value < min || value > max) return "critical";
    return "good";
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
            Smart Irrigation
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="default" className="bg-success text-success-foreground">
                Online
              </Badge>
              <Badge variant="outline">
                ESP32 Connected
              </Badge>
              <Badge variant="outline">
                {pumpMode === "auto" ? "Auto Mode" : "Manual Mode"}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Next irrigation</p>
              <p className="font-semibold">In 2h 15m</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SensorCard
          title="Soil Moisture"
          value={sensorData.soilMoisture}
          unit="%"
          max={100}
          min={0}
          icon={<Droplets className="h-4 w-4" />}
          status={getSensorStatus(sensorData.soilMoisture, 10, 90, [40, 70])}
        />
        <SensorCard
          title="Temperature"
          value={sensorData.temperature}
          unit="°C"
          max={50}
          min={0}
          icon={<Thermometer className="h-4 w-4" />}
          status={getSensorStatus(sensorData.temperature, 0, 45, [15, 35])}
        />
        <SensorCard
          title="Humidity"
          value={sensorData.humidity}
          unit="%"
          max={100}
          min={0}
          icon={<Gauge className="h-4 w-4" />}
          status={getSensorStatus(sensorData.humidity, 20, 100, [50, 80])}
        />
        <SensorCard
          title="Tank Level"
          value={sensorData.tankLevel}
          unit="%"
          max={100}
          min={0}
          icon={<Battery className="h-4 w-4" />}
          status={getSensorStatus(sensorData.tankLevel, 0, 100, [30, 100])}
        />
      </div>

      {/* Pump Control & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PumpControl
          isRunning={pumpRunning}
          mode={pumpMode}
          onTogglePump={() => setPumpRunning(!pumpRunning)}
          onToggleMode={() => setPumpMode(pumpMode === "auto" ? "manual" : "auto")}
          flowRate={pumpRunning ? sensorData.flowRate : 0}
          className="lg:col-span-1"
        />
        
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChartCard
            title="Soil Moisture Trend"
            data={generateChartData()}
            color="hsl(var(--primary))"
            unit="%"
            currentValue={sensorData.soilMoisture}
            trend="down"
          />
          <ChartCard
            title="Temperature Trend"
            data={generateChartData()}
            color="hsl(var(--info))"
            unit="°C"
            currentValue={sensorData.temperature}
            trend="up"
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="animate-slide-up">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">2.3L</p>
            <p className="text-xs text-muted-foreground">Water used today</p>
          </CardContent>
        </Card>
        <Card className="animate-slide-up">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-success">4</p>
            <p className="text-xs text-muted-foreground">Irrigation cycles</p>
          </CardContent>
        </Card>
        <Card className="animate-slide-up">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-info">85%</p>
            <p className="text-xs text-muted-foreground">System efficiency</p>
          </CardContent>
        </Card>
        <Card className="animate-slide-up">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-warning">7 days</p>
            <p className="text-xs text-muted-foreground">Tank duration</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}