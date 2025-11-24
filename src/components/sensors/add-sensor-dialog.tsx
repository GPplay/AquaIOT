'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters.'),
  area: z.string().min(3, 'Location must be at least 3 characters.'),
  type: z.enum(['Water Level', 'Flow Rate', 'Tide Gauge', 'Salinity', 'Rainfall']),
});

type FormValues = z.infer<typeof formSchema>;

export function AddSensorDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      area: '',
      type: 'Water Level',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    // Simulate API call to add a sensor
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('New sensor added:', values);
    setLoading(false);
    setOpen(false);
    form.reset();
    toast({
        title: "Sensor Added",
        description: `Sensor "${values.name}" has been successfully added.`,
    })
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            {children}
        </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Add New Sensor</DialogTitle>
          <DialogDescription>
            Enter the details of the new sensor to connect it to the AquaGuard network.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sensor Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., River Mouth Sensor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location / Area</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Barrio Chino" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sensor Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a sensor type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Water Level">Water Level</SelectItem>
                      <SelectItem value="Flow Rate">Flow Rate</SelectItem>
                      <SelectItem value="Tide Gauge">Tide Gauge</SelectItem>
                      <SelectItem value="Salinity">Salinity</SelectItem>
                      <SelectItem value="Rainfall">Rainfall</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Add Sensor
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
