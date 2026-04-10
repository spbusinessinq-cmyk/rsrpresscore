import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useSubmitApplication } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldAlert } from "lucide-react";

const workTypeOptions = [
  "Reporting", 
  "Interviews", 
  "Camera/Video", 
  "Writing", 
  "Research", 
  "Investigations", 
  "Event Coverage"
];

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  areasOfOperation: z.string().min(2, "Areas of operation are required"),
  experienceLevel: z.string().min(1, "Experience level is required"),
  workTypes: z.array(z.string()).min(1, "Select at least one work type"),
  intent: z.string().min(10, "Intent statement must be at least 10 characters"),
  links: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ApplicationModalProps {
  trigger: React.ReactNode;
}

export function ApplicationModal({ trigger }: ApplicationModalProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      city: "",
      state: "",
      areasOfOperation: "",
      experienceLevel: "",
      workTypes: [],
      intent: "",
      links: "",
    },
  });

  const submitApplication = useSubmitApplication();

  function onSubmit(values: FormValues) {
    submitApplication.mutate(
      { data: values },
      {
        onSuccess: () => {
          toast({
            title: "Application Received",
            description: "Review pending. You will be contacted if selected.",
            variant: "default",
          });
          setOpen(false);
          form.reset();
        },
        onError: (error) => {
          toast({
            title: "Submission Failed",
            description: error.error?.error || "Failed to submit application. Please try again.",
            variant: "destructive",
          });
        }
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] border-primary/20 bg-background/95 backdrop-blur-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-mono uppercase tracking-tighter text-xl flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-primary" />
            Operator Intake
          </DialogTitle>
          <DialogDescription className="font-mono text-xs text-secondary-foreground">
            Submit your credentials for review. Falsified information will result in permanent network ban.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-xs text-primary uppercase">Full Name</FormLabel>
                    <FormControl>
                      <Input className="font-mono bg-card/50 tactical-border" placeholder="J. Doe" {...field} data-testid="input-name" />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-xs text-primary uppercase">Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" className="font-mono bg-card/50 tactical-border" placeholder="operator@secure.net" {...field} data-testid="input-email" />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-xs text-primary uppercase">City</FormLabel>
                    <FormControl>
                      <Input className="font-mono bg-card/50 tactical-border" placeholder="Austin" {...field} data-testid="input-city" />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-xs text-primary uppercase">State</FormLabel>
                    <FormControl>
                      <Input className="font-mono bg-card/50 tactical-border" placeholder="TX" {...field} data-testid="input-state" />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-xs text-primary uppercase">Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input type="tel" className="font-mono bg-card/50 tactical-border" placeholder="555-0199" {...field} data-testid="input-phone" />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="areasOfOperation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-xs text-primary uppercase">Areas of Operation</FormLabel>
                    <FormControl>
                      <Input className="font-mono bg-card/50 tactical-border" placeholder="e.g. Southwest Texas, National" {...field} data-testid="input-areas" />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="experienceLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-xs text-primary uppercase">Experience Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="font-mono bg-card/50 tactical-border" data-testid="select-experience">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Experienced">Experienced</SelectItem>
                        <SelectItem value="Professional">Professional</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="workTypes"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="font-mono text-xs text-primary uppercase">Operational Capabilities</FormLabel>
                    <DialogDescription className="font-mono text-xs mt-1">Select all that apply.</DialogDescription>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {workTypeOptions.map((item) => (
                      <FormField
                        key={item}
                        control={form.control}
                        name="workTypes"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, item])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item
                                          )
                                        )
                                  }}
                                  data-testid={`checkbox-${item.toLowerCase().replace('/', '-')}`}
                                />
                              </FormControl>
                              <FormLabel className="font-mono text-xs font-normal cursor-pointer">
                                {item}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="intent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono text-xs text-primary uppercase">Intent Statement</FormLabel>
                  <FormControl>
                    <Textarea 
                      className="font-mono min-h-[100px] bg-card/50 tactical-border resize-none" 
                      placeholder="State your operational intent..." 
                      {...field} 
                      data-testid="input-intent"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="links"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono text-xs text-primary uppercase">Portfolio / Links (Optional)</FormLabel>
                  <FormControl>
                    <Input className="font-mono bg-card/50 tactical-border" placeholder="https://..." {...field} data-testid="input-links" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full font-mono uppercase font-bold tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground" 
              disabled={submitApplication.isPending}
              data-testid="btn-submit-application"
            >
              {submitApplication.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Transmitting...
                </>
              ) : (
                "Submit Credentials"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
