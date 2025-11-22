import { useState } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Package, Plus, Camera, Calendar } from "lucide-react";
import { toast } from "sonner";
import InventoryFormDialog from "@/components/InventoryFormDialog";

const Inventory = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const [inventoryItems, setInventoryItems] = useState([
    {
      id: 1,
      property: "Apartamento 301",
      category: "Electrodomésticos",
      items: [
        { name: "Nevera Samsung", quantity: 1, condition: "Excelente", date: "01/01/2024" },
        { name: "Lavadora LG", quantity: 1, condition: "Bueno", date: "01/01/2024" },
        { name: "Microondas", quantity: 1, condition: "Excelente", date: "01/01/2024" },
      ],
    },
    {
      id: 2,
      property: "Apartamento 301",
      category: "Muebles",
      items: [
        { name: "Sofá 3 puestos", quantity: 1, condition: "Bueno", date: "01/01/2024" },
        { name: "Mesa de comedor", quantity: 1, condition: "Excelente", date: "01/01/2024" },
        { name: "Sillas", quantity: 6, condition: "Bueno", date: "01/01/2024" },
      ],
    },
    {
      id: 3,
      property: "Casa Barrio Norte",
      category: "Electrodomésticos",
      items: [
        { name: "Aire Acondicionado", quantity: 2, condition: "Excelente", date: "15/02/2024" },
        { name: "Estufa a gas", quantity: 1, condition: "Bueno", date: "15/02/2024" },
      ],
    },
  ]);

  const handleAddInventoryItem = (newItem: any) => {
    const propertyName = newItem.property === "apt301" ? "Apartamento 301" :
      newItem.property === "casanorte" ? "Casa Barrio Norte" :
        newItem.property === "local" ? "Local Comercial A" : "Apartamento 502";

    const categoryName = newItem.category.charAt(0).toUpperCase() + newItem.category.slice(1);

    const existingSectionIndex = inventoryItems.findIndex(
      (section) => section.property === propertyName && section.category === categoryName
    );

    const itemToAdd = {
      name: newItem.itemName,
      quantity: parseInt(newItem.quantity),
      condition: newItem.condition.charAt(0).toUpperCase() + newItem.condition.slice(1),
      date: new Date().toLocaleDateString("es-CO"),
    };

    if (existingSectionIndex !== -1) {
      const updatedItems = [...inventoryItems];
      updatedItems[existingSectionIndex].items.push(itemToAdd);
      setInventoryItems(updatedItems);
    } else {
      const newSection = {
        id: inventoryItems.length + 1,
        property: propertyName,
        category: categoryName,
        items: [itemToAdd],
      };
      setInventoryItems([...inventoryItems, newSection]);
    }
  };


  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  const handleTakePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setCameraOpen(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("No se pudo acceder a la cámara");
    }
  };

  const closeCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setCameraOpen(false);
  };

  const capturePhoto = () => {
    const video = document.getElementById("camera-video") as HTMLVideoElement;
    const canvas = document.createElement("canvas");
    if (video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d")?.drawImage(video, 0, 0);
      const photoUrl = canvas.toDataURL("image/jpeg");
      setCapturedPhoto(photoUrl);
      toast.success("Foto capturada exitosamente");
      closeCamera();
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "Excelente":
        return "bg-success";
      case "Bueno":
        return "bg-primary";
      case "Regular":
        return "bg-warning";
      case "Malo":
        return "bg-destructive";
      default:
        return "bg-muted";
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">Inventario</h2>
            <p className="text-sm text-muted-foreground">Registro de bienes de las propiedades</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleTakePhoto}>
              <Camera className="w-4 h-4 mr-2" />
              Foto
            </Button>
            <Button onClick={() => setDialogOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Agregar
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <Dialog open={cameraOpen} onOpenChange={closeCamera}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Tomar Foto</DialogTitle>
              </DialogHeader>
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                {cameraStream && (
                  <video
                    id="camera-video"
                    autoPlay
                    playsInline
                    ref={(video) => {
                      if (video) video.srcObject = cameraStream;
                    }}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={closeCamera}>Cancelar</Button>
                <Button onClick={capturePhoto}>Capturar</Button>
              </div>
            </DialogContent>
          </Dialog>
          <InventoryFormDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleAddInventoryItem} />
          {inventoryItems.map((section) => (
            <Card key={section.id} className="p-5 shadow-soft">
              <div className="flex items-start gap-3 mb-4 pb-4 border-b border-border">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-foreground">{section.property}</h3>
                  <p className="text-sm text-muted-foreground">{section.category}</p>
                </div>
                <Badge variant="secondary">{section.items.length} items</Badge>
              </div>

              <div className="space-y-3">
                {section.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-secondary rounded-xl hover:bg-muted transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-foreground">{item.name}</p>
                        {item.quantity > 1 && (
                          <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-md">
                            x{item.quantity}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{item.date}</span>
                      </div>
                    </div>
                    <Badge className={getConditionColor(item.condition)}>
                      {item.condition}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6 bg-accent/5 border-accent/20 shadow-soft">
          <div className="flex items-start gap-3">
            <Camera className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-display font-semibold text-foreground mb-1">
                Documenta tu inventario con fotos
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Toma fotos de cada artículo para tener un registro visual completo del estado inicial de los bienes.
              </p>
              <Button size="sm" variant="outline" onClick={handleTakePhoto}>
                Tomar Foto
              </Button>
              {capturedPhoto && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2 text-foreground">Última captura:</p>
                  <img src={capturedPhoto} alt="Captura" className="w-full max-w-xs rounded-lg border border-border shadow-sm" />
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Inventory;