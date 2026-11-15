'use client';

import { useState } from 'react';

import Button from '../ui/button';
import ChangePasswordDialog from './change-password-dialog';

export default function SecuritySection() {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-medium">Security</h2>

          <p className="mt-1 text-sm text-white/40">Keep your account secure by updating your password regularly.</p>
        </div>

        <Button type="button" onClick={() => setOpen(true)}>
          Change Password
        </Button>
      </div>

      <ChangePasswordDialog open={open} onOpenChange={setOpen} />
    </section>
  );
}
