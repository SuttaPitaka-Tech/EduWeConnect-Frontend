import { useMemo } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Building2, Lock, ArrowRight } from "lucide-react";
import {
  Button,
  Input,
  Dropdown,
  SearchDropdown,
  Textarea,
} from "@/components/ui";
import { Country, State, City } from "country-state-city";
import { ORGANIZATION_TYPE_OPTIONS } from "../constants/constants";
import type { RegisterFormValues } from "../types/types";

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
