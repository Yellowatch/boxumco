import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { AlertCircle } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import Card from "@/components/Card";
import { useMutation } from '@tanstack/react-query';

const formSchema = z.object({
  first_name: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  last_name: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  number: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  address: z.string().min(5, {
    message: "Please enter a valid address.",
  }),
  postcode: z.string().min(3, {
    message: "Please enter a valid postcode.",
  }),
  company_name: z.string(),
  dob: z.string().min(10, {
    message: "Please enter a valid date of birth.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirm_password: z.string().min(8, {
    message: "Confirm password must be at least 8 characters.",
  }),
  company_number: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  company_address: z.string().min(5, {
    message: "Please enter a valid address.",
  }),
  company_postcode: z.string().min(3, {
    message: "Please enter a valid postcode.",
  }),
  company_type: z.string().min(2, {
    message: "Please enter a valid company type.",
  }),
  company_description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .max(250, {
      message: "Description must not be longer than 160 characters.",
    }),
  company_logo: z.instanceof(File, {
    message: "Please upload a valid file.",
  }),
  subcategories: z.string().min(5, {
    message: "Please enter a valid subcategory.",
  }),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

type RegisterResponse = {
  success: boolean;
  data?: any;
  error?: any;
};

const BusinessRegisterForm = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const { registerBusiness } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      number: "",
      address: "",
      postcode: "",
      company_name: "",
      dob: "",
      password: "",
      confirm_password: "",
      company_number: "",
      company_address: "",
      company_postcode: "",
      company_type: "",
      company_description: "",
      company_logo: new File([], ""),
      subcategories: "",
    },
  });

  const registerMutation = useMutation<RegisterResponse, Error, z.infer<typeof formSchema>, unknown>({
    mutationFn: async (values) => {
      const response = await registerBusiness(
        values.first_name,
        values.last_name,
        values.email,
        values.number,
        values.address,
        values.postcode,
        values.dob,
        values.company_name,
        values.company_address,
        values.company_description,
        values.company_postcode,
        values.company_number,
        values.company_type,
        values.company_logo,
        values.subcategories,
        values.password,
        values.confirm_password
      );
      if (!response.success) {
        if (response.error) {
          throw new Error(response.error);
        } else {
          throw new Error("An unknown error occurred. Please try again later.");
        }
      }
      return response;
    },
    onSuccess: (data, variables) => {
      toast(
        <div>
          <p>You have successfully registered, {variables.first_name}!</p>
        </div>
      );
      navigate('/login');
      window.scrollTo(0, 0);
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setErrorMsg('');
    try {
      await registerMutation.mutateAsync(values);
    } catch (error: any) {
      setErrorMsg(error.message);
    }
  }

  return (
    <div className="flex justify-center items-center">
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Only your first name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Enter only your last name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dob"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormDescription>Enter your date of birth.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormDescription>This will be used to sign in.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="text-left">Phone Number</FormLabel>
                  <FormControl className="w-full">
                    <PhoneInput defaultCountry="AU" placeholder="Enter a phone number" {...field} />
                  </FormControl>
                  <FormDescription className="text-left">Enter a phone number</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Enter your home address.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postcode"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Postcode</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Enter a valid postcode.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company_name"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Enter your company name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company_number"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="text-left">Company Phone Number</FormLabel>
                  <FormControl className="w-full">
                    <PhoneInput defaultCountry="AU" placeholder="Enter a phone number" {...field} />
                  </FormControl>
                  <FormDescription className="text-left">Enter the company phone number</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company_address"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Company Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Enter your company address.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company_postcode"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Company Postcode</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Enter the company postcode.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company_type"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Company Type</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>What type of company are you?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company_description"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Company Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us a little bit about your business" {...field} />
                  </FormControl>
                  <FormDescription>
                    Describe your business to customers in less than 250 characters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company_logo"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <Input
                      accept=".jpg, .jpeg, .png, .svg, .ico"
                      type="file"
                      onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                    />
                  </FormControl>
                  <FormDescription>Upload your company logo.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subcategories"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Company Subcategories</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Add subcategories for your business so users can find you easier.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormDescription>
                    This will be used to sign in. Must be at least 8 characters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormDescription>Re-enter your password.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {errorMsg && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMsg}</AlertDescription>
              </Alert>
            )}
            {registerMutation.status === 'pending' ? (
              <Button disabled>
                <Loader2 className="animate-spin" />
                Loading...
              </Button>
            ) : (
              <Button type="submit">Submit</Button>
            )}
          </form>
        </Form>
      </Card>
    </div>
  );
}

export default BusinessRegisterForm;
