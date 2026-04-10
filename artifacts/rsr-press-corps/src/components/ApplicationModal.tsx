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
  DialogTrigger,
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
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useSubmitApplication } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle } from "lucide-react";

const workTypeOptions = [
  "Reporting",
  "Interviews",
  "Camera/Video",
  "Writing",
  "Research",
  "Investigations",
  "Event Coverage",
];

const TIER_CONFIG: Record<string, { title: string; intro: string; focusHint: string }> = {
  Observer: {
    title: "Observer Intake",
    intro: "Observer access provides read-level network access. Document local events and regional intelligence for the network.",
    focusHint: "Monitoring, local awareness, event presence.",
  },
  Contributor: {
    title: "Contributor Intake",
    intro: "Contributors submit written reports, analysis, and sourced media. Writing and research capability required.",
    focusHint: "Writing, submissions, research, media contribution.",
  },
  "Field Operator": {
    title: "Field Operator Intake",
    intro: "Field Operators are deployed assets for active coverage. Verified identity and physical presence in the field required.",
    focusHint: "Active coverage, deployment, event presence, live reporting.",
  },
  "Verified Press": {
    title: "Verified Press Review",
    intro: "Verified Press credential review is for established journalists and media professionals with a documented track record.",
    focusHint: "Credential validation, track record, professional access.",
  },
  General: {
    title: "Network Intake",
    intro: "Submit your credentials for review by command. Access level will be assigned upon acceptance.",
    focusHint: "All capabilities considered.",
  },
};

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  areasOfOperation: z.string().min(2, "Areas of operation are required"),
  experienceLevel: z.string().min(1, "Experience level is required"),
  workTypes: z.array(z.string()).min(1, "Select at least one work type"),
  intent: z.string().min(10, "Intent statement required"),
  links: z.string().optional(),
  applyingTier: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ApplicationModalProps {
  trigger: React.ReactNode;
  defaultTier?: string;
}

export function ApplicationModal({ trigger, defaultTier }: ApplicationModalProps) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const tier = defaultTier || "General";
  const config = TIER_CONFIG[tier] || TIER_CONFIG["General"];

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
      applyingTier: tier,
    },
  });

  const submitApplication = useSubmitApplication();

  function onSubmit(values: FormValues) {
    const { applyingTier: _tier, ...submitData } = values;
    submitApplication.mutate(
      { data: submitData },
      {
        onSuccess: () => {
          setSubmitted(true);
        },
        onError: (error: any) => {
          toast({
            title: "Submission Failed",
            description: error.error?.error || "Failed to submit. Try again.",
            variant: "destructive",
          });
        },
      }
    );
  }

  function handleOpenChange(o: boolean) {
    setOpen(o);
    if (!o) {
      setSubmitted(false);
      form.reset({ ...form.formState.defaultValues, applyingTier: tier });
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[620px] border-primary/20 bg-background/98 backdrop-blur-xl max-h-[90vh] overflow-y-auto rounded-none p-0 gap-0">
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
            <CheckCircle className="w-10 h-10 text-primary mb-6" />
            <h3 className="font-mono text-lg font-bold uppercase tracking-widest mb-3">Application Received</h3>
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest leading-relaxed max-w-xs">
              Your credentials are under review. Command will contact you if selected for access.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-8 font-mono text-xs uppercase rounded-none border-white/20"
              onClick={() => handleOpenChange(false)}
            >
              Close
            </Button>
          </div>
        ) : (
          <>
            <div className="px-8 pt-8 pb-6 border-b border-white/5">
              <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-1">{tier !== "General" ? `Tier: ${tier}` : "General Intake"}</div>
              <h2 className="font-mono text-xl font-bold uppercase tracking-widest mb-2">{config.title}</h2>
              <p className="font-mono text-xs text-muted-foreground leading-relaxed">{config.intro}</p>
              {config.focusHint && (
                <div className="mt-3 px-3 py-2 bg-primary/5 border border-primary/15 font-mono text-[10px] text-primary/70 uppercase tracking-widest">
                  Focus: {config.focusHint}
                </div>
              )}
            </div>

            <div className="px-8 py-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-mono text-[10px] text-primary uppercase tracking-widest">Full Name</FormLabel>
                          <FormControl>
                            <Input className="font-mono bg-black/60 tactical-border h-10" placeholder="J. Doe" {...field} data-testid="input-name" />
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
                          <FormLabel className="font-mono text-[10px] text-primary uppercase tracking-widest">Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" className="font-mono bg-black/60 tactical-border h-10" placeholder="operator@secure.net" {...field} data-testid="input-email" />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-mono text-[10px] text-primary uppercase tracking-widest">City</FormLabel>
                          <FormControl>
                            <Input className="font-mono bg-black/60 tactical-border h-10" placeholder="Austin" {...field} data-testid="input-city" />
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
                          <FormLabel className="font-mono text-[10px] text-primary uppercase tracking-widest">State</FormLabel>
                          <FormControl>
                            <Input className="font-mono bg-black/60 tactical-border h-10" placeholder="TX" {...field} data-testid="input-state" />
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
                          <FormLabel className="font-mono text-[10px] text-primary uppercase tracking-widest">Phone (Opt.)</FormLabel>
                          <FormControl>
                            <Input type="tel" className="font-mono bg-black/60 tactical-border h-10" placeholder="555-0199" {...field} data-testid="input-phone" />
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
                          <FormLabel className="font-mono text-[10px] text-primary uppercase tracking-widest">Areas of Operation</FormLabel>
                          <FormControl>
                            <Input className="font-mono bg-black/60 tactical-border h-10" placeholder="e.g. Southwest Texas" {...field} data-testid="input-areas" />
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
                          <FormLabel className="font-mono text-[10px] text-primary uppercase tracking-widest">Experience Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="font-mono bg-black/60 tactical-border h-10 text-xs" data-testid="select-experience">
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
                        <FormLabel className="font-mono text-[10px] text-primary uppercase tracking-widest block mb-3">Operational Capabilities</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {workTypeOptions.map((item) => (
                            <FormField
                              key={item}
                              control={form.control}
                              name="workTypes"
                              render={({ field }) => (
                                <FormItem key={item} className="flex flex-row items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item)}
                                      onCheckedChange={(checked) =>
                                        checked
                                          ? field.onChange([...field.value, item])
                                          : field.onChange(field.value?.filter((v) => v !== item))
                                      }
                                      data-testid={`checkbox-${item.toLowerCase().replace("/", "-")}`}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-mono text-xs font-normal cursor-pointer">{item}</FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage className="text-xs mt-2" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="intent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-[10px] text-primary uppercase tracking-widest">Intent Statement</FormLabel>
                        <FormControl>
                          <Textarea
                            className="font-mono min-h-[90px] bg-black/60 tactical-border resize-none text-sm"
                            placeholder="State your operational intent and why you are seeking access..."
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
                        <FormLabel className="font-mono text-[10px] text-primary uppercase tracking-widest">Portfolio / Work Links (Optional)</FormLabel>
                        <FormControl>
                          <Input className="font-mono bg-black/60 tactical-border h-10" placeholder="https://..." {...field} data-testid="input-links" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-4">
                    <p className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-wide leading-relaxed">
                      Falsified information results in permanent network ban.
                    </p>
                    <Button
                      type="submit"
                      className="shrink-0 font-mono uppercase font-bold tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground rounded-none px-6 h-10 text-xs"
                      disabled={submitApplication.isPending}
                      data-testid="btn-submit-application"
                    >
                      {submitApplication.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          Transmitting...
                        </>
                      ) : (
                        "Submit Credentials"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
