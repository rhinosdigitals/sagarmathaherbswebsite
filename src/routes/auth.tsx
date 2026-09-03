import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Leaf, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ensureAdminAccount } from "@/lib/admin-seed.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Sign In — Himalaya Naturals" },
      { name: "description", content: "Sign in to manage products, content and social settings." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Sign In — Himalaya Naturals" },
      { property: "og:description", content: "Staff sign-in for the Himalaya Naturals admin panel." },
    ],
  }),
  component: AuthPage,
});

const ADMIN_USERNAME = "Admin";
const ADMIN_EMAIL = "admin@himalayanaturals.com";

function AuthPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(ADMIN_USERNAME);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void ensureAdminAccount();
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) void navigate({ to: "/admin" });
    });
  }, [navigate]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const entered = username.trim();
    const email = entered.includes("@")
      ? entered
      : entered.toLowerCase() === ADMIN_USERNAME.toLowerCase()
        ? ADMIN_EMAIL
        : "";
    if (!email) {
      toast.error("Unknown username");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Signed in");
    void navigate({ to: "/admin" });
  };

  return (
    <div className="leaf-gradient flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-8 shadow-lift">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Leaf className="size-4.5" aria-hidden="true" />
          </span>
          <span className="font-display text-lg font-semibold">Himalaya Naturals</span>
        </Link>

        <h1 className="mt-7 text-xl font-semibold">Admin sign in</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Use the username and password provided to you.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              autoComplete="username"
              required
              maxLength={160}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              minLength={6}
              maxLength={200}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}
