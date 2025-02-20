import { FC, useState } from "react";
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
import { Eye, EyeOff } from "lucide-react";

export interface IInstanceImageConfigForm {
  config: IFormattedInstanceConfiguration;
}

export interface ImageConfigFormValues {
  UNSPLASH_ACCESS_KEY: string;
}

export const InstanceImageConfigForm: FC<IInstanceImageConfigForm> = (props) => {
  const { config } = props;
  // states
  const [showPassword, setShowPassword] = useState(false);
  // store
  const { instance: instanceStore } = useMobxStore();
  // toast
  const { setToastAlert } = useToast();
  // form data
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ImageConfigFormValues>({
    defaultValues: {
      UNSPLASH_ACCESS_KEY: config["UNSPLASH_ACCESS_KEY"],
    },
  });

  const onSubmit = async (formData: ImageConfigFormValues) => {
    const payload: Partial<ImageConfigFormValues> = { ...formData };

    await instanceStore
      .updateInstanceConfigurations(payload)
      .then(() =>
        setToastAlert({
          title: "Success",
          type: "success",
          message: "Image Configuration Settings updated successfully",
        })
      )
      .catch((err) => console.error(err));
  };

  return (
    <>
      <div className="grid grid-col grid-cols-1 lg:grid-cols-2 items-center justify-between gap-x-16 gap-y-8 w-full">
        <div className="flex flex-col gap-1 max-w-md">
          <h4 className="text-sm">Access key from your Unsplash account</h4>
          <div className="relative">
            <Controller
              control={control}
              name="UNSPLASH_ACCESS_KEY"
              render={({ field: { value, onChange, ref } }) => (
                <Input
                  id="UNSPLASH_ACCESS_KEY"
                  name="UNSPLASH_ACCESS_KEY"
                  type={showPassword ? "text" : "password"}
                  value={value}
                  onChange={onChange}
                  ref={ref}
                  hasError={Boolean(errors.UNSPLASH_ACCESS_KEY)}
                  placeholder="oXgq-sdfadsaeweqasdfasdf3234234rassd"
                  className="rounded-md font-medium w-full !pr-10"
                />
              )}
            />
            {showPassword ? (
              <button
                className="absolute right-3 top-2.5 flex items-center justify-center text-custom-text-400"
                onClick={() => setShowPassword(false)}
              >
                <EyeOff className="h-4 w-4" />
              </button>
            ) : (
              <button
                className="absolute right-3 top-2.5 flex items-center justify-center text-custom-text-400"
                onClick={() => setShowPassword(true)}
              >
                <Eye className="h-4 w-4" />
              </button>
            )}
          </div>
          <p className="text-xs text-custom-text-400">
            You will find your access key in your Unsplash developer console.{" "}
            <a
              href="https://unsplash.com/documentation#creating-a-developer-account"
              target="_blank"
              className="text-custom-primary-100 hover:underline"
              rel="noreferrer"
            >
              Learn more.
            </a>
          </p>
        </div>
      </div>

      <div className="flex items-center py-1">
        <Button variant="primary" onClick={handleSubmit(onSubmit)} loading={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </>
  );
};
