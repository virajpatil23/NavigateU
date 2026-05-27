import { Navigation } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function Login() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">

      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="w-full h-full">
          <defs>
            <pattern id="grid" width="40" height="40">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">

          <div className="flex flex-col items-center mb-8">

            <div className="flex items-center gap-2 mb-3">

              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-lg">

                <Navigation className="size-7 text-white"/>

              </div>

              <h1 className="text-3xl font-semibold text-gray-900">
                NavigateU
              </h1>

            </div>

            <p className="text-sm text-gray-500">
              Accessible Navigation System
            </p>

          </div>

          <form className="space-y-5">

            <div className="space-y-2">

              <Label>Email</Label>

              <Input
                type="email"
                placeholder="name@example.com"
                className="h-11 rounded-lg"
              />

            </div>

            <div className="space-y-2">

              <Label>Password</Label>

              <Input
                type="password"
                placeholder="Enter your password"
                className="h-11 rounded-lg"
              />

            </div>

            <Button className="w-full h-11 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600">

              Log in

            </Button>

          </form>

        </div>

      </div>

    </div>
  );
}