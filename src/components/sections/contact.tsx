import { Mail } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { site } from "@/data/site";
import { gmailLink } from "@/lib/mail";

export function Contact() {
  return (
    <section id="contact" className="px-6 py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 rounded-3xl border border-border bg-card p-5 sm:p-8 md:p-12 lg:grid-cols-2">
        <div className="min-w-0 space-y-6">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Have a project? <span className="text-gradient">Let&apos;s talk.</span>
          </h2>
          <p className="text-muted-foreground">
            Tell us your name, your email and about your website. We will reply with a plan and a quote.
          </p>
          <a href={gmailLink(site.email)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 break-all text-sm text-muted-foreground hover:text-foreground">
            <Mail className="h-4 w-4 shrink-0" />
            {site.email}
          </a>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
