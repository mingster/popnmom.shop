import { Loader } from '@/components/ui/loader';

const LoadingPage = () => {
  return (
    <div className="w-full">
      <div className="h-screen flex justify-center content-center place-items-center">
        <Loader />
      </div>
    </div>
  );
};

export default LoadingPage;
