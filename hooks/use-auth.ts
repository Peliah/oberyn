"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import type { LoginFormValues } from "@/lib/auth/validate-login";
import type { RegisterFormValues } from "@/lib/auth/validate-register";
import { decodeBase64, encodeBase64 } from "@/lib/crypto/base64";
import {
  exportPublicKeySpkiBase64,
  generateIdentityKeyPair,
  generatePbkdf2Salt,
  unwrapPrivateKeyPkcs8,
  wrapPrivateKeyPkcs8,
} from "@/lib/crypto/identity";
import { loginWhisperbox, registerWhisperbox } from "@/lib/api/whisperbox-api";
import { useSession } from "@/lib/session/session-context";

export function useAuth() {
  const { setAuthenticatedSession } = useSession();

  const registerMutation = useMutation({
    mutationFn: async (values: RegisterFormValues) => {
      const salt = generatePbkdf2Salt();
      const { publicKey, privateKey } = await generateIdentityKeyPair();
      const wrappedBuf = await wrapPrivateKeyPkcs8(privateKey, values.password, salt);
      const public_key = await exportPublicKeySpkiBase64(publicKey);
      const wrapped_private_key = encodeBase64(wrappedBuf);
      const pbkdf2_salt = encodeBase64(salt);

      const res = await registerWhisperbox({
        username: values.username,
        display_name: values.displayName,
        password: values.password,
        public_key,
        wrapped_private_key,
        pbkdf2_salt,
      });

      return { res, privateKey };
    },
    onSuccess: ({ res, privateKey }) => {
      setAuthenticatedSession({
        accessToken: res.access_token,
        refreshToken: res.refresh_token,
        expiresIn: res.expires_in,
        user: res.user,
        privateKey,
      });
      toast.success("Signed up — session unlocked on this device.");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Could not create account");
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const res = await loginWhisperbox({
        username: values.username,
        password: values.password,
      });
      const salt = decodeBase64(res.user.pbkdf2_salt);
      const wrapped = decodeBase64(res.user.wrapped_private_key);
      const privateKey = await unwrapPrivateKeyPkcs8(wrapped, values.password, salt);
      return { res, privateKey };
    },
    onSuccess: ({ res, privateKey }) => {
      setAuthenticatedSession({
        accessToken: res.access_token,
        refreshToken: res.refresh_token,
        expiresIn: res.expires_in,
        user: res.user,
        privateKey,
      });
      toast.success("Signed in.");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Could not sign in");
    },
  });

  return {
    register: registerMutation.mutateAsync,
    login: loginMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    isLoggingIn: loginMutation.isPending,
  };
}
