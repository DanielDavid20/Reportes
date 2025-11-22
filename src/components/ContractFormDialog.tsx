import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface ContractFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

const ContractFormDialog = ({ open, onOpenChange, onSubmit }: ContractFormDialogProps) => {
  const [formData, setFormData] = useState({
    property: "",
    tenantName: "",
    tenantEmail: "",
    tenantPhone: "",
    startDate: "",
    endDate: "",
    rent: "",
    deposit: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    toast.success(`Contrato creado para ${formData.tenantName}`);
    onOpenChange(false);
    setFormData({
      property: "",
      tenantName: "",
      tenantEmail: "",
      tenantPhone: "",
      startDate: "",
      endDate: "",
      rent: "",
      deposit: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-display">Nuevo Contrato de Arriendo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="property">Propiedad *</Label>
            <Select value={formData.property} onValueChange={(value) => setFormData({ ...formData, property: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una propiedad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apt301">Apartamento 301</SelectItem>
                <SelectItem value="casanorte">Casa Barrio Norte</SelectItem>
                <SelectItem value="local">Local Comercial A</SelectItem>
                <SelectItem value="apt502">Apartamento 502</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tenantName">Nombre del Arrendatario *</Label>
            <Input
              id="tenantName"
              placeholder="Nombre completo"
              value={formData.tenantName}
              onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="tenantEmail">Email</Label>
              <Input
                id="tenantEmail"
                type="email"
                placeholder="email@ejemplo.com"
                value={formData.tenantEmail}
                onChange={(e) => setFormData({ ...formData, tenantEmail: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenantPhone">Teléfono</Label>
              <Input
                id="tenantPhone"
                type="tel"
                placeholder="+57 300 000 0000"
                value={formData.tenantPhone}
                onChange={(e) => setFormData({ ...formData, tenantPhone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha Inicio *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Fecha Fin *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="rent">Canon Mensual *</Label>
              <Input
                id="rent"
                type="number"
                placeholder="850000"
                value={formData.rent}
                onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deposit">Depósito</Label>
              <Input
                id="deposit"
                type="number"
                placeholder="850000"
                value={formData.deposit}
                onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
              Crear Contrato
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContractFormDialog;