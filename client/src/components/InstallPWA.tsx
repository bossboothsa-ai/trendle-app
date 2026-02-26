import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Check if already installed
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-[100] bg-white rounded-2xl p-4 shadow-2xl border border-primary/20 animate-in slide-in-from-bottom-5 fade-in duration-500">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Download className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-sm">Install Trendle App</h4>
          <p className="text-xs text-muted-foreground">Add to home screen for a full experience.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handleInstall} className="rounded-full px-4 h-8 text-xs font-bold">
            Install
          </Button>
          <button onClick={() => setShowPrompt(false)} className="p-1 text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
