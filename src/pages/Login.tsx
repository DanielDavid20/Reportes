import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Building2, Lock, Mail } from "lucide-react";
import { toast } from "sonner";

interface LoginProps {
  onLogin: () => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (email && password) {
        toast.success("¡Bienvenido a RENTIA!");
        onLogin();
        navigate("/");
      } else {
        toast.error("Por favor completa todos los campos");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-strong">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4">
            <Building2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">RENTIA</h1>
          <p className="text-muted-foreground">Gestión de Arriendos Inteligente</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Correo Electrónico
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-white hover:bg-primary/90"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Demo: usa cualquier email y contraseña
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>¿No tienes cuenta? <button className="text-primary font-semibold hover:underline">Regístrate</button></p>
        </div>
      </Card>
    </div>
  );
};

export default Login;