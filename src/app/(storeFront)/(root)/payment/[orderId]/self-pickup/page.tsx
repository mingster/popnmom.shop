'use client';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/providers/i18n-provider';
import { useTranslation } from '@/app/i18n/client';
import Container from '@/components/ui/container';
import { useTimer } from 'react-timer-hook';
import { OrderStatus } from '@/lib/enum';

const PaymentPage = ({ params }: { params: { orderId: string } }) => {
  const seconds = 3;
  const timeStamp = new Date(Date.now() + seconds * 1000);

  const url = `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_STORE_ID}/storeOrder/${params.orderId}/self-pickup`;
  //console.log(url);

  const body = JSON.stringify({
    checkoutAttributes: 'self-pickup',
  });
  //console.log(body);

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: body,
  })
    .then((res) => res.json())
    .then(({ order }) => {
      if (order) {
        console.log('result: ' + JSON.stringify(order));
      }
    });

  return <MyTimer expiryTimestamp={timeStamp} />;
};

function MyTimer({ expiryTimestamp }: { expiryTimestamp: Date }) {
  const router = useRouter();

  const { seconds, minutes, hours, days, isRunning, start, pause, resume, restart } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      console.warn('onExpire called');
      router.push('/account/?ordertab=' + OrderStatus[OrderStatus.Pending]);
    },
  });

  const { lng } = useI18n();
  const { t } = useTranslation(lng, 'payment-self-pickup');

  return (
    <Container>
      <h1>{t('success_title')}</h1>
      {t('success_descr')}
    </Container>
  );
}

export default PaymentPage;
