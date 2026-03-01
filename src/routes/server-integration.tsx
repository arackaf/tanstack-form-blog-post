import { createFileRoute } from "@tanstack/react-router";

import { useForm, formOptions, createServerValidate, ServerValidateError, getFormData, useTransform, mergeForm } from "@tanstack/react-form-start";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { createServerFn } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";

import { deleteCookie, getCookie, setCookie, setResponseStatus } from "@tanstack/react-start/server";

interface Product {
  name: string;
  metadata: { name: string; value: string }[];
}
const defaultProduct: Product = {
  name: "",
  metadata: [],
};

const successfulFormStateCookieName = "server-integration-success-form-state";

function getRedirectHeadersFromResponse(response: Response) {
  const redirectHeaders = new Headers();
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") {
      redirectHeaders.append(key, value);
    }
  });
  return redirectHeaders;
}

export const formOpts = formOptions({
  defaultValues: defaultProduct,
});

export const handleForm = createServerFn({
  method: "POST",
})
  .inputValidator((data: unknown) => {
    console.log("data", data);
    if (!(data instanceof FormData)) {
      console.log("invalid form data");
      throw new Error("Invalid form data");
    }
    return data;
  })
  .handler(async (ctx) => {
    try {
      console.log("starting server validation");
      const validatedData = await serverValidate(ctx.data);
      console.log("validatedData", validatedData);

      // Persist successful values for the next GET after redirect.
      setCookie(successfulFormStateCookieName, JSON.stringify(validatedData));
    } catch (e) {
      if (e instanceof ServerValidateError) {
        console.log("server validate error", e.response);
        throw redirect({
          to: "/server-integration",
          headers: getRedirectHeadersFromResponse(e.response),
        });
      }

      // Some other error occurred when parsing the form
      console.error(e);
      setResponseStatus(500);
      throw redirect({ to: "/server-integration" });
    }

    throw redirect({ to: "/server-integration" });
  });

const serverValidate = createServerValidate({
  ...formOpts,
  onServerValidate: ({ value }) => {
    const errors: string[] = [];
    if (!value.name) {
      errors.push("Server validation: Name s required");
    }

    value.metadata?.forEach((metadata, idx) => {
      if (!metadata.name) {
        errors.push(`Server validation: Metadata name ${idx} is required`);
      }
      if (!metadata.value) {
        errors.push(`Server validation: Metadata value ${idx} is required`);
      }
    });

    return errors.length > 0 ? errors : undefined;
  },
});

export const getFormDataFromServer = createServerFn({ method: "GET" }).handler(async () => {
  const fd = await getFormData();
  const successfulFormState = getCookie(successfulFormStateCookieName);

  if (successfulFormState) {
    deleteCookie(successfulFormStateCookieName);
    let parsedState: Product | null = null;
    try {
      parsedState = JSON.parse(successfulFormState) as Product;
    } catch (error) {
      console.error("Could not parse successful form state cookie", error);
    }

    if (!parsedState) {
      console.log("fd", fd);
      return fd;
    }

    const mergedState = {
      ...fd,
      values: parsedState,
    };
    console.log("fd", mergedState);
    return mergedState;
  }

  console.log("fd", fd);
  return fd;
});

export const Route = createFileRoute("/server-integration")({
  component: SimplePage,
  loader: async () => ({
    state: await getFormDataFromServer(),
  }),
});

function SimplePage() {
  const { state } = Route.useLoaderData();

  console.log("Server state:", state);

  const form = useForm({
    ...formOpts,
    transform: useTransform((baseForm) => mergeForm(baseForm, state), [state]),
  });

  return (
    <main className="p-8">
      <section className="max-w-xl">
        <form
          encType={"multipart/form-data"}
          method="post"
          action={handleForm.url}
          // onSubmit={(event) => {
          //   // event.preventDefault();
          //   // event.stopPropagation();

          //   void form.handleSubmit();
          // }}
          className="space-y-4"
        >
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) => {
                if (!value) {
                  return "Name is required";
                }
              },
            }}
            children={(field) => (
              <div className="flex flex-col gap-1">
                <Label htmlFor={field.name}>Product Name</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                {!field.state.meta.isValid && <p className="text-red-500">{field.state.meta.errors.join(", ")}</p>}
              </div>
            )}
          />

          <form.Field name="metadata" mode="array">
            {(field) => (
              <div className="flex flex-col gap-1">
                <Button variant="outline" type="button" onClick={() => field.pushValue({ name: "", value: "" })}>
                  Add Metadata
                </Button>
                {field.state.value.map((_, idx) => {
                  return (
                    <div className="flex gap-1">
                      <div>
                        <form.Field
                          name={`metadata[${idx}].name`}
                          validators={{
                            onBlur: ({ value }) => {
                              if (!value) {
                                return "Name is required";
                              }
                            },
                          }}
                          children={(field) => (
                            <div className="flex flex-col gap-1">
                              <Label htmlFor={field.name}>Name</Label>
                              <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(event) => field.handleChange(event.target.value)}
                                placeholder=""
                              />
                              {!field.state.meta.isValid && <p className="text-red-500">{field.state.meta.errors.join(", ")}</p>}
                            </div>
                          )}
                        />
                      </div>
                      <div>
                        <form.Field
                          name={`metadata[${idx}].value`}
                          validators={{
                            onBlur: ({ value }) => {
                              if (!value) {
                                return "Value is required";
                              }
                            },
                          }}
                          children={(field) => (
                            <div className="flex flex-col gap-1">
                              <Label htmlFor={field.name}>Value</Label>
                              <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(event) => field.handleChange(event.target.value)}
                                placeholder=""
                              />
                              {!field.state.meta.isValid && <p className="text-red-500">{field.state.meta.errors.join(", ")}</p>}
                            </div>
                          )}
                        />
                      </div>
                      <div className="self-end">
                        <Button variant="outline" type="button" onClick={() => field.removeValue(idx)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </form.Field>

          <form.Subscribe selector={(formState) => [formState.canSubmit, formState.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button variant="outline" type="submit" disabled={!canSubmit}>
                {isSubmitting ? "..." : "Submit"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </section>
    </main>
  );
}
