import { useState } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, DollarSign, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import PropertyFormDialog from "@/components/PropertyFormDialog";

const Properties = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const [properties, setProperties] = useState([
    {
      id: 1,
      name: "Apartamento 301",
      address: "Carrera 15 #28-45, Cereté",
      type: "Apartamento",
      status: "Ocupado",
      rent: "$850.000",
      image: "🏢",
    },
    {
      id: 2,
      name: "Casa Barrio Norte",
      address: "Calle 30 #10-22, Montería",
      type: "Casa",
      status: "Ocupado",
      rent: "$1.200.000",
      image: "🏡",
    },
    {
      id: 3,
      name: "Local Comercial A",
      address: "Avenida Primera #5-18, Cereté",
      type: "Local",
      status: "Ocupado",
      rent: "$2.500.000",
      image: "🏪",
    },
    {
      id: 4,
      name: "Apartamento 502",
      address: "Carrera 20 #35-10, Montería",
      type: "Apartamento",
      status: "Disponible",
      rent: "$950.000",
      image: "🏢",
    },
  ]);

  const handleAddProperty = (newProperty: any) => {
    const property = {
      id: properties.length + 1,
      name: newProperty.name,
      address: newProperty.address,
      type: newProperty.type.charAt(0).toUpperCase() + newProperty.type.slice(1),
      status: "Disponible",
      rent: `$${parseInt(newProperty.rent).toLocaleString("es-CO")}`,
      image: newProperty.type === "casa" ? "🏡" : newProperty.type === "local" ? "🏪" : "🏢",
    };
    setProperties([...properties, property]);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">Propiedades</h2>
            <p className="text-sm text-muted-foreground">Gestiona tus inmuebles en arriendo</p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Agregar
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <PropertyFormDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleAddProperty} />
          {properties.map((property) => (
            <Link key={property.id} to={`/properties/${property.id}`}>
              <Card className="p-5 hover:shadow-medium transition-all shadow-soft">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center text-3xl flex-shrink-0">
                    {property.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-display font-semibold text-foreground">{property.name}</h3>
                      <Badge
                        variant={property.status === "Ocupado" ? "default" : "secondary"}
                        className={property.status === "Ocupado" ? "bg-success" : ""}
                      >
                        {property.status}
                      </Badge>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{property.address}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs px-2 py-1 bg-secondary rounded-md text-secondary-foreground">
                          {property.type}
                        </span>
                        <div className="flex items-center gap-1 text-primary font-semibold">
                          <DollarSign className="w-4 h-4" />
                          <span>{property.rent}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Properties;