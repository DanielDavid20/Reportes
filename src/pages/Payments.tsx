import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Calendar, Send, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const Payments = () => {
  const payments = [
    {
      id: 1,
      property: "Apartamento 301",
      tenant: "María Rodríguez",
      amount: "$850.000",
      dueDate: "05/12/2024",
      status: "Pendiente",
      daysUntilDue: 3,
    },
    {
      id: 2,
      property: "Casa Barrio Norte",
      tenant: "Carlos Pérez",
      amount: "$1.200.000",
      dueDate: "05/12/2024",
      status: "Pendiente",
      daysUntilDue: 3,
    },
    {
      id: 3,
      property: "Local Comercial A",
      tenant: "Comercial XYZ SAS",
      amount: "$2.500.000",
      dueDate: "03/12/2024",
      status: "Vencido",
      daysUntilDue: -1,
    },
    {
      id: 4,
      property: "Apartamento 205",
      tenant: "Ana Martínez",
      amount: "$780.000",
      dueDate: "01/12/2024",
      status: "Pagado",
      paidDate: "30/11/2024",
    },
  ];

  const handleSendReminder = (tenantName: string) => {
    toast.success(`Recordatorio enviado a ${tenantName} vía WhatsApp`);
  };

  const handleMarkAsPaid = (property: string) => {
    toast.success(`Pago registrado para ${property}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pagado":
        return "bg-success";
      case "Pendiente":
        return "bg-warning";
      case "Vencido":
        return "bg-destructive";
      default:
        return "bg-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pagado":
        return <CheckCircle2 className="w-4 h-4" />;
      case "Pendiente":
        return <Clock className="w-4 h-4" />;
      case "Vencido":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Pagos y Recordatorios</h2>
          <p className="text-sm text-muted-foreground">Gestiona los pagos mensuales de tus propiedades</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 shadow-soft">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-success" />
              </div>
              <span className="text-xs text-muted-foreground">Pagados</span>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">1</p>
          </Card>
          <Card className="p-4 shadow-soft">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-warning" />
              </div>
              <span className="text-xs text-muted-foreground">Pendientes</span>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">2</p>
          </Card>
          <Card className="p-4 shadow-soft">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-destructive" />
              </div>
              <span className="text-xs text-muted-foreground">Vencidos</span>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">1</p>
          </Card>
        </div>

        <div className="space-y-4">
          {payments.map((payment) => (
            <Card key={payment.id} className="p-5 shadow-soft">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-display font-semibold text-foreground">{payment.property}</h3>
                      <p className="text-sm text-muted-foreground">{payment.tenant}</p>
                    </div>
                    <Badge className={getStatusColor(payment.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(payment.status)}
                        {payment.status}
                      </span>
                    </Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 pt-3 border-t border-border gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {payment.status === "Pagado" ? "Pagado el" : "Vence el"} {payment.status === "Pagado" ? payment.paidDate : payment.dueDate}
                      </p>
                      <p className="font-semibold text-lg text-foreground mt-1">{payment.amount}</p>
                    </div>
                    {payment.status !== "Pagado" && (
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                          size="xs"
                          variant="outline"
                          className="flex-1 sm:flex-none"
                          onClick={() => handleSendReminder(payment.tenant)}
                        >
                          <Send className="w-3 h-3 mr-1" />
                          Recordar
                        </Button>
                        <Button
                          size="xs"
                          className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1 sm:flex-none"
                          onClick={() => handleMarkAsPaid(payment.property)}
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Marcar Pagado
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Payments;