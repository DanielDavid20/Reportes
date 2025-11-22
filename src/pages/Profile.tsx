import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, MapPin, Building2, LogOut, Settings, Bell, Shield } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success("Sesión cerrada exitosamente");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  };

  const handleEditProfile = () => {
    toast.info("Función de edición disponible próximamente");
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Mi Perfil</h2>
          <p className="text-sm text-muted-foreground">Gestiona tu información personal y configuración</p>
        </div>

        <Card className="p-6 shadow-medium">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center mb-4">
              <User className="w-12 h-12 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-display font-bold text-foreground mb-1">Juan Carlos Mendoza</h3>
            <p className="text-sm text-muted-foreground">Propietario • Plan Pro</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 bg-secondary rounded-xl">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Correo Electrónico</p>
                <p className="font-medium text-foreground">juan.mendoza@email.com</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-secondary rounded-xl">
              <Phone className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Teléfono</p>
                <p className="font-medium text-foreground">+57 312 456 7890</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-secondary rounded-xl">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Ubicación</p>
                <p className="font-medium text-foreground">Cereté, Córdoba</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-secondary rounded-xl">
              <Building2 className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Propiedades Registradas</p>
                <p className="font-medium text-foreground">12 inmuebles</p>
              </div>
            </div>
          </div>

          <Button onClick={handleEditProfile} className="w-full mt-6" variant="outline">
            Editar Perfil
          </Button>
        </Card>

        <Card className="p-6 shadow-soft">
          <h3 className="font-display font-semibold text-foreground mb-4">Configuración</h3>
          <div className="space-y-2">
            <button 
              onClick={() => toast.info("Configuración de notificaciones")}
              className="w-full flex items-center gap-3 p-4 hover:bg-muted rounded-xl transition-colors text-left"
            >
              <Bell className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="font-medium text-foreground">Notificaciones</p>
                <p className="text-sm text-muted-foreground">Configura alertas y recordatorios</p>
              </div>
            </button>

            <button 
              onClick={() => toast.info("Configuración de seguridad")}
              className="w-full flex items-center gap-3 p-4 hover:bg-muted rounded-xl transition-colors text-left"
            >
              <Shield className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="font-medium text-foreground">Seguridad</p>
                <p className="text-sm text-muted-foreground">Contraseña y autenticación</p>
              </div>
            </button>

            <button 
              onClick={() => toast.info("Configuración general")}
              className="w-full flex items-center gap-3 p-4 hover:bg-muted rounded-xl transition-colors text-left"
            >
              <Settings className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="font-medium text-foreground">Preferencias</p>
                <p className="text-sm text-muted-foreground">Idioma y personalización</p>
              </div>
            </button>
          </div>
        </Card>

        <Card className="p-6 bg-accent/5 border-accent/20 shadow-soft">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground mb-1">Plan Pro</h3>
              <p className="text-sm text-muted-foreground">
                Gestión ilimitada de propiedades y contratos
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Ver Detalles del Plan
          </Button>
        </Card>

        <Button 
          onClick={handleLogout}
          variant="outline" 
          className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>
    </Layout>
  );
};

export default Profile;