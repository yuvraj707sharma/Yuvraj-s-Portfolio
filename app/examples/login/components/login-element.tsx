"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FAKE_LOGIN_DELAY_MS = 1200;

type Props = {
  onLogin: () => void;
  loggedIn: boolean;
};

export const LoginElement = ({ onLogin, loggedIn }: Props) => {
  const [submitting, setSubmitting] = useState(false);
  const disabled = loggedIn || submitting;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (disabled) return;
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, FAKE_LOGIN_DELAY_MS));
    onLogin();
  };

  return (
    <div className="bg-codrops h-full rounded-2xl p-2 backdrop-blur-sm">
      <div className="flex h-full flex-col rounded-2xl bg-white p-4">
        <header className="mb-6">
          <h1 className="text-codrops text-xl font-bold tracking-tight">
            Login
          </h1>
        </header>

        <form
          className="flex flex-1 flex-col justify-between"
          onSubmit={handleSubmit}
        >
          <fieldset className="flex flex-col gap-4" disabled={disabled}>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="login-email" className="text-slate-600">
                Email
              </Label>
              <Input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                className="border-slate-200 bg-slate-50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="login-password" className="text-slate-600">
                Password
              </Label>
              <Input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
                className="border-slate-200 bg-slate-50"
              />
            </div>
          </fieldset>

          <Button
            type="submit"
            size="lg"
            className="bg-codrops hover:bg-codrops/90 mt-1"
            disabled={disabled}
          >
            {submitting ? "Logging in…" : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
};
