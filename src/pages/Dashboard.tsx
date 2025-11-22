import { useState } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, FileText, CreditCard, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import ContractFormDialog from "@/components/ContractFormDialog";

const Dashboard = () => {
  const [contractDialogOpen, setContractDialogOpen] = useState(false);
  
  const stats = [
    { label: "Propiedades", value: "12", change: "+2", icon: Building2, color: "text-primary" },
    { label: "Contratos Activos", value: "10", change: "+1", icon: FileText, color: "text-accent" },
    { label: "Pagos Pendientes", value: "4", change: "-2", icon: CreditCard, color: "text-warning" },
    { label: "Deudas Totales", value: "$2.4M", change: "-$500K", icon: TrendingUp, color: "text-success" },
  ];

  const recentActivity = [
    { type: "payment", message: "Pago recibido - Apartamento 301", time: "Hace 2 horas", status: "success" },
    { type: "alert", message: "Pago vencido - Casa Barrio Norte", time: "Hace 5 horas", status: "warning" },
    { type: "contract", message: "Nuevo contrato firmado", time: "Hace 1 día", status: "info" },
    { type: "payment", message: "Recordatorio enviado - Local Comercial A", time: "Hace 2 días", status: "info" },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-primary rounded-2xl p-6 shadow-medium">
          <h2 className="text-2xl font-display font-bold mb-2 text-white">Bienvenido de nuevo</h2>
          <p className="text-white/90 mb-4">
            Aquí está el resumen de tus propiedades en arriendo
          </p>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => setContractDialogOpen(true)}
            >
              Nuevo Contrato
            </Button>
            <Link to="/properties">
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Ver Propiedades
              </Button>
            </Link>
          </div>
        </div>
        
        <ContractFormDialog open={contractDialogOpen} onOpenChange={setContractDialogOpen} />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="p-4 shadow-soft hover:shadow-medium transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className={cn("w-10 h-10 rounded-xl bg-secondary flex items-center justify-center", stat.color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-success">{stat.change}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <Card className="p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-semibold text-foreground">Actividad Reciente</h3>
            <Button variant="ghost" size="sm">Ver todo</Button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  activity.status === "success" && "bg-success/10",
                  activity.status === "warning" && "bg-warning/10",
                  activity.status === "info" && "bg-primary/10"
                )}>
                  {activity.status === "success" && <CheckCircle2 className="w-4 h-4 text-success" />}
                  {activity.status === "warning" && <AlertCircle className="w-4 h-4 text-warning" />}
                  {activity.status === "info" && <FileText className="w-4 h-4 text-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link to="/payments">
            <Card className="p-6 hover:bg-accent/5 transition-colors cursor-pointer shadow-soft hover:shadow-medium">
              <CreditCard className="w-10 h-10 text-accent mb-3" />
              <h4 className="font-display font-semibold text-foreground mb-1">Registrar Pago</h4>
              <p className="text-sm text-muted-foreground">Marcar pago como recibido</p>
            </Card>
          </Link>
          <Link to="/debts">
            <Card className="p-6 hover:bg-warning/5 transition-colors cursor-pointer shadow-soft hover:shadow-medium">
              <AlertCircle className="w-10 h-10 text-warning mb-3" />
              <h4 className="font-display font-semibold text-foreground mb-1">Ver Deudas</h4>
              <p className="text-sm text-muted-foreground">Gestionar pagos pendientes</p>
            </Card>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

export default Dashboard;