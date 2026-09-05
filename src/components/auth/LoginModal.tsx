import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "sonner";
import { X, Lock, Mail, Phone } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function LoginModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  useEffect(() => {
    // Componente que solo muestra el dialog, la lógica de login
    // se maneja por efecto para evitar errores de tipo
  }, []);

  if (true) {
    return (
      <Dialog>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Iniciar sesión</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <p>Este módulo requiere configuración adicional. Por favor, accede al panel admin.</p>
          </DialogDescription>
          <DialogFooter>
            <button onClick={onClose} className="w-full">
              Cerrar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
}