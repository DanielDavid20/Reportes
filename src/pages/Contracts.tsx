import { useState } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";
import ContractFormDialog from "@/components/ContractFormDialog";

const Contracts = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const [contracts, setContracts] = useState([
    {
      id: 1,
      property: "Apartamento 301",
      tenant: "María Rodríguez",
      startDate: "01/01/2024",
      endDate: "31/12/2024",
      status: "Activo",
      rent: "$850.000",
    },
    {
      id: 2,
      property: "Casa Barrio Norte",
      tenant: "Carlos Pérez",
      startDate: "15/02/2024",
      endDate: "14/02/2025",
      status: "Activo",
      rent: "$1.200.000",
    },
    {
      id: 3,
      property: "Local Comercial A",
      tenant: "Comercial XYZ SAS",
      startDate: "01/03/2024",
      endDate: "28/02/2025",
      status: "Activo",
      rent: "$2.500.000",
    },
    {
      id: 4,
      property: "Apartamento 205",
      tenant: "Ana Martínez",
      startDate: "01/10/2023",
      endDate: "30/09/2024",
      status: "Por Vencer",
      rent: "$780.000",
    },
  ]);

  const handleAddContract = (newContract: any) => {
    const contract = {
      id: contracts.length + 1,
      property: newContract.property === "apt301" ? "Apartamento 301" :
        newContract.property === "casanorte" ? "Casa Barrio Norte" :
          newContract.property === "local" ? "Local Comercial A" : "Apartamento 502",
      tenant: newContract.tenantName,
      startDate: new Date(newContract.startDate).toLocaleDateString("es-CO"),
      endDate: new Date(newContract.endDate).toLocaleDateString("es-CO"),
      status: "Activo",
      rent: `$${parseInt(newContract.rent).toLocaleString("es-CO")}`,
    };
    setContracts([...contracts, contract]);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">Contratos</h2>
            <p className="text-sm text-muted-foreground">Administra tus contratos de arriendo</p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo
          </Button>
        </div>

        <div className="space-y-4">
          <ContractFormDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleAddContract} />
          {contracts.map((contract) => (
            <Link key={contract.id} to={`/contracts/${contract.id}`}>
              <Card className="p-5 hover:shadow-medium transition-all shadow-soft">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-display font-semibold text-foreground">{contract.property}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <User className="w-4 h-4" />
                          <span>{contract.tenant}</span>
                        </div>
                      </div>
                      <Badge
                        variant={contract.status === "Activo" ? "default" : "secondary"}
                        className={contract.status === "Activo" ? "bg-success" : "bg-warning"}
                      >
                        {contract.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{contract.startDate} - {contract.endDate}</span>
                      </div>
                      <span className="font-semibold text-primary">{contract.rent}</span>
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

export default Contracts;