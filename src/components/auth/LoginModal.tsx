import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function LoginModal({ onClose }: { onClose: () => void }) {
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
