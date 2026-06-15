"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, AlertCircle, Send } from "lucide-react";
import { AvailableSlot, CreateAppointmentResponse, SERVICES } from "@/types/booking";
import { Button } from "@/components/ui/Button";
import { isValidMoroccanPhone, formatShortDateFr, formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface BookingFormProps {
  selectedDate: string | null;
  selectedSlot: AvailableSlot | null;
  onSuccess: () => void;
}

type FormState = "idle" | "submitting" | "success" | "error";

export function BookingForm({ selectedDate, selectedSlot, onSuccess }: BookingFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState<string>(SERVICES[0]);
  const [notes, setNotes] = useState("");

  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!firstName.trim()) errors.firstName = "Le prénom est requis.";
    if (!lastName.trim()) errors.lastName = "Le nom est requis.";
    if (!phone.trim()) {
      errors.phone = "Le numéro de téléphone est requis.";
    } else if (!isValidMoroccanPhone(phone)) {
      errors.phone = "Veuillez entrer un numéro de téléphone marocain valide (ex : 0612345678).";
    }
    if (!selectedDate || !selectedSlot) {
      errors.slot = "Veuillez sélectionner une date et un horaire.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) return;
    if (!selectedDate || !selectedSlot) return;

    setState("submitting");

    try {
      const res = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: phone.trim(),
          service,
          appointment_date: selectedDate,
          appointment_time: selectedSlot.slot_time,
          notes: notes.trim() || undefined,
          slot_id: selectedSlot.id,
        }),
      });

      const data: CreateAppointmentResponse = await res.json();

      if (!data.success) {
        setState("error");
        setErrorMessage(data.error || "Une erreur est survenue. Veuillez réessayer.");
        return;
      }

      setState("success");
      onSuccess();

      // Redirect to WhatsApp after a brief delay so the user sees confirmation
      if (data.whatsappUrl) {
        setTimeout(() => {
          window.location.href = data.whatsappUrl!;
        }, 1200);
      }
    } catch (err) {
      console.error("Booking submission error:", err);
      setState("error");
      setErrorMessage("Une erreur réseau est survenue. Veuillez réessayer.");
    }
  };

  if (state === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center rounded-2xl bg-ivory p-10 text-center shadow-luxury"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-champagne/15">
          <CheckCircle2 className="h-8 w-8 text-champagne-dark" />
        </div>
        <h3 className="mt-5 font-display text-2xl font-semibold text-charcoal">
          Réservation Confirmée !
        </h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-charcoal-muted">
          Votre rendez-vous a été enregistré avec succès. Vous allez être redirigée vers
          WhatsApp pour finaliser votre demande avec notre équipe.
        </p>
        {selectedDate && selectedSlot && (
          <div className="mt-5 rounded-lg bg-beige/40 px-5 py-3 text-sm font-medium text-charcoal">
            {formatShortDateFr(selectedDate)} à {formatTime(selectedSlot.slot_time)}
          </div>
        )}
        <div className="mt-6 flex items-center gap-2 text-sm text-champagne-dark">
          <Loader2 className="h-4 w-4 animate-spin" />
          Redirection vers WhatsApp...
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-ivory p-6 shadow-luxury md:p-8">
      <h3 className="font-display text-lg font-semibold text-charcoal">
        Vos Informations
      </h3>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Prénom" error={fieldErrors.firstName}>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Votre prénom"
            className={inputClasses(!!fieldErrors.firstName)}
          />
        </Field>

        <Field label="Nom" error={fieldErrors.lastName}>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Votre nom"
            className={inputClasses(!!fieldErrors.lastName)}
          />
        </Field>

        <Field label="Téléphone" error={fieldErrors.phone} className="sm:col-span-2">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="06 XX XX XX XX"
            className={inputClasses(!!fieldErrors.phone)}
          />
        </Field>

        <Field label="Service" className="sm:col-span-2">
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className={inputClasses(false)}
          >
            {SERVICES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Notes (optionnel)" className="sm:col-span-2">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Informations complémentaires, demandes particulières..."
            rows={3}
            className={inputClasses(false)}
          />
        </Field>
      </div>

      {fieldErrors.slot && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {fieldErrors.slot}
        </div>
      )}

      {selectedDate && selectedSlot && (
        <div className="mt-4 rounded-lg bg-champagne/10 px-4 py-3 text-sm font-medium text-charcoal">
          Créneau sélectionné : {formatShortDateFr(selectedDate)} à{" "}
          {formatTime(selectedSlot.slot_time)}
        </div>
      )}

      {state === "error" && errorMessage && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {errorMessage}
        </div>
      )}

      <Button
        type="submit"
        variant="secondary"
        size="lg"
        disabled={state === "submitting"}
        className="mt-6 w-full"
      >
        {state === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Traitement en cours...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Confirmer la Réservation
          </>
        )}
      </Button>

      <p className="mt-3 text-center text-xs text-charcoal-muted">
        Après confirmation, vous serez redirigée vers WhatsApp pour finaliser votre
        demande avec notre équipe.
      </p>
    </form>
  );
}

function inputClasses(hasError: boolean): string {
  return cn(
    "w-full rounded-lg border bg-ivory px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/35 transition-colors focus:outline-none",
    hasError
      ? "border-red-300 focus:border-red-400"
      : "border-charcoal/15 focus:border-champagne"
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-charcoal-muted">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
