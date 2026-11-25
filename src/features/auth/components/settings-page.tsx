import { getRouteApi, useNavigate, useRouter } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form-start";
import { useState } from "react";
import { KeyRound, MailCheck, Pencil, Trash2 } from "lucide-react";
import type { Passkey } from "@better-auth/passkey";
import { toast } from "sonner";
import { z } from "zod";

import { authClient } from "#/lib/auth-client";
import { accountOptions } from "#/features/auth/accounts";
import { PasswordInput } from "#/features/auth/components/password-input";
import { PasswordRequirements } from "#/features/auth/components/password-requirements";
import { PasswordSchema } from "#/features/auth/schema/password";
import { Button } from "#/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Skeleton } from "#/components/ui/skeleton";
import { FormError } from "#/components/custom/form-error";
import { Checklist, ChecklistItem } from "#/components/custom/checklist";
import { Page } from "#/components/custom/page";
import { PageSection } from "#/components/custom/page-section";

const routeApi = getRouteApi("/_authenticated/settings");

const PROVIDER_LABELS: Record<string, string> = {
  google: "Google",
  "email-otp": "Email OTP",
  credential: "Password",
};

function getProviderLabel(providerId: string) {
  return PROVIDER_LABELS[providerId] ?? providerId.charAt(0).toUpperCase() + providerId.slice(1);
}

/** Dates arrive as `Date` from the server and as strings over the passkey API. */
function formatDate(value: Date | string | null | undefined) {
  return value ? new Date(value).toLocaleDateString() : "—";
}

/** A date set in figures that line up (`tabular-nums`), for rows that show one. */
function DateValue({ value }: { value: Date | string | null | undefined }) {
  return <span className="tabular-nums">{formatDate(value)}</span>;
}

