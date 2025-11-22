import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, DollarSign, User, FileText, Package, Calendar } from "lucide-react";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Simulated property data
  const property = {
    name: "Apartamento 301",
    address: "Carrera 15 #28-45, Cereté, Córdoba",
    type: "Apartamento",
    status: "Ocupado",
    rent: "$850.000",
    image: "🏢",
    tenant: "María Rodríguez",
    contractStart: "01/01/2024",
    contractEnd: "31/12/2024",
    description: "Apartamento de 3 habitaciones, 2 baños, cocina integral y balcón. Ubicado en zona residencial tranquila con fácil acceso al transporte público.",
    features: ["3 habitaciones", "2 baños", "Cocina integral", "Balcón", "Parqueadero"],
  };

  return (
    <Layout>
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/properties")}
          className="mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <Card className="p-6 shadow-medium">
          <div className="flex gap-4 mb-6">
            <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center text-5xl flex-shrink-0">
              {property.image}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h2 className="text-2xl font-display font-bold text-foreground">{property.name}</h2>
                <Badge variant="default" className="bg-success">
                  {property.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <MapPin className="w-4 h-4" />
                <span>{property.address}</span>
              </div>
              <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                <DollarSign className="w-5 h-5" />
                <span>{property.rent}/mes</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-display font-semibold text-foreground mb-2">Descripción</h3>
              <p className="text-sm text-muted-foreground">{property.description}</p>
            </div>

            <div>
              <h3 className="font-display font-semibold text-foreground mb-2">Características</h3>
              <div className="flex flex-wrap gap-2">
                {property.features.map((feature, index) => (
                  <Badge key={index} variant="secondary">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-soft">
          <h3 className="font-display font-semibold text-foreground mb-4">Información del Contrato</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
              <User className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Arrendatario</p>
                <p className="font-medium text-foreground">{property.tenant}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Período del Contrato</p>
                <p className="font-medium text-foreground">{property.contractStart} - {property.contractEnd}</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" onClick={() => navigate(`/contracts/${id}`)}>
            <FileText className="w-4 h-4 mr-2" />
            Ver Contrato
          </Button>
          <Button variant="outline" onClick={() => navigate("/inventory")}>
            <Package className="w-4 h-4 mr-2" />
            Inventario
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default PropertyDetail;