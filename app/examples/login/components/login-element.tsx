"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <section className="w-full max-w-sm px-4">
      <Card className="border-white/10 bg-white/95 shadow-2xl shadow-black/20">
             <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>

        <form className="flex flex-col" onSubmit={handleSubmit}>
   
          <CardContent className="flex flex-col gap-6 pb-4">
            <fieldset className="flex flex-col gap-5" disabled={disabled}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="jordan@studio.dev"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  required
                />
              </div>
            </fieldset>
          </CardContent>

          <CardFooter className="border-border/60 border-t">
            <Button type="submit" className="w-full" disabled={disabled}>
              {submitting ? "Logging in…" : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </section>
  );
};
