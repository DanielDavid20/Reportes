import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface InventoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

const InventoryFormDialog = ({ open, onOpenChange, onSubmit }: InventoryFormDialogProps) => {
  const [formData, setFormData] = useState({
    property: "",
    category: "",
    itemName: "",
    quantity: "1",
    condition: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    toast.success(`Artículo "${formData.itemName}" agregado al inventario`);
    onOpenChange(false);
    setFormData({ property: "", category: "", itemName: "", quantity: "1", condition: "", notes: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-display">Agregar Artículo al Inventario</DialogTitle>
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
            <Label htmlFor="category">Categoría *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electrodomesticos">Electrodomésticos</SelectItem>
                <SelectItem value="muebles">Muebles</SelectItem>
                <SelectItem value="electronica">Electrónica</SelectItem>
                <SelectItem value="decoracion">Decoración</SelectItem>
                <SelectItem value="otros">Otros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="itemName">Nombre del Artículo *</Label>
            <Input
              id="itemName"
              placeholder="Ej: Nevera Samsung"
              value={formData.itemName}
              onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="quantity">Cantidad *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="condition">Condición *</Label>
              <Select value={formData.condition} onValueChange={(value) => setFormData({ ...formData, condition: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excelente">Excelente</SelectItem>
                  <SelectItem value="bueno">Bueno</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="malo">Malo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              placeholder="Observaciones adicionales..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
              Agregar Artículo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryFormDialog;