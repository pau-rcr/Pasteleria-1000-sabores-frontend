import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  error?: string;
  type?: string;
  required?: boolean;
  multiline?: boolean;
  className?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
}

export function FormField({
  label,
  error,
  type = "text",
  required = false,
  multiline = false,
  className,
  inputProps,
  textareaProps,
}: FormFieldProps) {
  const id = inputProps?.name || textareaProps?.name || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {multiline ? (
        <Textarea id={id} {...textareaProps} className={cn(error && "border-destructive")} />
      ) : (
        <Input
          id={id}
          type={type}
          {...inputProps}
          className={cn(error && "border-destructive")}
        />
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
