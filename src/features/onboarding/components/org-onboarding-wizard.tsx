import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
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
import { API_GATEWAY_URL } from "@/config/api.config";

export interface OrgOnboardingWizardProps {
  isSuperAdmin?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function OrgOnboardingWizard({
  isSuperAdmin: isSuperAdminProp,
  onSuccess,
  onCancel,
}: OrgOnboardingWizardProps = {}) {
  const location = useLocation();
  const isSuperAdmin = isSuperAdminProp ?? location.pathname.startsWith('/superadmin');
  const initialEmail =
    (location.state as { email?: string })?.email ||
    (isSuperAdmin ? "" : localStorage.getItem("registeredOrgEmail")) ||
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

  const handleFinalSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = getValues();
      const formData = new FormData();

      // Organization Profile Details
      formData.append("organizationName", values.organizationName || "");
      formData.append("organizationEmail", values.organizationEmail || "");
      formData.append("organizationMobile", values.organizationMobile || "");
      formData.append("organizationType", values.organizationType || "");
      formData.append("address", values.address || "");
      formData.append("city", values.city || "");
      formData.append("district", values.district || "");
      formData.append("state", values.state || "");
      formData.append("pincode", values.pincode || "");
      formData.append("country", values.country || "India");

      // Statutory Document Numbers
      formData.append("panNumber", values.panNumber || "");
      formData.append("gstNumber", values.gstNumber || "");
      formData.append("regCertNumber", values.regCertNumber || "");

      // Authorized Head Details
      formData.append("orgHeadFirstName", values.orgHeadFirstName || "");
      if (values.orgHeadMiddleName) {
        formData.append("orgHeadMiddleName", values.orgHeadMiddleName);
      }
      formData.append("orgHeadLastName", values.orgHeadLastName || "");
      formData.append("orgHeadEmail", values.orgHeadEmail || "");
      formData.append("orgHeadMobile", values.orgHeadMobile || "");
      formData.append("orgHeadAadharNumber", values.orgHeadAadharNumber || "");

      // Document Files (PDF, PNG, JPG)
      if (values.panFile instanceof File) {
        formData.append("panFile", values.panFile);
      }
      if (values.gstFile instanceof File) {
        formData.append("gstFile", values.gstFile);
      }
      if (values.regCertFile instanceof File) {
        formData.append("regCertFile", values.regCertFile);
      }
      if (values.orgHeadAadharFile instanceof File) {
        formData.append("orgHeadAadharFile", values.orgHeadAadharFile);
      }

      // Submit via API Gateway (port 7001)
      const response = await fetch(`${API_GATEWAY_URL}/organization-details/register`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to submit organization registration.");
      }

      const resData = await response.json();
      const orgId = resData?.organization?.id;
      if (orgId) {
        localStorage.setItem("lastRegisteredOrgId", orgId);
      }

      toast.success("Organization details and statutory documents registered successfully!");
      setIsConfirmModalOpen(false);
      if (isSuperAdmin && onSuccess) {
        onSuccess();
      } else {
        setStep(4);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred while uploading documents.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      {isSuperAdmin ? (
        /* ── Super Admin Dashboard Theme (Clean white card, no background image) ── */
        <div className="w-full flex flex-col gap-4 animate-fadeIn">
          <div className="w-full bg-white rounded-2xl border border-[var(--border)] shadow-xs p-6 md:p-8 flex flex-col gap-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border)]/70">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl md:text-2xl font-serif font-bold text-[var(--navy)]">
                    Create Organization
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30">
                    Super Admin Form
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Fill out the institutional profile and upload statutory documents to onboard an organization directly into the system.
                </p>
              </div>

              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onCancel}
                  className="h-10 px-4 rounded-xl text-xs font-semibold bg-white border-[var(--border)] text-[var(--navy)] hover:bg-[var(--beige)] shadow-xs flex items-center gap-2 self-start sm:self-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Approvals
                </Button>
              )}
            </div>

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
              {step === 1 && <OnboardingStepInfo onNext={handleNextFromStep1} isSuperAdmin={true} />}

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
      ) : (
        /* ── Public Registration Theme (Untouched with ambient background) ── */
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
              {step === 1 && <OnboardingStepInfo onNext={handleNextFromStep1} isSuperAdmin={false} />}

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
      )}

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
