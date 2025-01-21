'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { getUserInfo, updateUserDetails } from '@/lib/actions';
import { FetchedUser, UpdateProfileFormInputs } from '@/lib/types';
import { updateProfileSchema } from '@/schemas/schema';
import Loader from '@/components/Loader';
import { signOut } from 'next-auth/react';

export default function UpdateProfileForm() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const form = useForm<UpdateProfileFormInputs>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      bio: '',
      usage: 'personal',
      industryType: '',
      job: '',
      subscriptionPlan: 'free',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await getUserInfo();
      if (response?.status === 'success') {
        const fetchedUserInfo = response.data as FetchedUser;
        form.reset({
          firstName: fetchedUserInfo.firstName,
          lastName: fetchedUserInfo.lastName,
          bio: fetchedUserInfo.bio || undefined,
          usage: fetchedUserInfo.usage as 'personal' | 'business',
          companyName: fetchedUserInfo.companyName || undefined,
          industryType: fetchedUserInfo.industryType || undefined,
          numberOfEmployees: fetchedUserInfo.numberOfEmployees || undefined,
          job: fetchedUserInfo.job || undefined,
          subscriptionPlan: fetchedUserInfo.subscriptionPlan as
            | 'free'
            | 'pro'
            | 'enterprise',
        });
      }
      setIsLoading(false);
    };

    fetchData();
  }, [form, isUpdated]);
  async function onSubmit(data: UpdateProfileFormInputs) {
    const response = await updateUserDetails(data);
    if (response?.status === 'success') {
      toast.success(response.message || 'Successfully updated your profile');
      setIsUpdated((prev) => !prev);
    } else {
      toast.error(
        response?.message || 'Error occurred while updating your profile',
      );
    }
  }
  const handleLogOut = async () => {
    const response = await signOut({ callbackUrl: '/sign-in' });
    console.log(response);
  };
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row md:justify-between gap-2 md:items-center mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        <Loader isLoading={isLoading}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little about yourself"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      You can add a short bio to your profile. Max 500
                      characters.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="usage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usage</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select usage type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch('usage') === 'business' && (
                <>
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Inc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="industryType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry Type</FormLabel>
                        <FormControl>
                          <Input placeholder="Technology" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="numberOfEmployees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Employees</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="100"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseInt(e.target.value, 10)
                                  : undefined,
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="job"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Software Engineer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <FormField
                control={form.control}
                name="subscriptionPlan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subscription Plan</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your plan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="pro">Pro</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Updating...' : 'Update'}
                </Button>
                <Button
                  type="button"
                  onClick={handleLogOut}
                  variant={'secondary'}
                >
                  Log out
                </Button>
              </div>
            </form>
          </Form>
        </Loader>
      </div>
    </main>
  );
}
