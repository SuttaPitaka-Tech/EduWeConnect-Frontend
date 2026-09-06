import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui";
import { buddhaBg } from "@/assets/images";
import { registerSchema } from "../schemas/schemas";
import type { RegisterFormValues, PreviewDoc } from "../types/types";
import { OnboardingStepInfo } from "./onboarding-step-info";
import { OnboardingStepDocsHead } from "./onboarding-step-docs-head";
import { OnboardingStepReview } from "./onboarding-step-review";
import { OnboardingStepSuccess } from "./onboarding-step-success";
import { OnboardingPreviewModal } from "./onboarding-preview-modal";
import { OnboardingStepper } from "./onboarding-stepper";

export function OrgOnboardingWizard() {
  const location = useLocation();
  const initialEmail =
    (location.state as { email?: string })?.email ||
    localStorage.getItem("registeredOrgEmail") ||
    "";

  // Steps: 1: Org Info, 2: Docs & Head, 3: Review, 4: Success
  const [step, setStep] = useState<number>(1);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [previewDoc, setPreviewDoc] = useState<PreviewDoc | null>(null);
  const [previewingKey, setPreviewingKey] = useState<string | null>(null);
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);

  const methods = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      organizationEmail: initialEmail,
      organizationName: "",
      organizationMobile: "",
      organizationType: "",
      address: "",
      city: "",
      district: "",
      pincode: "",
      state: "",
      country: "",
      panNumber: "",
      panFile: null,
      gstNumber: "",
      gstFile: null,
      regCertNumber: "",
      regCertFile: null,
      otherDocuments: [],
      orgHeadEmail: "",
      orgHeadMobile: "",
      orgHeadFirstName: "",
      orgHeadMiddleName: "",
      orgHeadLastName: "",
      orgHeadAadharNumber: "",
      orgHeadAadharFile: null,
    },
  });

  const { trigger, getValues } = methods;

  const handleDownloadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handlePreviewDocument = (file: File, title: string, key?: string) => {
    if (key) setPreviewingKey(key);
    setTimeout(() => {
      setPreviewDoc({ title, file });
      if (key) setPreviewingKey(null);
    }, 300);
  };

  const handleDownloadFileWithSpinner = (file: File, key: string) => {
    setDownloadingKey(key);
    setTimeout(() => {
      handleDownloadFile(file);
      setDownloadingKey(null);
    }, 350);
  };

  const handleNextFromStep1 = async () => {
    const isValid = await trigger([
      "organizationEmail",
      "organizationName",
      "organizationMobile",
      "organizationType",
      "address",
      "city",
      "district",
      "pincode",
      "state",
      "country",
    ]);
    if (isValid) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextFromStep2 = async () => {
    const isValid = await trigger([
      "panNumber",
      "panFile",
      "gstNumber",
      "gstFile",
      "regCertNumber",
      "regCertFile",
      "orgHeadEmail",
      "orgHeadMobile",
      "orgHeadFirstName",
      "orgHeadLastName",
      "orgHeadAadharNumber",
      "orgHeadAadharFile",
    ]);
    if (isValid) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const email = getValues("organizationEmail");
      const name = getValues("organizationName");

      const newMockOrg = {
        id: `org-${Date.now()}`,
        email: email,
        password: "password123",
        role: "organization",
        organizationName: name,
        firstName: getValues("orgHeadFirstName") || "Org",
        lastName: getValues("orgHeadLastName") || "Head",
      };
      const existingUsers = JSON.parse(
        localStorage.getItem("mockUsers") || "[]",
      );
      localStorage.setItem(
        "mockUsers",
        JSON.stringify([...existingUsers, newMockOrg]),
      );

      setIsSubmitting(false);
      setIsConfirmModalOpen(false);
      setStep(4);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1200);
  };

  return (
    <FormProvider {...methods}>
      <div className="relative min-h-screen w-full flex items-center justify-center p-3 md:p-6 overflow-hidden bg-[var(--cream)]">
        {/* Ambient background decoration */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 bg-cover bg-center"
          style={{ backgroundImage: `url(${buddhaBg})` }}
        />

        <div className="relative w-full max-w-4xl bg-[var(--warm-white)] rounded-3xl border border-[var(--border)] shadow-xl p-5 md:p-8 flex flex-col gap-4">
          {/* Card Title & Subtitle */}
          {step <= 3 && (
            <div className="flex flex-col items-center text-center -mt-1 mb-0.5">
              <h1 className="text-xl md:text-2xl font-serif font-bold text-[var(--navy)]">
                Organization Details
              </h1>
              <p className="text-[var(--text-secondary)] font-medium text-xs md:text-sm mt-0.5">
                Please complete your organization profile.
              </p>
            </div>
          )}

          {/* Stepper Header (Visible during Steps 1-3) */}
          {step <= 3 && (
            <OnboardingStepper
              currentStep={step}
              onStepClick={(targetStep) => {
                if (targetStep < step) setStep(targetStep);
              }}
            />
          )}

          {/* Form Step Router */}
          <form
            noValidate
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-4"
          >
            {step === 1 && <OnboardingStepInfo onNext={handleNextFromStep1} />}

            {step === 2 && (
              <OnboardingStepDocsHead
                onBack={() => {
                  setStep(1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onNext={handleNextFromStep2}
                onPreviewDoc={handlePreviewDocument}
              />
            )}

            {step === 3 && (
              <OnboardingStepReview
                onBack={() => {
                  setStep(2);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onEditSection={(sectionStep) => {
                  setStep(sectionStep);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onSubmitClick={() => setIsConfirmModalOpen(true)}
                onPreviewDoc={handlePreviewDocument}
                onDownloadDoc={handleDownloadFileWithSpinner}
                previewingKey={previewingKey}
                downloadingKey={downloadingKey}
              />
            )}

            {step === 4 && <OnboardingStepSuccess />}
          </form>
        </div>
      </div>

      {/* Document Preview Modal */}
      <OnboardingPreviewModal
        doc={previewDoc}
        onClose={() => setPreviewDoc(null)}
      />

      {/* Final Confirmation Modal */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent
          maxWidth="max-w-lg"
          className="rounded-3xl p-6 border border-[var(--border)]"
        >
          <DialogHeader className="flex flex-col items-center text-center pb-2 border-b border-[var(--border)]/60">
            <div className="w-12 h-12 rounded-full bg-[var(--gold)]/15 text-[var(--gold)] flex items-center justify-center mb-2">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <DialogTitle className="text-lg font-serif font-bold text-[var(--navy)]">
              Confirm Final Submission
            </DialogTitle>
            <DialogDescription className="text-xs text-[var(--text-secondary)] mt-1">
              Please verify that all statutory details and documents provided
              are accurate.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 bg-[var(--warm-white)] border border-[var(--border)] rounded-2xl p-4 text-xs space-y-2">
            <div className="flex justify-between border-b border-[var(--border)]/40 pb-1.5">
              <span className="font-semibold text-[var(--text-muted)]">
                Organization:
              </span>
              <span className="font-bold text-[var(--navy)]">
                {getValues("organizationName")}
              </span>
            </div>
            <div className="flex justify-between border-b border-[var(--border)]/40 pb-1.5">
              <span className="font-semibold text-[var(--text-muted)]">
                Official Email:
              </span>
              <span className="font-semibold text-[var(--navy)]">
                {getValues("organizationEmail")}
              </span>
            </div>
            <div className="flex justify-between border-b border-[var(--border)]/40 pb-1.5">
              <span className="font-semibold text-[var(--text-muted)]">
                Authorized Head:
              </span>
              <span className="font-semibold text-[var(--navy)]">
                {`${getValues("orgHeadFirstName")} ${getValues("orgHeadLastName")}`.trim()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-[var(--text-muted)]">
                Documents Attached:
              </span>
              <span className="font-bold text-emerald-600">
                PAN, GST, Reg Cert & Aadhar
              </span>
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-3 mt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsConfirmModalOpen(false)}
              className="px-4 h-[40px] rounded-xl text-xs font-semibold bg-[var(--warm-white)] border border-[var(--border)] text-[var(--navy)] hover:bg-[var(--beige)]"
            >
              Go Back & Edit
            </Button>
            <Button
              type="button"
              variant="gold"
              isLoading={isSubmitting}
              onClick={handleFinalSubmit}
              className="px-6 h-[40px] rounded-xl font-bold text-xs shadow-md"
            >
              Confirm & Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
}
