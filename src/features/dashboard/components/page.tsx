import { getRouteApi, useRouter } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form-start";
import { Trash2, Plus, Upload } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

import { createNote, deleteNote } from "#/features/notes/server-fns";
import { CreateNoteInput } from "#/features/notes/schema";
import { createUploadUrl } from "#/features/uploads/server-fns";
import { FormError } from "#/components/custom/form-error";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { FieldError } from "#/components/ui/field";
import { Skeleton } from "#/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#/components/ui/table";
import { Checklist, ChecklistItem } from "#/components/custom/checklist";
import { Page } from "#/components/custom/page";
import { PageSection } from "#/components/custom/page-section";

const routeApi = getRouteApi("/_authenticated/dashboard");

const DESCRIPTION =
  "A protected route exercising the full loop: session, server functions, database, uploads.";

export function DashboardPage() {
  const { user } = routeApi.useRouteContext();
  const { notes } = routeApi.useLoaderData();
  const router = useRouter();

  const form = useForm({
    defaultValues: { title: "" },
    validators: { onSubmit: CreateNoteInput },
    onSubmit: async ({ value, formApi }) => {
      try {
        await createNote({ data: { title: value.title } });
      } catch (error) {
        formApi.setErrorMap({
          onSubmit: {
            form: error instanceof Error ? error.message : "Failed to create note",
            fields: {},
          },
        });
        return;
      }

      form.reset();
      await router.invalidate();
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (id: number) => deleteNote({ data: { id } }),
    onSuccess: () => router.invalidate(),
    onError: error => toast.error(error.message || "Failed to delete note"),
  });

  return (
    <Page
      eyebrow="Dashboard"
      title={`Welcome, ${user.name?.trim() || user.email}`}
      description={DESCRIPTION}
    >
      <Checklist ruled bordered className="mt-10 mb-12 max-w-2xl">
        <ChecklistItem label="Session" value="Active" mark="cleared" />
        <ChecklistItem
          label="Email"
          value={user.emailVerified ? user.email : `${user.email} (not verified)`}
          mark={user.emailVerified ? "cleared" : "pending"}
          stackOnMobile
        />
        <ChecklistItem label="Notes" value={<span className="tabular-nums">{notes.length}</span>} />
      </Checklist>

      <PageSection
        title="Notes"
        description="Stored in Postgres through Drizzle. Only you can see them."
      >
        <form
          onSubmit={e => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <div className="flex gap-2">
            <form.Field name="title">
              {field => (
                <Input
                  aria-label="Note title"
                  placeholder="New note title…"
                  value={field.state.value}
                  onChange={e => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={field.state.meta.errors.length > 0}
                  className="flex-1"
                />
              )}
            </form.Field>
            <form.Subscribe selector={s => s.isSubmitting || s.values.title.trim().length === 0}>
              {isDisabled => (
                <Button type="submit" disabled={isDisabled}>
                  <Plus className="size-4" />
                  Add
                </Button>
              )}
            </form.Subscribe>
          </div>

          <form.Field name="title">
            {field => <FieldError errors={field.state.meta.errors} className="mt-2" />}
          </form.Field>
        </form>

        <form.Subscribe selector={s => s.errorMap.onSubmit}>
          {formError => <FormError error={formError} />}
        </form.Subscribe>

        {notes.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">
            No notes yet. Add your first one above.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Note</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notes.map(note => (
                <TableRow key={note.id}>
                  <TableCell>{note.title}</TableCell>
                  <TableCell>
                    <span className="text-muted-foreground tabular-nums">
                      {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        disabled={
                          deleteNoteMutation.isPending && deleteNoteMutation.variables === note.id
                        }
                        aria-label={`Delete note: ${note.title}`}
                        onClick={() => deleteNoteMutation.mutate(note.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </PageSection>

      <FileUploadSection />
    </Page>
  );
}

/**
 * Route-level pending view (`/dashboard` awaits `listNotes`): the same Page shell and section
 * rhythm with the data-dependent values held as skeletons, so the swap to real data does not
 * shift the layout.
 */
export function DashboardPageSkeleton() {
  return (
    <Page
      eyebrow="Dashboard"
      title={<Skeleton className="h-9 w-72 md:h-10 md:w-80" />}
      description={DESCRIPTION}
    >
      <output className="sr-only">Loading dashboard</output>
      <div aria-busy="true">
        <Checklist ruled bordered className="mt-10 mb-12 max-w-2xl">
          {["Session", "Email", "Notes"].map(label => (
            <ChecklistItem key={label} label={label} value={<Skeleton className="h-5 w-24" />} />
          ))}
        </Checklist>

        <PageSection
          title="Notes"
          description="Stored in Postgres through Drizzle. Only you can see them."
        >
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-20" />
          </div>
          <div className="flex flex-col gap-2">
            {[0, 1, 2].map(row => (
              <Skeleton key={row} className="h-11 w-full" />
            ))}
          </div>
        </PageSection>

        <PageSection title="File upload" description={UPLOAD_DESCRIPTION}>
          <Skeleton className="h-24 w-full" />
        </PageSection>
      </div>
    </Page>
  );
}

const UPLOAD_DESCRIPTION =
  "A presigned PUT straight to S3-compatible storage. Images, PDFs and text up to 10 MB.";

function FileUploadSection() {
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useMutation({
    mutationFn: async (file: File) => {
      const { url, key } = await createUploadUrl({
        data: { filename: file.name, contentType: file.type, size: file.size },
      });

      const putRes = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!putRes.ok) throw new Error("Upload to storage failed");

      return { key, name: file.name };
    },
    onSettled: () => {
      if (inputRef.current) inputRef.current.value = "";
    },
  });

  return (
    <PageSection title="File upload" description={UPLOAD_DESCRIPTION}>
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 rounded-md border border-border p-5">
        <output className="text-sm text-muted-foreground">
          {upload.isPending ? "Uploading…" : "The browser sends the file straight to storage."}
        </output>
        <Input
          ref={inputRef}
          type="file"
          accept="image/*,application/pdf,text/plain"
          className="hidden"
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) upload.mutate(file);
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={upload.isPending}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="size-4" />
          Choose file
        </Button>
      </div>

      {upload.status === "success" ? (
        <Checklist aria-live="polite">
          <ChecklistItem
            label="Uploaded"
            value={
              <>
                {upload.data.name}
                <code className="mt-0.5 block font-mono text-xs">{upload.data.key}</code>
              </>
            }
            mark="cleared"
            stackOnMobile
          />
        </Checklist>
      ) : upload.status === "error" ? (
        <p className="text-sm text-destructive" role="alert">
          {upload.error.message}
        </p>
      ) : null}
    </PageSection>
  );
}
