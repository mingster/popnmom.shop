'use client';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/providers/i18n-provider';
import { useTranslation } from '@/app/i18n/client';
import Container from '@/components/ui/container';
import { useTimer } from 'react-timer-hook';
import { OrderStatus } from '@/lib/enum';

type props = {};
export const SuccessAndRedirect = ({}: props) => {
  const seconds = 3;
  const timeStamp = new Date(Date.now() + seconds * 1000);

  return <MyTimer expiryTimestamp={timeStamp} />;
};

function MyTimer({ expiryTimestamp }: { expiryTimestamp: Date }) {
  const router = useRouter();

  const { seconds, minutes, hours, days, isRunning, start, pause, resume, restart } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      console.warn('onExpire called');
      router.push('/account/?ordertab=' + OrderStatus[OrderStatus.Processing]);
    },
  });

  const { lng } = useI18n();
  const { t } = useTranslation(lng, 'payment-paypal');

  return (
    <div className="pt-10">
      <Container>
        <h1>{t('success_title')}</h1>
        {t('success_descr')}
      </Container>
    </div>
  );
}
