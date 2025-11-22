import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Calendar, DollarSign, FileText, Send } from "lucide-react";
import { toast } from "sonner";

const Debts = () => {
  const debts = [
    {
      id: 1,
      property: "Local Comercial A",
      tenant: "Comercial XYZ SAS",
      totalDebt: "$2.500.000",
      months: ["Diciembre 2024"],
      daysOverdue: 1,
      status: "Activa",
      history: [
        { month: "Diciembre 2024", amount: "$2.500.000", dueDate: "03/12/2024", status: "Vencido" },
      ],
    },
    {
      id: 2,
      property: "Casa Barrio Sur",
      tenant: "Pedro González",
      totalDebt: "$1.800.000",
      months: ["Octubre 2024", "Noviembre 2024"],
      daysOverdue: 33,
      status: "Crítica",
      history: [
        { month: "Octubre 2024", amount: "$900.000", dueDate: "05/10/2024", status: "Vencido" },
        { month: "Noviembre 2024", amount: "$900.000", dueDate: "05/11/2024", status: "Vencido" },
      ],
    },
    {
      id: 3,
      property: "Apartamento 402",
      tenant: "Laura Sánchez",
      totalDebt: "$1.050.000",
      months: ["Noviembre 2024"],
      daysOverdue: 28,
      status: "En Seguimiento",
      paymentPlan: "Acuerdo de pago: $525.000 cada 15 días",
      history: [
        { month: "Noviembre 2024", amount: "$1.050.000", dueDate: "05/11/2024", status: "Vencido" },
      ],
    },
  ];

  const handleSendReminder = (tenantName: string) => {
    toast.success(`Recordatorio de deuda enviado a ${tenantName}`);
  };

  const handleCreateAgreement = (property: string) => {
    toast.success(`Creando acuerdo de pago para ${property}`);
  };

  const handleViewHistory = (property: string) => {
    toast.info(`Mostrando historial completo de ${property}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Activa":
        return "bg-warning";
      case "Crítica":
        return "bg-destructive";
      case "En Seguimiento":
        return "bg-accent";
      default:
        return "bg-muted";
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Gestión de Deudas</h2>
          <p className="text-sm text-muted-foreground">Seguimiento y control de pagos pendientes</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="p-4 shadow-soft">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-destructive" />
              </div>
              <span className="text-xs text-muted-foreground">Deudas Activas</span>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">3</p>
          </Card>
          <Card className="p-4 shadow-soft">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-accent" />
              </div>
              <span className="text-xs text-muted-foreground">Total Adeudado</span>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">$5.4M</p>
          </Card>
          <Card className="p-4 shadow-soft col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-warning" />
              </div>
              <span className="text-xs text-muted-foreground">Promedio Mora</span>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">21 días</p>
          </Card>
        </div>

        <div className="space-y-4">
          {debts.map((debt) => (
            <Card key={debt.id} className="p-5 shadow-soft">
              <div className="flex gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-destructive" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-display font-semibold text-foreground">{debt.property}</h3>
                      <p className="text-sm text-muted-foreground">{debt.tenant}</p>
                    </div>
                    <Badge className={getStatusColor(debt.status)}>
                      {debt.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span>{debt.months.length} {debt.months.length === 1 ? "mes" : "meses"} pendiente{debt.months.length > 1 ? "s" : ""}</span>
                    <span>•</span>
                    <span className="text-destructive font-medium">{debt.daysOverdue} días de mora</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-accent/5 rounded-xl mb-3">
                    <span className="text-sm text-muted-foreground">Deuda Total</span>
                    <span className="text-xl font-display font-bold text-foreground">{debt.totalDebt}</span>
                  </div>
                  {debt.paymentPlan && (
                    <div className="p-3 bg-primary/5 rounded-xl mb-3 flex items-start gap-2">
                      <FileText className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground">{debt.paymentPlan}</p>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSendReminder(debt.tenant)}
                    >
                      <Send className="w-4 h-4 mr-1" />
                      Enviar Recordatorio
                    </Button>
                    {!debt.paymentPlan && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCreateAgreement(debt.property)}
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        Crear Acuerdo
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewHistory(debt.property)}
                    >
                      Ver Historial
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6 bg-primary/5 border-primary/20 shadow-soft">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-display font-semibold text-foreground mb-1">
                Automatiza tus recordatorios
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Configura recordatorios automáticos por WhatsApp y email para reducir la morosidad.
              </p>
              <Button size="sm" variant="outline">
                Configurar Automatización
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Debts;