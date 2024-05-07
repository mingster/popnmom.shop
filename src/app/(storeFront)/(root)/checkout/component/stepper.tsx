import { Stepper } from 'react-form-stepper';

import { useI18n } from '@/providers/i18n-provider';
import { useTranslation } from '@/app/i18n/client';

interface CheckoutStepperProps {
  activeStep: number;
}

const CheckoutStepper: React.FC<CheckoutStepperProps> = ({ activeStep }) => {
  const { lng } = useI18n();
  const { t } = useTranslation(lng);

  return (
    <Stepper
      steps={[
        { label: t('checkoutStepper_1') },
        { label: t('checkoutStepper_2') },
        { label: t('checkoutStepper_3') },
      ]}
      activeStep={activeStep}
    />
  );
};

export default CheckoutStepper;
