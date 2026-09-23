"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Stepper } from "@/components/ui/Stepper";
import { TurnstileWidget } from "@/components/forms/TurnstileWidget";
import { StepAboutYou } from "./StepAboutYou";
import { StepHome } from "./StepHome";
import { StepExperience } from "./StepExperience";
import { StepMeetGreet } from "./StepMeetGreet";
import { StepReview } from "./StepReview";
import {
  APPLICATION_DEFAULT_VALUES,
  APPLICATION_STEPS,
  STEP_FIELDS,
  buildApplicationSchema,
  type ApplicationFormValues,
} from "@/lib/validation/application";
import { submitApplication } from "@/lib/actions/applications";
import type { Species } from "@/lib/species";
import type { MeetSlotDayGroup } from "@/lib/meet-slots";

interface ApplicationWizardProps {
  petSlug: string;
  petName: string;
  species: Species;
  adoptionFee: number | null;
  meetSlotGroups: MeetSlotDayGroup[];
  turnstileSiteKey: string;
}

function storageKey(petSlug: string) {
  return `saveanypets:apply:${petSlug}`;
}

export function ApplicationWizard({
  petSlug,
  petName,
  species,
  adoptionFee,
  meetSlotGroups,
  turnstileSiteKey,
}: ApplicationWizardProps) {
  const router = useRouter();
  // Plain state, not a ref: reading a ref inside handleSubmit's callback is flagged as an
  // unsafe render-time access by the React Compiler.
  const [honeypotValue, setHoneypotValue] = useState("");
  const [step, setStep] = useState(1);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    getValues,
    setError,
    formState: { errors },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(buildApplicationSchema(species)),
    defaultValues: APPLICATION_DEFAULT_VALUES,
  });

  const hasMountedRef = useRef(false);

  // Restore progress from an earlier visit, if any.
  useEffect(() => {
    const raw = window.sessionStorage.getItem(storageKey(petSlug));
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as { step?: number; values?: Partial<ApplicationFormValues> };
      if (parsed.values) reset({ ...APPLICATION_DEFAULT_VALUES, ...parsed.values });
      if (parsed.step) setStep(parsed.step);
    } catch {
      // Ignore malformed storage.
    }
    // Only run once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const values = watch();

  // A step change alone (no field edited yet) still needs to be saved, otherwise a refresh
  // right after "Next" drops back a step.
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    window.sessionStorage.setItem(storageKey(petSlug), JSON.stringify({ step, values: getValues() }));
  }, [step, petSlug, getValues]);

  // Keep progress saved as the visitor types, so a refresh does not lose answers.
  useEffect(() => {
    const subscription = watch((formValues) => {
      window.sessionStorage.setItem(storageKey(petSlug), JSON.stringify({ step, values: formValues }));
    });
    return () => subscription.unsubscribe();
  }, [watch, step, petSlug]);

  async function goNext() {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((current) => Math.min(current + 1, APPLICATION_STEPS.length));
  }

  function goBack() {
    setStep((current) => Math.max(current - 1, 1));
  }

  const onSubmit = handleSubmit(
    (data) => {
      setHasAttemptedSubmit(true);
      setFormError(null);
      if (!turnstileToken) {
        setFormError("Please complete the verification above.");
        return;
      }

      startTransition(async () => {
        const result = await submitApplication({
          petSlug,
          hp_field: honeypotValue,
          turnstileToken,
          values: data,
        });

        if (!result.ok) {
          let firstErrorStep: number | null = null;
          for (const [field, messages] of Object.entries(result.errors)) {
            const message = messages?.[0];
            if (!message) continue;
            if (field === "form") {
              setFormError(message);
              continue;
            }
            setError(field as keyof ApplicationFormValues, { message });
            const stepEntry = Object.entries(STEP_FIELDS).find(([, stepFields]) =>
              (stepFields as string[]).includes(field),
            );
            if (stepEntry && firstErrorStep === null) firstErrorStep = Number(stepEntry[0]);
          }
          if (firstErrorStep !== null) setStep(firstErrorStep);
          return;
        }

        window.sessionStorage.removeItem(storageKey(petSlug));
        router.push(`/adopt/${petSlug}/apply/success`);
      });
    },
    () => setHasAttemptedSubmit(true),
  );

  return (
    <GlassCard strong className="lg:col-start-1 lg:row-start-1">
      <Stepper steps={[...APPLICATION_STEPS]} currentStep={step} />

      <form onSubmit={onSubmit} noValidate className="mt-8 flex flex-col gap-8">
        {/* Honeypot: a name real form fields never use, so autofill and password managers leave it alone. */}
        <div hidden aria-hidden="true">
          <label htmlFor="hp_confirm_blank">Leave this field blank</label>
          <input
            id="hp_confirm_blank"
            name="hp_confirm_blank"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypotValue}
            onChange={(event) => setHoneypotValue(event.target.value)}
          />
        </div>

        {step === 1 ? <StepAboutYou register={register} errors={errors} /> : null}
        {step === 2 ? (
          <StepHome register={register} errors={errors} species={species} ownsHome={values.owns_home} />
        ) : null}
        {step === 3 ? (
          <StepExperience register={register} errors={errors} species={species} petName={petName} />
        ) : null}
        {step === 4 ? (
          <StepMeetGreet
            register={register}
            errors={errors}
            groups={meetSlotGroups}
            selectedSlotId={values.slot_id}
          />
        ) : null}
        {step === 5 ? (
          <>
            <StepReview
              register={register}
              errors={errors}
              values={values}
              species={species}
              petName={petName}
              adoptionFee={adoptionFee}
              groups={meetSlotGroups}
              onEditStep={setStep}
              showAgreedToTermsError={hasAttemptedSubmit}
            />
            <TurnstileWidget
              siteKey={turnstileSiteKey}
              onVerify={setTurnstileToken}
              onExpire={() => setTurnstileToken("")}
            />
          </>
        ) : null}

        {formError ? <p className="text-sm text-danger">{formError}</p> : null}

        <div className="flex items-center justify-between gap-3">
          {step > 1 ? (
            <Button type="button" variant="outline" pill={false} onClick={goBack}>
              Back
            </Button>
          ) : (
            <span />
          )}
          {step < APPLICATION_STEPS.length ? (
            <Button type="button" pill={false} onClick={goNext}>
              Next
            </Button>
          ) : (
            <Button type="submit" pill={false} disabled={isPending}>
              {isPending ? "Submitting..." : "Submit application"}
            </Button>
          )}
        </div>
      </form>
    </GlassCard>
  );
}
