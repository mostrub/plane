import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
// ui
import { Button, Input } from "@plane/ui";
// types
import { IFormattedInstanceConfiguration } from "types/instance";
// hooks
import useToast from "hooks/use-toast";
// mobx store
import { useMobxStore } from "lib/mobx/store-provider";
// icons
import { Copy } from "lucide-react";

export interface IInstanceGoogleConfigForm {
  config: IFormattedInstanceConfiguration;
}

export interface GoogleConfigFormValues {
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
}

export const InstanceGoogleConfigForm: FC<IInstanceGoogleConfigForm> = (props) => {
  const { config } = props;
  // store
  const { instance: instanceStore } = useMobxStore();
  // toast
  const { setToastAlert } = useToast();
  // form data
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<GoogleConfigFormValues>({
    defaultValues: {
      GOOGLE_CLIENT_ID: config["GOOGLE_CLIENT_ID"],
      GOOGLE_CLIENT_SECRET: config["GOOGLE_CLIENT_SECRET"],
    },
  });

  const onSubmit = async (formData: GoogleConfigFormValues) => {
    const payload: Partial<GoogleConfigFormValues> = { ...formData };

    await instanceStore
      .updateInstanceConfigurations(payload)
      .then(() =>
        setToastAlert({
          title: "Success",
          type: "success",
          message: "Google Configuration Settings updated successfully",
        })
      )
      .catch((err) => console.error(err));
  };

  const originURL = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-col grid-cols-1 lg:grid-cols-3 justify-between gap-x-12 gap-y-8 w-full">
        <div className="flex flex-col gap-1">
          <h4 className="text-sm">Client ID</h4>
          <Controller
            control={control}
            name="GOOGLE_CLIENT_ID"
            render={({ field: { value, onChange, ref } }) => (
              <Input
                id="GOOGLE_CLIENT_ID"
                name="GOOGLE_CLIENT_ID"
                type="text"
                value={value}
                onChange={onChange}
                ref={ref}
                hasError={Boolean(errors.GOOGLE_CLIENT_ID)}
                placeholder="840195096245-0p2tstej9j5nc4l8o1ah2dqondscqc1g.apps.googleusercontent.com"
                className="rounded-md font-medium w-full"
              />
            )}
          />
          <p className="text-xs text-custom-text-400">
            Your client ID lives in your Google API Console.{" "}
            <a
              href="https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow#creatingcred"
              target="_blank"
              className="text-custom-primary-100 hover:underline"
              rel="noreferrer"
            >
              Learn more
            </a>
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="text-sm">JavaScript origin URL</h4>
          <Button
            variant="neutral-primary"
            className="py-2 flex justify-between items-center"
            onClick={() => {
              navigator.clipboard.writeText(originURL);
              setToastAlert({
                message: "The Origin URL has been successfully copied to your clipboard",
                type: "success",
                title: "Copied to clipboard",
              });
            }}
          >
            <p className="font-medium text-sm">{originURL}</p>
            <Copy size={18} color="#B9B9B9" />
          </Button>
          <p className="text-xs text-custom-text-400">
            We will auto-generate this. Paste this into your Authorized JavaScript origins field. For this OAuth client{" "}
            <a
              href="https://console.cloud.google.com/apis/credentials/oauthclient"
              target="_blank"
              className="text-custom-primary-100 hover:underline"
              rel="noreferrer"
            >
              here.
            </a>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center">
          <Button variant="primary" onClick={handleSubmit(onSubmit)} loading={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};
