"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { saveParameters, createLeads } from "@/lib/api-client"
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
  googleSearchApiKey: z.string().min(1, "Google Search API Key is required"),
  crxNumber: z.string().min(1, "CRX Number is required"),
  query: z.string().min(1, "Query is required"),
  leadCount: z.coerce.number().int().positive("Lead count must be a positive number"),
  linkedinEmail: z.string().email("Invalid email address"),
  linkedinPassword: z.string().min(6, "Password must be at least 6 characters"),
  llmModelApiKey: z.string().min(1, "LLM Model API Key is required"),
})

export function InputForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCreatingLeads, setIsCreatingLeads] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      googleSearchApiKey: "",
      crxNumber: "",
      query: "",
      leadCount: 200,
      linkedinEmail: "",
      linkedinPassword: "",
      llmModelApiKey: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    
    try {
      await saveParameters(values);
      
      toast({
        title: "Parameters saved",
        description: "Your input parameters have been saved to .env file.",
      })
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save parameters. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleCreateLeads() {
    setIsCreatingLeads(true)
    
    try {
      // This will execute the script in scripts/generate-leads.js
      const result = await createLeads();
      
      toast({
        title: "Leads Created",
        description: "Leads have been generated and saved to JSON file.",
      })
      
      // Refresh the page to load the new leads
      window.location.reload();
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create leads. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreatingLeads(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="googleSearchApiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Google Search API Key</FormLabel>
                <FormControl>
                  <Input placeholder="Enter API key" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="crxNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CRX Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter CRX number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Query</FormLabel>
                <FormControl>
                  <Input placeholder="Enter search query" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="leadCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lead Count</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="200" {...field} />
                </FormControl>
                <FormDescription>Number of leads to generate (default: 200)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linkedinEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linkedinPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="llmModelApiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LLM Model API Key</FormLabel>
                <FormControl>
                  <Input placeholder="Enter API key" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Parameters"
            )}
          </Button>
          <Button 
            type="button" 
            className="flex-1 bg-green-600 hover:bg-green-700" 
            onClick={handleCreateLeads} 
            disabled={isCreatingLeads || isSubmitting}
          >
            {isCreatingLeads ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Leads"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