export function SettingsPage() {
  const { user } = routeApi.useRouteContext();
  const navigate = useNavigate();
  const router = useRouter();

  async function handleDeleteAccount() {
    const { error } = await authClient.deleteUser({});
    if (error) {
      toast.error(error.message ?? "Failed to delete account");
      return;
    }
    await navigate({ to: "/" });
  }

  const { data: passkeys, isPending: passkeysPending } = authClient.useListPasskeys();
  const { data: accounts, status } = useQuery(accountOptions(user.id));
  const passwordAccount = accounts?.find(account => account.providerId === "credential");
  const hasPassword = status === "success" ? Boolean(passwordAccount) : undefined;
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [editingPasskey, setEditingPasskey] = useState<Passkey | null>(null);
  const sendVerification = useMutation({
    mutationFn: async () => {
      const { error } = await authClient.sendVerificationEmail({
        email: user.email,
        callbackURL: "/settings",
      });
      if (error) {
        throw Object.assign(new Error(error.message ?? "Failed to send the verification email"), {
          code: error.code,
        });
      }
    },
    onSuccess: () => toast.success("Verification email sent. Check your inbox."),
    onError: error => {
      toast.error(error.message);
      // A different tab may already have verified the address; refresh the status in this one.
      if ("code" in error && error.code === "EMAIL_ALREADY_VERIFIED") {
        void router.invalidate();
      }
    },
  });
  const deletePasskey = useMutation({
    mutationFn: async (passkeyId: string) => {
      const { error } = await authClient.passkey.deletePasskey({ id: passkeyId });
      if (error) throw new Error(error.message ?? "Failed to delete passkey");
    },
    onError: error => toast.error(error.message),
  });
  const renamePasskey = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { error } = await authClient.passkey.updatePasskey({ id, name });
      if (error) throw new Error(error.message ?? "Failed to rename passkey");
    },
    onSuccess: () => {
      setEditingPasskey(null);
      toast.success("Passkey renamed.");
    },
    onError: error => toast.error(error.message),
  });

  return (
    <Page eyebrow="Settings" title="Account" description={DESCRIPTION}>
      <div className="mt-12">
        <PageSection title="Profile" description={SECTIONS.profile}>
          <Checklist className="max-w-xl">
            <ChecklistItem label="Email" value={user.email} />
            <ChecklistItem
              label="Email status"
              value={user.emailVerified ? "Verified" : "Not verified"}
              mark={user.emailVerified ? "cleared" : "fault"}
            />
            {user.name && <ChecklistItem label="Name" value={user.name} />}
          </Checklist>
          {!user.emailVerified && (
            <div className="flex flex-col items-start gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={sendVerification.isPending}
                onClick={() => sendVerification.mutate()}
              >
                <MailCheck className="size-4" />
                {sendVerification.isPending ? "Sending..." : "Verify email"}
              </Button>
              <FieldDescription>We will email you a link to confirm this address.</FieldDescription>
            </div>
          )}
        </PageSection>

        <PageSection title="Linked providers" description={SECTIONS.providers}>
          {status === "pending" ? (
            <div className="flex max-w-xl flex-col gap-2" aria-busy="true">
              <RowSkeleton />
              <RowSkeleton />
            </div>
          ) : status === "error" ? (
            <p className="text-sm text-destructive" role="alert">
              Could not load linked providers.
            </p>
          ) : accounts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No linked providers.</p>
          ) : (
            <Checklist className="max-w-xl">
              {accounts.map(acct => (
                <ChecklistItem
                  key={acct.id}
                  label={getProviderLabel(acct.providerId)}
                  value="Linked"
                  mark="cleared"
                />
              ))}
            </Checklist>
          )}
        </PageSection>

        <PageSection title="Password" description={SECTIONS.password}>
          {status === "pending" ? (
            <div className="flex max-w-xl flex-col gap-3" aria-busy="true">
              <RowSkeleton />
              <Skeleton className="h-8 w-36" />
            </div>
          ) : (
            <>
              <Checklist className="max-w-xl">
                <ChecklistItem
                  label="Last changed"
                  value={passwordAccount ? <DateValue value={passwordAccount.updatedAt} /> : "—"}
                />
              </Checklist>
              <div>
                <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
                  <DialogTrigger render={<Button type="button" variant="outline" size="sm" />}>
                    <KeyRound className="size-4" />
                    {hasPassword === false ? "Set a password" : "Change password"}
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {hasPassword === false ? "Set a password" : "Change password"}
                      </DialogTitle>
                      <DialogDescription>
                        {hasPassword === true
                          ? `Last changed ${formatDate(passwordAccount?.updatedAt)}. Updating it signs out your other sessions.`
                          : hasPassword === false
                            ? "This account has no password. We can email you a link to set one."
                            : "We could not load your linked accounts. You can still email a link to set or reset your password."}
                      </DialogDescription>
                    </DialogHeader>
                    <ChangePasswordForm
                      email={user.email}
                      userId={user.id}
                      hasPassword={hasPassword}
                      onDone={() => setPasswordOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </>
          )}
        </PageSection>

        <PageSection title="Passkeys" description={SECTIONS.passkeys}>
          {passkeysPending ? (
            <div className="max-w-xl" aria-busy="true">
              <PasskeyRowSkeleton />
            </div>
          ) : !passkeys || passkeys.length === 0 ? (
            <p className="text-sm text-muted-foreground">No passkeys registered.</p>
          ) : (
            <ul className="flex max-w-xl flex-col divide-y divide-border border-y border-border">
              {passkeys.map((pk: Passkey) => (
                <li key={pk.id} className="flex items-center gap-3 py-3">
                  <KeyRound aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{pk.name ?? "Passkey"}</p>
                    <p className="text-xs text-muted-foreground tabular-nums">
                      Added {formatDate(pk.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Rename passkey: ${pk.name ?? "Passkey"}`}
                      onClick={() => setEditingPasskey(pk)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={deletePasskey.isPending && deletePasskey.variables === pk.id}
                      aria-label={`Delete passkey: ${pk.name ?? "Passkey"}`}
                      onClick={() => deletePasskey.mutate(pk.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                void (async () => {
                  const { error } = await authClient.passkey.addPasskey();
                  if (error) toast.error(error.message ?? "Failed to add passkey");
                })()
              }
            >
              <KeyRound className="size-4" />
              Add passkey
            </Button>
          </div>
          <Dialog
            open={editingPasskey !== null}
            onOpenChange={open => {
              if (!open) setEditingPasskey(null);
            }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rename passkey</DialogTitle>
                <DialogDescription>Give this passkey a name you will recognise.</DialogDescription>
              </DialogHeader>
              {editingPasskey && (
                <RenamePasskeyForm
                  key={editingPasskey.id}
                  passkey={editingPasskey}
                  isPending={renamePasskey.isPending}
                  onRename={name => renamePasskey.mutate({ id: editingPasskey.id, name })}
                />
              )}
            </DialogContent>
          </Dialog>
        </PageSection>

        <PageSection title="Danger zone" description={SECTIONS.danger}>
          {confirmDelete ? (
            <div className="flex max-w-xl flex-col gap-3 border-l-2 border-destructive pl-4">
              <p className="text-sm text-destructive">
                This permanently deletes your account and all data. This cannot be undone.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="destructive-solid"
                  size="sm"
                  onClick={() => void handleDeleteAccount()}
                >
                  Yes, delete my account
                </Button>
                <Button variant="outline" size="sm" onClick={() => setConfirmDelete(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 className="size-4" />
                Delete account
              </Button>
            </div>
          )}
        </PageSection>
      </div>
    </Page>
  );
}

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password"),
  newPassword: PasswordSchema,
});

/** Change the password with the current one, or fall back to the emailed reset link. */
function ChangePasswordForm({
  email,
  userId,
  hasPassword,
  onDone,
}: {
  email: string;
  userId: string;
  hasPassword: boolean | undefined;
  onDone: () => void;
}) {
  const queryClient = useQueryClient();
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const requestReset = useMutation({
    mutationFn: async () => {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });
      if (error) throw new Error(error.message ?? "Failed to send the reset link");
    },
    onSuccess: () => {
      toast.success(
        hasPassword === false
          ? "Set-password link sent. Check your inbox."
          : "Reset link sent. Check your inbox."
      );
      onDone();
    },
    onError: error => toast.error(error.message),
  });

  const form = useForm({
    defaultValues: { currentPassword: "", newPassword: "" },
    validators: { onSubmit: changePasswordSchema },
    onSubmit: async ({ value, formApi }) => {
      const { error } = await authClient.changePassword({
        currentPassword: value.currentPassword,
        newPassword: value.newPassword,
        revokeOtherSessions: true,
      });
      if (error) {
        formApi.setErrorMap({
          onSubmit: {
            form: error.message ?? "Could not change your password.",
            fields: {},
          },
        });
        return;
      }
      form.reset();
      await queryClient.invalidateQueries({ queryKey: accountOptions(userId).queryKey });
      toast.success("Password updated. Your other sessions were signed out.");
      onDone();
    },
  });

  if (hasPassword !== true) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={requestReset.isPending}
        onClick={() => requestReset.mutate()}
      >
        {requestReset.isPending ? "Sending..." : "Email me a set-password link"}
      </Button>
    );
  }

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <div className="space-y-4">
        <form.Field name="currentPassword">
          {field => (
            <Field>
              <FieldLabel htmlFor="current-password">Current password</FieldLabel>
              <PasswordInput
                id="current-password"
                autoComplete="current-password"
                value={field.state.value}
                onChange={event => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
                aria-invalid={field.state.meta.errors.length > 0}
              />
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        </form.Field>

        <form.Field name="newPassword">
          {field => (
            <Field>
              <FieldLabel htmlFor="new-password">New password</FieldLabel>
              <PasswordInput
                id="new-password"
                autoComplete="new-password"
                value={field.state.value}
                onChange={event => field.handleChange(event.target.value)}
                onFocus={() => setShowPasswordRequirements(true)}
                onBlur={field.handleBlur}
                aria-invalid={field.state.meta.errors.length > 0}
              />
              <FieldError errors={field.state.meta.errors} />
              {showPasswordRequirements && (
                <form.Subscribe selector={state => state.values.newPassword}>
                  {password => <PasswordRequirements password={password} />}
                </form.Subscribe>
              )}
            </Field>
          )}
        </form.Field>

        <form.Subscribe selector={state => state.errorMap.onSubmit}>
          {formError => <FormError error={formError} />}
        </form.Subscribe>

        <div className="flex flex-wrap items-center gap-2">
          <form.Subscribe
            selector={state =>
              state.isSubmitting
                ? "submitting"
                : PasswordSchema.safeParse(state.values.newPassword).success
                  ? "ready"
                  : "locked"
            }
          >
            {state => (
              <Button type="submit" size="sm" disabled={state !== "ready"}>
                {state === "submitting" ? "Updating..." : "Update password"}
              </Button>
            )}
          </form.Subscribe>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={requestReset.isPending}
            onClick={() => requestReset.mutate()}
          >
            {requestReset.isPending ? "Sending..." : "Email me a reset link"}
          </Button>
        </div>

        <FieldDescription>
          Do not know your current password? Send yourself a reset link instead. Updating your
          password here signs out your other sessions; resetting it from the emailed link signs you
          out everywhere.
        </FieldDescription>
      </div>
    </form>
  );
}

function RenamePasskeyForm({
  passkey,
  isPending,
  onRename,
}: {
  passkey: Passkey;
  isPending: boolean;
  onRename: (name: string) => void;
}) {
  const [name, setName] = useState(passkey.name ?? "");
  const trimmed = name.trim();

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        if (trimmed) onRename(trimmed);
      }}
    >
      <Field>
        <FieldLabel htmlFor="passkey-name">Name</FieldLabel>
        <Input
          id="passkey-name"
          value={name}
          onChange={event => setName(event.target.value)}
          maxLength={64}
          autoComplete="off"
        />
      </Field>
      <DialogFooter className="mt-6">
        <DialogClose render={<Button type="button" variant="outline" size="sm" />}>
          Cancel
        </DialogClose>
        <Button type="submit" size="sm" disabled={isPending || !trimmed}>
          {isPending ? "Saving..." : "Save name"}
        </Button>
      </DialogFooter>
    </form>
  );
}

/**
 * Route-level pending view (`/settings` prefetches the linked accounts): the same sections and
 * row shapes as skeletons, so the swap to real data does not shift the layout.
 */
export function SettingsPageSkeleton() {
  return (
    <Page eyebrow="Settings" title="Account" description={DESCRIPTION}>
      <output className="sr-only">Loading account settings</output>
      <div className="mt-12" aria-busy="true">
        <PageSection title="Profile" description={SECTIONS.profile}>
          <div className="flex max-w-xl flex-col gap-2">
            <RowSkeleton />
            <RowSkeleton />
          </div>
        </PageSection>

        <PageSection title="Linked providers" description={SECTIONS.providers}>
          <div className="flex max-w-xl flex-col gap-2">
            <RowSkeleton />
            <RowSkeleton />
          </div>
        </PageSection>

        <PageSection title="Password" description={SECTIONS.password}>
          <div className="flex max-w-xl flex-col gap-3">
            <RowSkeleton />
            <Skeleton className="h-8 w-36" />
          </div>
        </PageSection>

        <PageSection title="Passkeys" description={SECTIONS.passkeys}>
          <div className="flex max-w-xl flex-col gap-3">
            <PasskeyRowSkeleton />
            <Skeleton className="h-8 w-32" />
          </div>
        </PageSection>

        <PageSection title="Danger zone" description={SECTIONS.danger}>
          <Skeleton className="h-8 w-36" />
        </PageSection>
      </div>
    </Page>
  );
}

const DESCRIPTION = "How you sign in, and what we know about you.";

const SECTIONS = {
  profile: "The address we send codes and links to.",
  providers: "Ways you can sign in to this account.",
  password: "Changing it signs out your other sessions.",
  passkeys: "Sign in with your device's lock instead of a password.",
  danger: "Deletes your account, notes and sessions.",
} as const;

function RowSkeleton() {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-5 w-40" />
    </div>
  );
}

function PasskeyRowSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3">
      <Skeleton className="size-4" />
      <div className="flex flex-1 flex-col gap-1.5">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}
