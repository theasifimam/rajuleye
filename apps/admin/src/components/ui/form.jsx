"use client";
import * as React from "react";
import { Slot } from "radix-ui";
import { Controller, FormProvider, useFormContext, useFormState, } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
const Form = FormProvider;
const FormFieldContext = React.createContext({});
const FormField = ({ ...props }) => {
    return (<FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props}/>
    </FormFieldContext.Provider>);
};
const useFormField = () => {
    const fieldContext = React.useContext(FormFieldContext);
    const itemContext = React.useContext(FormItemContext);
    const { getFieldState } = useFormContext();
    const formState = useFormState({ name: fieldContext.name });
    const fieldState = getFieldState(fieldContext.name, formState);
    if (!fieldContext) {
        throw new Error("useFormField should be used within <FormField>");
    }
    const { id } = itemContext;
    return {
        id,
        name: fieldContext.name,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
        ...fieldState,
    };
};
const FormItemContext = React.createContext({});
function FormItem({ className, ...props }) {
    const id = React.useId();
    return (<FormItemContext.Provider value={{ id }}>
      <div data-slot="form-item" className={cn("grid gap-2", className)} {...props}/>
    </FormItemContext.Provider>);
}
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
function FormLabel({ className, tooltip, children, ...props }) {
    const { error, formItemId } = useFormField();
    const labelContent = (<Label data-slot="form-label" data-error={!!error} className={cn("data-[error=true]:text-destructive flex items-center gap-1.5 cursor-help group", className)} htmlFor={formItemId} {...props}>
      {children}
      {tooltip && <HelpCircle className="h-3 w-3 text-muted-foreground/60 transition-colors group-hover:text-primary shrink-0"/>}
    </Label>);
    if (tooltip) {
        return (<Tooltip>
        <TooltipTrigger asChild>
          {labelContent}
        </TooltipTrigger>
        <TooltipContent side="top" align="start" className="max-w-[200px] rounded-2xl text-[10px] font-bold tracking-wider leading-relaxed bg-primary text-primary-foreground border-none shadow-xl">
          {tooltip}
        </TooltipContent>
      </Tooltip>);
    }
    return labelContent;
}
function FormControl({ ...props }) {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
    return (<Slot.Root data-slot="form-control" id={formItemId} aria-describedby={!error
            ? `${formDescriptionId}`
            : `${formDescriptionId} ${formMessageId}`} aria-invalid={!!error} {...props}/>);
}
function FormDescription({ className, ...props }) {
    const { formDescriptionId } = useFormField();
    return (<p data-slot="form-description" id={formDescriptionId} className={cn("text-muted-foreground text-sm", className)} {...props}/>);
}
function FormMessage({ className, children, ...props }) {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message ?? "") : children;
    if (!body) {
        return null;
    }
    return (<p data-slot="form-message" id={formMessageId} className={cn("text-destructive text-sm", className)} {...props}>
      {body}
    </p>);
}
export { useFormField, Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField, };
