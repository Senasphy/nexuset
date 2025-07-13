import { cn } from "@/lib/utils"
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button"
import {signInWithGoogle} from '@/context/AuthContext';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm({
    email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  signInWithGoogleRedirect,
}) {

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };



  return (
    (<form onSubmit = {handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required 
                value={email}
          onChange={(e) => setEmail(e.target.value)}
/>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required value={password}
          onChange={(e) => setPassword(e.target.value)}
/>
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button variant="outline" className="w-full"
              onClick = {()=>signInWithGoogleRedirect()}>
                Login with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </form>)
  );
}
