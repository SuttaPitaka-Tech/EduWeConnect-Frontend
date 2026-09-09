import { useMemo, useState, useRef, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  Building2,
  Lock,
  ArrowRight,
  X,
  Search,
  Check,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import {
  Button,
  Input,
  Dropdown,
  SearchDropdown,
  Textarea,
} from "@/components/ui";
import { Country, State, City } from "country-state-city";
import { ORGANIZATION_TYPE_OPTIONS, ORGANIZATION_STD_OPTIONS } from "../constants/constants";
import type { RegisterFormValues } from "../types/types";

const PRESETS = [
  {
    id: "all",
    label: `Select All (${ORGANIZATION_STD_OPTIONS.length})`,
    standards: ORGANIZATION_STD_OPTIONS.map((o) => o.value),
  },
  {
    id: "pre_primary",
    label: "Pre-Primary (Pre School - UKG)",
    standards: ["Pre School", "Nursery", "LKG", "UKG"],
  },
  {
    id: "school",
    label: "1st - 10th Std",
    standards: [
      "1st Std",
      "2nd Std",
      "3rd Std",
      "4th Std",
      "5th Std",
      "6th Std",
      "7th Std",
      "8th Std",
      "9th Std",
      "10th Std",
    ],
  },
  {
    id: "puc",
    label: "PUC (1st & 2nd)",
    standards: ["1st PUC", "2nd PUC"],
  },
  {
    id: "degree",
    label: "Degree",
    standards: ["Degree"],
  },
];

interface OnboardingStepInfoProps {
  onNext: () => void;
  isSuperAdmin?: boolean;
}

export function OnboardingStepInfo({ onNext, isSuperAdmin = false }: OnboardingStepInfoProps) {
  const {
    register,
    control,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext<RegisterFormValues>();

  const selectedCountry = watch("country");
  const selectedState = watch("state");

  const countryOptions = useMemo(() => {
    return Country.getAllCountries().map((c: any) => ({
      value: c.isoCode,
      label: c.name,
    }));
  }, []);

  const stateOptions = useMemo(() => {
    if (!selectedCountry) return [];
    return State.getStatesOfCountry(selectedCountry).map((s: any) => ({
      value: s.isoCode,
      label: s.name,
    }));
  }, [selectedCountry]);

  const cityOptions = useMemo(() => {
    if (!selectedCountry || !selectedState) return [];
    return City.getCitiesOfState(selectedCountry, selectedState).map(
      (c: any) => ({ value: c.name, label: c.name }),
    );
  }, [selectedCountry, selectedState]);

  const currentStandards = watch("organization_std") || [];
  const [isStdDropdownOpen, setIsStdDropdownOpen] = useState(false);
  const [stdSearchQuery, setStdSearchQuery] = useState("");
  const stdDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isStdDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        stdDropdownRef.current &&
        !stdDropdownRef.current.contains(e.target as Node)
      ) {
        setIsStdDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isStdDropdownOpen]);

  // Keep standards ordered by curriculum level
  const sortStandards = (stds: string[]) => {
    const allValues = ORGANIZATION_STD_OPTIONS.map((o) => o.value);
    return [...stds].sort((a, b) => {
      const idxA = allValues.indexOf(a);
      const idxB = allValues.indexOf(b);
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    });
  };

  const handleToggleStandard = (std: string) => {
    let updated: string[];
    if (currentStandards.includes(std)) {
      updated = currentStandards.filter((item) => item !== std);
    } else {
      updated = sortStandards([...currentStandards, std]);
    }
    setValue("organization_std", updated, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleSelectAllStandards = () => {
    const allValues = ORGANIZATION_STD_OPTIONS.map((o) => o.value);
    setValue("organization_std", allValues, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleClearAllStandards = () => {
    setValue("organization_std", [], {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleTogglePreset = (presetStandards: string[]) => {
    const allIncluded = presetStandards.every((s) =>
      currentStandards.includes(s),
    );
    let updated: string[];
    if (allIncluded) {
      updated = currentStandards.filter((s) => !presetStandards.includes(s));
    } else {
      const combined = Array.from(
        new Set([...currentStandards, ...presetStandards]),
      );
      updated = sortStandards(combined);
    }
    setValue("organization_std", updated, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const filteredStdOptions = useMemo(() => {
    if (!stdSearchQuery.trim()) return ORGANIZATION_STD_OPTIONS;
    const q = stdSearchQuery.toLowerCase();
    return ORGANIZATION_STD_OPTIONS.filter((opt) =>
      opt.label.toLowerCase().includes(q),
    );
  }, [stdSearchQuery]);

  return (
    <div className="space-y-3.5 animate-fadeIn">
      <div className="flex items-center gap-2 pb-1 mb-1">
        <Building2 className="w-4 h-4 text-[var(--gold)]" />
        <h3 className="text-xs font-bold text-[var(--navy)] uppercase tracking-wider">
          Step 1: Institutional Information
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Row 1: Organization Email & Organization Name */}
        <div>
          <label className="block text-[11px] font-semibold text-[var(--navy)] uppercase mb-1">
            Organization Email *
          </label>
          <div className="relative">
            <Input
              {...register("organizationEmail")}
              type="email"
              readOnly={!isSuperAdmin}
              placeholder="organization@domain.com"
              className={`h-[40px] pl-3 ${
                isSuperAdmin
                  ? "pr-3 font-medium bg-white"
                  : "pr-9 font-semibold select-none bg-[var(--cream)] cursor-not-allowed"
              } rounded-xl text-[13px]`}
            />
            {!isSuperAdmin && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--gold)] opacity-75">
                <Lock className="w-4 h-4" />
              </div>
            )}
          </div>
          {errors.organizationEmail && (
            <p className="text-[11px] font-medium text-red-500 mt-0.5">
              {errors.organizationEmail.message as string}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-[var(--navy)] uppercase mb-1">
            Organization Name *
          </label>
          <Input
            {...register("organizationName")}
            placeholder="e.g. Nalanda University"
            error={!!errors.organizationName}
            className="h-[40px] pl-3 rounded-xl text-[13px]"
          />
          {errors.organizationName && (
            <p className="text-[11px] font-medium text-red-500 mt-0.5">
              {errors.organizationName.message as string}
            </p>
          )}
        </div>

        {/* Row 2: Organization Type & Organization Mobile */}
        <div>
          <label className="block text-[11px] font-semibold text-[var(--navy)] uppercase mb-1">
            Organization Type *
          </label>
          <Controller
            name="organizationType"
            control={control}
            render={({ field }) => (
              <Dropdown
                options={ORGANIZATION_TYPE_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select Organization Type"
                invalid={!!errors.organizationType}
                className="h-[40px] rounded-xl text-[13px]"
              />
            )}
          />
          {errors.organizationType && (
            <p className="text-[11px] font-medium text-red-500 mt-0.5">
              {errors.organizationType.message as string}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-[var(--navy)] uppercase mb-1">
            Organization Mobile *
          </label>
          <Input
            {...register("organizationMobile")}
            type="tel"
            inputMode="numeric"
            placeholder="10-digit Mobile Number"
            maxLength={10}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 10);
              setValue("organizationMobile", val, {
                shouldValidate: !!errors.organizationMobile,
                shouldDirty: true,
              });
            }}
            onBlur={() => trigger("organizationMobile")}
            error={!!errors.organizationMobile}
            className="h-[40px] pl-3 rounded-xl text-[13px]"
          />
          {errors.organizationMobile && (
            <p className="text-[11px] font-medium text-red-500 mt-0.5">
              {errors.organizationMobile.message as string}
            </p>
          )}
        </div>

        {/* Organization Standards */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[11px] font-semibold text-[var(--navy)] uppercase">
              Organization Standards / Classes Offered
            </label>
            {currentStandards.length > 0 && (
              <span className="text-[11px] font-bold text-[var(--gold)]">
                {currentStandards.length} of {ORGANIZATION_STD_OPTIONS.length} Selected
              </span>
            )}
          </div>

          {/* Quick Preset Buttons Row for Instant 1-Click Addition */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <span className="text-[11px] font-semibold text-[var(--text-muted)] flex items-center gap-1 mr-1">
              <Sparkles className="w-3 h-3 text-[var(--gold)]" /> Quick Select:
            </span>

            <button
              type="button"
              onClick={handleSelectAllStandards}
              className={`h-7 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer border flex items-center gap-1 shadow-2xs ${
                currentStandards.length === ORGANIZATION_STD_OPTIONS.length
                  ? "bg-[var(--navy)] text-white border-[var(--navy)]"
                  : "bg-white text-[var(--navy)] border-[var(--gold)]/40 hover:bg-[var(--gold)]/15 hover:border-[var(--gold)]"
              }`}
              title="Select all standards in one click"
            >
              Select All ({ORGANIZATION_STD_OPTIONS.length})
            </button>

            {PRESETS.slice(1).map((preset) => {
              const allIncluded = preset.standards.every((s) =>
                currentStandards.includes(s),
              );
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleTogglePreset(preset.standards)}
                  className={`h-7 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border flex items-center gap-1 shadow-2xs ${
                    allIncluded
                      ? "bg-[var(--navy)] text-white border-[var(--navy)]"
                      : "bg-white text-[var(--navy)] border-[var(--border)] hover:bg-[var(--cream)]/60 hover:border-[var(--gold)]/50"
                  }`}
                >
                  {allIncluded && <Check className="w-3 h-3 text-[var(--gold)]" />}
                  <span>{preset.label}</span>
                </button>
              );
            })}

            {currentStandards.length > 0 && (
              <button
                type="button"
                onClick={handleClearAllStandards}
                className="h-7 px-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 hover:border-red-200 border border-transparent transition-colors cursor-pointer ml-auto"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Interactive Multi-Select Dropdown with Checkboxes */}
          <div ref={stdDropdownRef} className="relative w-full">
            <button
              type="button"
              onClick={() => setIsStdDropdownOpen((prev) => !prev)}
              className={`w-full min-h-[42px] px-3 py-1.5 rounded-xl border bg-white text-left flex items-center justify-between gap-2 transition-all cursor-pointer shadow-2xs ${
                isStdDropdownOpen
                  ? "border-[var(--gold)] ring-2 ring-[var(--gold)]/20"
                  : "border-[var(--border)] hover:border-[var(--gold)]/60"
              }`}
            >
              <div className="flex-1 flex flex-wrap items-center gap-1.5">
                {currentStandards.length === 0 ? (
                  <span className="text-[13px] text-[var(--text-muted)]">
                    Click to select standards from checklist (or use Quick Select above)...
                  </span>
                ) : (
                  <>
                    <span className="text-xs font-bold text-[var(--navy)] bg-[var(--gold)]/15 px-2 py-0.5 rounded-md border border-[var(--gold)]/30">
                      {currentStandards.length} Selected
                    </span>
                    <span className="text-xs text-[var(--text-secondary)] truncate">
                      {currentStandards.slice(0, 4).join(", ")}
                      {currentStandards.length > 4 ? ` +${currentStandards.length - 4} more` : ""}
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0 text-[var(--text-muted)]">
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isStdDropdownOpen ? "rotate-180 text-[var(--gold)]" : ""
                  }`}
                />
              </div>
            </button>

            {/* Checklist Dropdown Popover */}
            {isStdDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white border border-[var(--gold)]/40 rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
                {/* Search Bar & Header */}
                <div className="p-2.5 border-b border-[var(--border)]/70 bg-[var(--cream)]/25 space-y-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      value={stdSearchQuery}
                      onChange={(e) => setStdSearchQuery(e.target.value)}
                      placeholder="Search standard (e.g. 5th, PUC, Nursery)..."
                      className="w-full h-8 pl-8 pr-7 text-xs rounded-lg border border-[var(--border)] bg-white focus:border-[var(--gold)] focus:outline-none"
                    />
                    {stdSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setStdSearchQuery("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] px-0.5">
                    <span className="font-semibold text-[var(--navy)]">
                      Check any standard to add/remove immediately:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSelectAllStandards}
                        className="text-[var(--navy)] hover:text-[var(--gold)] font-bold cursor-pointer"
                      >
                        Select All
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        type="button"
                        onClick={handleClearAllStandards}
                        className="text-red-500 hover:text-red-700 font-bold cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>

                {/* Checklist Options */}
                <div className="max-h-60 overflow-y-auto p-2 grid grid-cols-1 sm:grid-cols-2 gap-1 bg-white">
                  {filteredStdOptions.length === 0 ? (
                    <div className="col-span-2 py-4 text-center text-xs text-[var(--text-muted)]">
                      No standards matching "{stdSearchQuery}"
                    </div>
                  ) : (
                    filteredStdOptions.map((opt) => {
                      const isSelected = currentStandards.includes(opt.value);
                      return (
                        <div
                          key={opt.value}
                          onClick={() => handleToggleStandard(opt.value)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors select-none ${
                            isSelected
                              ? "bg-[var(--gold)]/15 text-[var(--navy)] font-bold border border-[var(--gold)]/40"
                              : "text-gray-700 hover:bg-gray-50 border border-transparent"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                              isSelected
                                ? "bg-[var(--navy)] text-white"
                                : "border border-gray-300 bg-white"
                            }`}
                          >
                            {isSelected && (
                              <Check
                                className="w-3 h-3 text-[var(--gold)]"
                                strokeWidth={3}
                              />
                            )}
                          </div>
                          <span>{opt.label}</span>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer Bar */}
                <div className="px-3 py-2 border-t border-[var(--border)]/70 bg-[var(--cream)]/15 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[var(--text-muted)] font-medium">
                    {currentStandards.length} standards selected
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsStdDropdownOpen(false)}
                    className="px-3 py-1 bg-[var(--navy)] text-white text-xs font-bold rounded-lg hover:bg-[var(--navy)]/90 cursor-pointer shadow-2xs"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Selected Standards Badges with Cancel Icon */}
          <div className="mt-2 min-h-[38px] p-2 bg-[var(--cream)]/40 border border-[var(--gold)]/25 rounded-xl flex flex-wrap items-center gap-1.5">
            {currentStandards.length === 0 ? (
              <span className="text-[11px] text-[var(--text-secondary)] italic px-1">
                No standards selected yet. Use the Quick Select buttons or open the checklist above.
              </span>
            ) : (
              currentStandards.map((std: string) => (
                <span
                  key={std}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[var(--gold)]/40 rounded-lg text-xs font-bold text-[var(--navy)] shadow-2xs animate-fadeIn hover:border-[var(--gold)]"
                >
                  <span>{std}</span>
                  <button
                    type="button"
                    onClick={() => handleToggleStandard(std)}
                    className="p-0.5 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title={`Remove ${std}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Row 3: Address (Full Width) */}
        <div className="md:col-span-2">
          <label className="block text-[11px] font-semibold text-[var(--navy)] uppercase mb-1">
            Address *
          </label>
          <Textarea
            {...register("address")}
            placeholder="Full Street Address"
            error={!!errors.address}
            className="rounded-xl text-[13px] min-h-[60px]"
          />
          {errors.address && (
            <p className="text-[11px] font-medium text-red-500 mt-0.5">
              {errors.address.message as string}
            </p>
          )}
        </div>

        {/* Country */}
        <div>
          <label className="block text-[11px] font-semibold text-[var(--navy)] uppercase mb-1">
            Country *
          </label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <SearchDropdown
                options={countryOptions}
                value={field.value}
                onChange={(val) => {
                  field.onChange(val);
                  setValue("state", "");
                  setValue("city", "");
                }}
                placeholder="Select Country"
                searchPlaceholder="Search Country..."
                invalid={!!errors.country}
                className="h-[40px] rounded-xl text-[13px]"
              />
            )}
          />
          {errors.country && (
            <p className="text-[11px] font-medium text-red-500 mt-0.5">
              {errors.country.message as string}
            </p>
          )}
        </div>

        {/* State */}
        <div>
          <label className="block text-[11px] font-semibold text-[var(--navy)] uppercase mb-1">
            State *
          </label>
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <SearchDropdown
                options={stateOptions}
                value={field.value}
                onChange={(val) => {
                  field.onChange(val);
                  setValue("city", "");
                }}
                placeholder={
                  selectedCountry ? "Select State" : "Select Country First"
                }
                searchPlaceholder="Search State..."
                disabled={!selectedCountry}
                invalid={!!errors.state}
                className="h-[40px] rounded-xl text-[13px]"
              />
            )}
          />
          {errors.state && (
            <p className="text-[11px] font-medium text-red-500 mt-0.5">
              {errors.state.message as string}
            </p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-[11px] font-semibold text-[var(--navy)] uppercase mb-1">
            City / Village *
          </label>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <SearchDropdown
                options={cityOptions}
                value={field.value}
                onChange={field.onChange}
                placeholder={
                  selectedState ? "Select City" : "Select State First"
                }
                searchPlaceholder="Search City..."
                disabled={!selectedState}
                invalid={!!errors.city}
                className="h-[40px] rounded-xl text-[13px]"
              />
            )}
          />
          {errors.city && (
            <p className="text-[11px] font-medium text-red-500 mt-0.5">
              {errors.city.message as string}
            </p>
          )}
        </div>

        {/* District */}
        <div>
          <label className="block text-[11px] font-semibold text-[var(--navy)] uppercase mb-1">
            District *
          </label>
          <Input
            {...register("district")}
            placeholder="District Name"
            error={!!errors.district}
            className="h-[40px] pl-3 rounded-xl text-[13px]"
          />
          {errors.district && (
            <p className="text-[11px] font-medium text-red-500 mt-0.5">
              {errors.district.message as string}
            </p>
          )}
        </div>

        {/* Pin Code */}
        <div>
          <label className="block text-[11px] font-semibold text-[var(--navy)] uppercase mb-1">
            Pin Code *
          </label>
          <Input
            {...register("pincode")}
            type="tel"
            inputMode="numeric"
            placeholder="6-digit Pin Code"
            maxLength={6}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 6);
              setValue("pincode", val, {
                shouldValidate: !!errors.pincode,
                shouldDirty: true,
              });
            }}
            onBlur={() => trigger("pincode")}
            error={!!errors.pincode}
            className="h-[40px] pl-3 rounded-xl text-[13px]"
          />
          {errors.pincode && (
            <p className="text-[11px] font-medium text-red-500 mt-0.5">
              {errors.pincode.message as string}
            </p>
          )}
        </div>
      </div>

      {/* Step 1 Actions */}
      <div className="flex justify-end items-center pt-3 border-t border-[var(--gold)]/20 mt-4">
        <Button
          type="button"
          variant="gold"
          onClick={onNext}
          className="px-7 h-[42px] rounded-xl font-bold text-[13.5px] flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all"
        >
          Next: Documents <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
