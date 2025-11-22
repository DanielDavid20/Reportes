import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface PropertyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

const PropertyFormDialog = ({ open, onOpenChange, onSubmit }: PropertyFormDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    type: "",
    rent: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    toast.success(`Propiedad "${formData.name}" agregada exitosamente`);
    onOpenChange(false);
    setFormData({ name: "", address: "", type: "", rent: "", description: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-display">Agregar Nueva Propiedad</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la Propiedad *</Label>
            <Input
              id="name"
              placeholder="Ej: Apartamento 301"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección *</Label>
            <Input
              id="address"
              placeholder="Ej: Carrera 15 #28-45, Cereté"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Inmueble *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartamento">Apartamento</SelectItem>
                <SelectItem value="casa">Casa</SelectItem>
                <SelectItem value="local">Local Comercial</SelectItem>
                <SelectItem value="oficina">Oficina</SelectItem>
                <SelectItem value="bodega">Bodega</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rent">Canon de Arriendo (COP) *</Label>
            <Input
              id="rent"
              type="number"
              placeholder="Ej: 850000"
              value={formData.rent}
              onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Describe las características de la propiedad..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
              Agregar Propiedad
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyFormDialog;