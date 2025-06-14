import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';

const QRCodeScanner: React.FC = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  const handleResult = async (result: any, error: any) => {
    if (result && status === 'idle') {
      const data = result?.text;
      setScanResult(data);
      setStatus('idle');
      // POST to backend (replace with real endpoint)
      try {
        setStatus('idle');
        setMessage('Processing...');
        const response = await fetch('/api/loyalty/apply-stamp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: data
        });
        if (response.ok) {
          setStatus('success');
          setMessage('Stamp applied successfully!');
        } else {
          const err = await response.json();
          setStatus('error');
          setMessage(err.error || 'Failed to apply stamp');
        }
      } catch (err: any) {
        setStatus('error');
        setMessage('Network error');
      }
    } else if (error && status === 'idle') {
      setStatus('error');
      setMessage('Camera error');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="bg-white rounded-xl p-6 mb-6 text-center">
        <h1 className="text-xl font-bold mb-2">Scan QR for Stamp</h1>
        <p className="text-gray-600 mb-4">Point your camera at the business's QR code to collect a stamp.</p>
        <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-2xl overflow-hidden">
          <QrReader
            onResult={handleResult}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        {status !== 'idle' && (
          <div className={`mt-4 text-lg font-semibold ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message}</div>
        )}
      </div>
      <button className="mt-4 bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-gray-900 transition-colors" onClick={() => window.history.back()}>
        Cancel
      </button>
    </div>
  );
};

export default QRCodeScanner; 