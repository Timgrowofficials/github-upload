import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertClientSchema, type Service } from "@shared/schema";
import { z } from "zod";

const clientFormSchema = insertClientSchema.extend({
  email: z.string().email().optional().or(z.literal("")),
  notes: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientFormSchema>;

interface BookingFormProps {
  selectedService: Service | null;
  selectedDate: string;
  selectedTime: string;
  onSubmit: (data: ClientFormData) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function BookingForm({ 
  selectedService, 
  selectedDate, 
  selectedTime, 
  onSubmit, 
  isLoading = false,
  disabled = false 
}: BookingFormProps) {
  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      notes: "",
    },
  });

  const handleSubmit = (data: ClientFormData) => {
    if (!selectedService || !selectedDate || !selectedTime) {
      return;
    }
    onSubmit(data);
  };

  const isFormDisabled = disabled || !selectedService || !selectedDate || !selectedTime;

  return (
    <Card className={isFormDisabled ? "opacity-50" : ""}>
      <CardHeader>
        <CardTitle className="font-poppins text-xl text-tim-charcoal">
          Your Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John" 
                        {...field} 
                        disabled={isFormDisabled}
                        className="focus:ring-2 focus:ring-tim-green focus:border-tim-green"
                      />
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
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Doe" 
                        {...field} 
                        disabled={isFormDisabled}
                        className="focus:ring-2 focus:ring-tim-green focus:border-tim-green"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input 
                        type="tel" 
                        placeholder="(555) 123-4567" 
                        {...field} 
                        disabled={isFormDisabled}
                        className="focus:ring-2 focus:ring-tim-green focus:border-tim-green"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="john@example.com" 
                        {...field} 
                        disabled={isFormDisabled}
                        className="focus:ring-2 focus:ring-tim-green focus:border-tim-green"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Requests (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any special requests or notes..."
                      rows={3}
                      {...field}
                      disabled={isFormDisabled}
                      className="focus:ring-2 focus:ring-tim-green focus:border-tim-green"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit"
              className="w-full bg-tim-green hover:bg-green-600 py-4 font-semibold mt-6"
              disabled={isFormDisabled || isLoading}
            >
              {isLoading ? "Confirming Booking..." : "Confirm Booking"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
