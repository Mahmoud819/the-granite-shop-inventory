import { LoginForm } from "@/components/login-form";

type LoginPageProps = {
  searchParams: Promise<{ next?: string; error?: string; mode?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const requestedPath = params.next ?? "/admin";
  const redirectTo = (requestedPath.startsWith("/inventory") || requestedPath.startsWith("/admin")) && !requestedPath.startsWith("//")
    ? requestedPath
    : "/admin";

  return (
    <LoginForm
      errorCode={params.error}
      initialMode={params.mode === "update" ? "update" : "sign-in"}
      redirectTo={redirectTo}
    />
  );
}