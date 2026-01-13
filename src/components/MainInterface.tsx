import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Building2, Loader2, AlertCircle, CheckCircle2, Map, Phone, Send } from "lucide-react";

const WEBHOOK_URL = "https://webhook.takeat.cloud/webhook/gerar_leads_outbound21566";

const BRAZILIAN_STATES = [
  { name: "Acre", abbr: "AC" },
  { name: "Alagoas", abbr: "AL" },
  { name: "Amapá", abbr: "AP" },
  { name: "Amazonas", abbr: "AM" },
  { name: "Bahia", abbr: "BA" },
  { name: "Ceará", abbr: "CE" },
  { name: "Distrito Federal", abbr: "DF" },
  { name: "Espírito Santo", abbr: "ES" },
  { name: "Goiás", abbr: "GO" },
  { name: "Maranhão", abbr: "MA" },
  { name: "Mato Grosso", abbr: "MT" },
  { name: "Mato Grosso do Sul", abbr: "MS" },
  { name: "Minas Gerais", abbr: "MG" },
  { name: "Pará", abbr: "PA" },
  { name: "Paraíba", abbr: "PB" },
  { name: "Paraná", abbr: "PR" },
  { name: "Pernambuco", abbr: "PE" },
  { name: "Piauí", abbr: "PI" },
  { name: "Rio de Janeiro", abbr: "RJ" },
  { name: "Rio Grande do Norte", abbr: "RN" },
  { name: "Rio Grande do Sul", abbr: "RS" },
  { name: "Rondônia", abbr: "RO" },
  { name: "Roraima", abbr: "RR" },
  { name: "Santa Catarina", abbr: "SC" },
  { name: "São Paulo", abbr: "SP" },
  { name: "Sergipe", abbr: "SE" },
  { name: "Tocantins", abbr: "TO" },
];

const MainInterface = () => {
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isFormValid = state && city.trim() && phone.trim();

  const formatPhone = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, "");
    
    // Limita a 11 dígitos
    const limited = numbers.slice(0, 11);
    
    // Formata: (XX) XXXXX-XXXX
    if (limited.length <= 2) {
      return limited;
    } else if (limited.length <= 7) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    } else {
      return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state) {
      setError("Por favor, selecione o estado.");
      return;
    }
    
    if (!city.trim()) {
      setError("Por favor, informe a cidade.");
      return;
    }

    if (!phone.trim()) {
      setError("Por favor, informe o celular para receber a lista.");
      return;
    }

    // Valida se tem pelo menos 10 dígitos
    const phoneNumbers = phone.replace(/\D/g, "");
    if (phoneNumbers.length < 10) {
      setError("Por favor, informe um número de celular válido.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload: { estado: string; cidade: string; bairro?: string; celular: string } = {
        estado: state,
        cidade: city.trim(),
        celular: phoneNumbers,
      };

      if (neighborhood.trim()) {
        payload.bairro = neighborhood.trim();
      }

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Erro na requisição");
      }

      setSuccess(true);
      setState("");
      setCity("");
      setNeighborhood("");
      setPhone("");
      
      // Clear success message after 8 seconds
      setTimeout(() => setSuccess(false), 8000);
    } catch (err) {
      console.error("Error:", err);
      setError("Não foi possível processar sua solicitação. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-primary">
            Takeat <span className="text-foreground">Outbound</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Geração de listas de restaurantes para prospecção
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-card rounded-2xl shadow-card border border-border p-6 md:p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Send className="w-10 h-10 text-primary" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground">
              Gerar Lista de Restaurantes
            </h2>
            <p className="text-muted-foreground mt-2">
              Informe os dados e receba a lista diretamente no seu WhatsApp
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
            {/* Phone Field */}
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-foreground flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                Celular (WhatsApp) <span className="text-destructive">*</span>
              </label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="(00) 00000-0000"
                className="h-12"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                A lista será enviada para este número via WhatsApp
              </p>
            </div>

            {/* State Field */}
            <div className="space-y-2">
              <label htmlFor="state" className="text-sm font-medium text-foreground flex items-center gap-2">
                <Map className="w-4 h-4 text-primary" />
                Estado <span className="text-destructive">*</span>
              </label>
              <Select
                value={state}
                onValueChange={(value) => {
                  setState(value);
                  setError(null);
                }}
                disabled={isLoading}
              >
                <SelectTrigger id="state" className="h-12">
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  {BRAZILIAN_STATES.map((s) => (
                    <SelectItem key={s.abbr} value={s.name}>
                      {s.name} – {s.abbr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City Field */}
            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium text-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Cidade <span className="text-destructive">*</span>
              </label>
              <Input
                id="city"
                type="text"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setError(null);
                }}
                placeholder="Digite a cidade (ex: Vitória, São Paulo)"
                className="h-12"
                disabled={isLoading}
              />
            </div>

            {/* Neighborhood Field */}
            <div className="space-y-2">
              <label htmlFor="neighborhood" className="text-sm font-medium text-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                Bairro <span className="text-muted-foreground text-xs">(opcional)</span>
              </label>
              <Input
                id="neighborhood"
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Digite o bairro (opcional)"
                className="h-12"
                disabled={isLoading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-destructive text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-start gap-3 p-4 bg-success/10 border border-success/20 rounded-lg animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <div className="text-success text-sm font-medium">
                  <p className="font-semibold">Lista enviada com sucesso! 🎉</p>
                  <p className="mt-1 opacity-90">
                    Você receberá a lista de restaurantes no seu WhatsApp em instantes.
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-14 text-base font-semibold"
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Gerar e enviar lista via WhatsApp
                </>
              )}
            </Button>
          </form>

          {/* Loading State Info */}
          {isLoading && (
            <p className="text-center text-muted-foreground text-sm mt-4">
              Buscando restaurantes e preparando envio...
              <br />
              <span className="text-xs">Isso pode levar alguns segundos.</span>
            </p>
          )}
        </div>

        {/* Footer Info */}
        <p className="text-center text-muted-foreground text-xs mt-8">
          Os dados são processados em tempo real. Nenhuma informação é armazenada.
        </p>
      </main>
    </div>
  );
};

export default MainInterface;
