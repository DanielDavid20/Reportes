import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Share2, FileText, User, Calendar, DollarSign, Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ContractDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const contract = {
    property: "Apartamento 301",
    tenant: {
      name: "María Rodríguez",
      email: "maria.rodriguez@email.com",
      phone: "+57 300 123 4567",
      id: "1234567890",
    },
    startDate: "01/01/2024",
    endDate: "31/12/2024",
    status: "Activo",
    rent: "$850.000",
    deposit: "$850.000",
    paymentDay: "5 de cada mes",
    clauses: [
      "El arrendatario se compromete a pagar el canon de arrendamiento dentro de los primeros 5 días de cada mes.",
      "El arrendador entrega el inmueble en perfectas condiciones de uso y habitabilidad.",
      "Está prohibido el subarriendo del inmueble sin previa autorización escrita del arrendador.",
      "El arrendatario debe mantener el inmueble en buen estado y realizar reparaciones locativas.",
    ],
  };

  const handleDownload = async () => {
    const element = document.getElementById("contract-content");
    if (!element) return;

    toast.info("Generando PDF...");

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`contrato-${contract.property}.pdf`);
      toast.success("PDF descargado exitosamente");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Error al generar el PDF");
    }
  };

  const handleShare = () => {
    toast.success("Compartiendo contrato vía WhatsApp...");
  };

  return (
    <Layout>
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/contracts")}
          className="mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <Card id="contract-content" className="p-6 shadow-medium">
          <div className="flex items-start justify-between mb-6">
            <div className="flex gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-1">Contrato de Arriendo</h2>
                <p className="text-muted-foreground">{contract.property}</p>
              </div>
            </div>
            <Badge className="bg-success">
              {contract.status}
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-3">
              <div className="p-4 bg-secondary rounded-xl">
                <p className="text-xs text-muted-foreground mb-1">Arrendatario</p>
                <p className="font-semibold text-foreground">{contract.tenant.name}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{contract.tenant.email}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{contract.tenant.phone}</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-secondary rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-primary" />
                  <p className="text-xs text-muted-foreground">Vigencia</p>
                </div>
                <p className="font-semibold text-foreground">{contract.startDate} - {contract.endDate}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-accent/10 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-accent" />
                <p className="text-xs text-muted-foreground">Canon Mensual</p>
              </div>
              <p className="text-xl font-display font-bold text-foreground">{contract.rent}</p>
            </div>
            <div className="p-4 bg-primary/10 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-primary" />
                <p className="text-xs text-muted-foreground">Depósito</p>
              </div>
              <p className="text-xl font-display font-bold text-foreground">{contract.deposit}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-display font-semibold text-foreground mb-3">Cláusulas del Contrato</h3>
            <div className="space-y-2">
              {contract.clauses.map((clause, index) => (
                <div key={index} className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{index + 1}. </span>
                  {clause}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleDownload} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
              <Download className="w-4 h-4 mr-2" />
              Descargar PDF
            </Button>
            <Button onClick={handleShare} variant="outline" className="flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default ContractDetail;