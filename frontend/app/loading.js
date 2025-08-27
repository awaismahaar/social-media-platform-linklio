import SpinnerClient from '@/components/general/SpinnerClient';


export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <SpinnerClient />
    </div>
  );
}
