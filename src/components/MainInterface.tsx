import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Building2, Loader2, AlertCircle, CheckCircle2, Map, FileSpreadsheet, Sparkles } from "lucide-react";

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
  const [sheetName, setSheetName] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isFormValid = sheetName.trim() && state && city.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sheetName.trim()) {
      setError("Por favor, informe o nome da planilha.");
      return;
    }

    if (!state) {
      setError("Por favor, selecione o estado.");
      return;
    }
    
    if (!city.trim()) {
      setError("Por favor, informe a cidade.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload: { nome_planilha: string; estado: string; cidade: string; bairro?: string } = {
        nome_planilha: sheetName.trim(),
        estado: state,
        cidade: city.trim(),
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
      setSheetName("");
      setState("");
      setCity("");
      setNeighborhood("");
      
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
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground">
              Gerar Lista de Restaurantes
            </h2>
            <p className="text-muted-foreground mt-2">
              Informe os dados para gerar sua lista de leads
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
            {/* Sheet Name Field */}
            <div className="space-y-2">
              <label htmlFor="sheetName" className="text-sm font-medium text-foreground flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-primary" />
                Nome da Planilha <span className="text-destructive">*</span>
              </label>
              <Input
                id="sheetName"
                type="text"
                value={sheetName}
                onChange={(e) => {
                  setSheetName(e.target.value);
                  setError(null);
                }}
                placeholder="Ex: Restaurantes Vitória Centro"
                className="h-12"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Este será o nome da planilha criada no Google Sheets
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
                  <p className="font-semibold">Lista gerada com sucesso! 🎉</p>
                  <p className="mt-1 opacity-90">
                    Sua planilha foi criada e está pronta para uso.
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
                  Gerando leads...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Gerar Leads
                </>
              )}
            </Button>
          </form>

          {/* Loading State Info */}
          {isLoading && (
            <p className="text-center text-muted-foreground text-sm mt-4">
              Buscando restaurantes e gerando planilha...
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
