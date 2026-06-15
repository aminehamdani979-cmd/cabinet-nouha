"use client";

import { useState, FormEvent } from "react";
import { Lock, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AdminLoginProps {
  onSuccess: () => void;
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Mot de passe incorrect.");
        return;
      }

      onSuccess();
    } catch (err) {
      console.error(err);
      setError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal px-6">
      <div className="w-full max-w-sm rounded-2xl bg-ivory p-8 shadow-luxury">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-champagne/15">
            <Lock className="h-6 w-6 text-champagne-dark" />
          </div>
          <h1 className="mt-5 font-display text-2xl font-semibold text-charcoal">
            Cabinet <span className="text-champagne-dark">Nouha</span>
          </h1>
          <p className="mt-1 text-xs uppercase tracking-luxury text-charcoal-muted">
            Tableau de Bord Administrateur
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-charcoal-muted">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoFocus
              className="w-full rounded-lg border border-charcoal/15 bg-ivory px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/35 transition-colors focus:border-champagne focus:outline-none"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <Button type="submit" variant="secondary" size="lg" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Connexion...
              </>
            ) : (
              "Se Connecter"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
