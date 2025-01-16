"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const VerificationPage: React.FC = () => {
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push('/password');
  };
  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: 'url(/bg.jpg)' }}
    >
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="relative z-10 w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-center text-2xl text-gray-800 font-semibold mt-4">Enter Verification Code</h2>
        <div className="mt-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Verification Code</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
                placeholder="Enter code sent to email"
                required
              />
            </div>
            {errorMessage && (
              <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
            )}
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Continue
            </button>
          </form>
        </div>
        <div className="text-center mt-6">
          <p>
            Didn't receive code?{' '}
            <a href="/login" className="text-blue-600">
              Resend code
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
export default VerificationPage;
