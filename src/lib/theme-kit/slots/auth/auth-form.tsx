import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Shared auth form body used by both form-panel and centered-form variants.
 * Renders heading, email/password fields, remember/forgot row, sign-in button,
 * OR divider, GitHub button, and sign-up link.
 */
export function AuthForm(): React.JSX.Element {
  return (
    <div className="w-full max-w-sm space-y-6">
      {/* Heading block */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Sign in to your account to continue
        </p>
      </div>

      {/* Form fields */}
      <div className="space-y-4">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="auth-email">Email</Label>
          <Input
            id="auth-email"
            type="email"
            placeholder="you@example.com"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="auth-password">Password</Label>
          <Input
            id="auth-password"
            type="password"
            placeholder="••••••••"
          />
        </div>

        {/* Remember me / Forgot password row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox id="auth-remember" />
            <Label htmlFor="auth-remember" className="font-normal cursor-pointer">
              Remember me
            </Label>
          </div>
          <a href="#" className="text-sm text-primary hover:underline">
            Forgot password?
          </a>
        </div>
      </div>

      {/* Sign in button */}
      <Button className="w-full">Sign in</Button>

      {/* OR divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      {/* GitHub sign-in */}
      <Button variant="outline" className="w-full">
        <Github className="mr-2 h-4 w-4" />
        Continue with GitHub
      </Button>

      {/* Sign-up link */}
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <a href="#" className="text-primary hover:underline">
          Sign up
        </a>
      </p>
    </div>
  );
}
