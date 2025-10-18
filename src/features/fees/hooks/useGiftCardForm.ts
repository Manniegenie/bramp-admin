import { useState } from 'react';
import { createGiftCardRateAPI } from '../services/giftCardRateService';
import { toast } from 'sonner';

interface GiftCardForm {
  cardType: string;
  country: string;
  rate: string;
  physicalRate: string;
  ecodeRate: string;
  sourceCurrency: string;
  targetCurrency: string;
  minAmount: string;
  maxAmount: string;
  vanillaType: string;
  notes: string;
  isActive: boolean;
}

const initialFormState: GiftCardForm = {
  cardType: "",
  country: "",
  rate: "",
  physicalRate: "",
  ecodeRate: "",
  sourceCurrency: "USD",
  targetCurrency: "NGN",
  minAmount: "",
  maxAmount: "",
  vanillaType: "",
  notes: "",
  isActive: true,
};

export function useGiftCardForm(onSuccess?: () => Promise<void>) {
  const [form, setForm] = useState<GiftCardForm>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setForm(initialFormState);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckbox = (checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      isActive: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      cardType: form.cardType,
      country: form.country,
      rate: Number(form.rate),
      rateDisplay: form.rate.toString(),
      physicalRate: Number(form.physicalRate),
      ecodeRate: Number(form.ecodeRate),
      minAmount: Number(form.minAmount),
      maxAmount: Number(form.maxAmount),
      vanillaType: form.vanillaType,
      notes: form.notes,
      isActive: form.isActive,
    };

    try {
      const response = await createGiftCardRateAPI(payload);
      if (response) {
        toast.success("Gift card rate created successfully");
        resetForm();
        
        if (onSuccess) {
          try {
            await onSuccess();
          } catch (error) {
            console.error('Error in onSuccess callback:', error);
          }
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create rate';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    handleChange,
    handleCheckbox,
    handleSubmit,
    resetForm
  };
}