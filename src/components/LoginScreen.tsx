import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, AlertCircle } from "lucide-react";

interface LoginScreenProps {
  onAuthenticated: () => void;
}

const CORRECT_PASSWORD = "takeat2025";

const LoginScreen = ({ onAuthenticated }: LoginScreenProps) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === CORRECT_PASSWORD) {
      onAuthenticated();
    } else {
      setError(true);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className={`w-full max-w-md ${isShaking ? "animate-shake" : ""}`}>
        <div className="bg-card rounded-2xl shadow-card p-8 border border-border">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary">
              Takeat <span className="text-foreground">Outbound</span>
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Ferramenta de geração de leads
            </p>
          </div>

          {/* Lock Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary" />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Senha de acesso
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Digite a senha"
                className={`h-12 ${error ? "border-destructive focus-visible:ring-destructive" : ""}`}
                autoFocus
              />
              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>Senha incorreta. Tente novamente.</span>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full h-12 text-base font-semibold">
              Entrar
            </Button>
          </form>
        </div>

        <p className="text-center text-muted-foreground text-xs mt-6">
          Acesso restrito a colaboradores Takeat
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
