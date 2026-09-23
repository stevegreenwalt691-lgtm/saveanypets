import type { ReactNode } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Pencil } from "lucide-react";
import { Checkbox } from "@/components/ui/Checkbox";
import { formatFee } from "@/lib/pets";
import { HOME_TYPE_LABELS, type ApplicationFormValues } from "@/lib/validation/application";
import { SPECIES_APPLICATION_QUESTIONS, type Species } from "@/lib/species";
import type { MeetSlotDayGroup } from "@/lib/meet-slots";

interface StepReviewProps {
  register: UseFormRegister<ApplicationFormValues>;
  errors: FieldErrors<ApplicationFormValues>;
  values: ApplicationFormValues;
  species: Species;
  petName: string;
  adoptionFee: number | null;
  groups: MeetSlotDayGroup[];
  onEditStep: (step: number) => void;
  /** Only show the "must agree" error after a real submit attempt, not just because the checkbox starts unchecked. */
  showAgreedToTermsError: boolean;
}

function EditButton({ step, onEditStep }: { step: number; onEditStep: (step: number) => void }) {
  return (
    <button
      type="button"
      onClick={() => onEditStep(step)}
      className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:text-brand-hover"
    >
      <Pencil className="h-3.5 w-3.5" strokeWidth={1.8} />
      Edit
    </button>
  );
}

function ReviewSection({
  title,
  step,
  onEditStep,
  children,
}: {
  title: string;
  step: number;
  onEditStep: (step: number) => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[16px] bg-white/65 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-[0.5px] text-ink-3">{title}</p>
        <EditButton step={step} onEditStep={onEditStep} />
      </div>
      <dl className="mt-2 flex flex-col gap-1 text-sm text-ink-2">{children}</dl>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink-3">{label}</dt>
      <dd className="text-right font-bold text-ink">{value}</dd>
    </div>
  );
}

export function StepReview({
  register,
  errors,
  values,
  species,
  petName,
  adoptionFee,
  groups,
  onEditStep,
  showAgreedToTermsError,
}: StepReviewProps) {
  const questions = SPECIES_APPLICATION_QUESTIONS[species];
  const selectedSlot = groups.flatMap((group) => group.slots).find((slot) => slot.id === values.slot_id);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl">Review</h2>
        <p className="mt-1 text-sm text-ink-2">Check your answers before you apply.</p>
      </div>

      <ReviewSection title="About you" step={1} onEditStep={onEditStep}>
        <Row label="Name" value={values.full_name} />
        <Row label="Email" value={values.email} />
        <Row label="Phone" value={values.phone} />
        <Row label="City" value={values.city} />
      </ReviewSection>

      <ReviewSection title="Your home" step={2} onEditStep={onEditStep}>
        <Row label="Home type" value={HOME_TYPE_LABELS[values.home_type]} />
        <Row label="Own your home" value={values.owns_home ? "Yes" : "No"} />
        {!values.owns_home ? (
          <Row label="Landlord allows pets" value={values.landlord_allows_pets ? "Yes" : "No"} />
        ) : null}
        {questions.showSecureOutdoorSpace ? (
          <Row label="Secure outdoor space" value={values.has_secure_outdoor_space ? "Yes" : "No"} />
        ) : null}
        <Row label="Household size" value={String(values.household_size)} />
        <Row label="Hours alone per day" value={String(values.hours_alone)} />
      </ReviewSection>

      <ReviewSection title="Experience" step={3} onEditStep={onEditStep}>
        <Row label="Current pets" value={values.current_pets?.trim() || "None"} />
        {questions.showReptileExperience ? (
          <Row label="Reptile experience" value={values.reptile_experience?.trim() || "Not answered"} />
        ) : null}
        {questions.showUvbSetup ? (
          <Row label="Has UVB setup" value={values.has_uvb_setup ? "Yes" : "No"} />
        ) : null}
        <Row label="Reason for adopting" value={values.reason} />
      </ReviewSection>

      <ReviewSection title="Meet and greet" step={4} onEditStep={onEditStep}>
        <Row label="Time" value={selectedSlot ? `${selectedSlot.timeLabel}` : "Not chosen"} />
      </ReviewSection>

      <div className="rounded-[16px] bg-white/65 p-4">
        <p className="text-xs font-bold uppercase tracking-[0.5px] text-ink-3">Adoption fee for {petName}</p>
        <p className="mt-1 text-xl font-bold text-ink">{formatFee(adoptionFee)}</p>
        <p className="mt-2 text-sm text-ink-2">No payment is taken until after you meet {petName}.</p>
      </div>

      <Checkbox
        label="I agree to the adoption terms and confirm the information above is accurate"
        {...register("agreed_to_terms")}
      />
      {showAgreedToTermsError && errors.agreed_to_terms ? (
        <p className="text-sm text-danger">{errors.agreed_to_terms.message}</p>
      ) : null}
    </div>
  );
}
