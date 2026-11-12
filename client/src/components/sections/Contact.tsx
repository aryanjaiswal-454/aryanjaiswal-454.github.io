import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowUpRight, CheckCircle2, Github, Linkedin, Mail, Send } from "lucide-react";
import site from "../../config/site.js";
import { getApiError, sendContactMessage } from "../../services/api";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80, "Name must be 80 characters or fewer."),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  subject: z.string().trim().min(3, "Please add a subject.").max(120),
  message: z.string().trim().min(20, "Please include at least 20 characters.").max(4000)
});

type ContactValues = z.infer<typeof contactSchema>;

export function Contact() {
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" }
  });

  useEffect(() => {
    if (notice?.type !== "success") return;
    const timeout = window.setTimeout(() => setNotice(null), 5000);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const onSubmit = async (values: ContactValues) => {
    setNotice(null);
    try {
      await sendContactMessage(values);
      setNotice({ type: "success", message: "Your message was sent successfully." });
      reset();
    } catch (error) {
      setNotice({ type: "error", message: getApiError(error) });
    }
  };

  return (
    <section className="section section-contact" id="contact" aria-labelledby="contact-title">
      <div className="page-container">
        <SectionHeading
          id="contact-title"
          number="08"
          eyebrow="Start a conversation"
          title="Have a good problem?"
          description="I’m open to thoughtful collaboration, software engineering opportunities, and conversations about applied AI."
        />
        <div className="contact-layout">
          <Reveal className="contact-pitch">
            <span className="contact-pitch__stamp">LET&apos;S BUILD<br />SOMETHING<br /><em>USEFUL.</em></span>
            <p>Share a little context and I&apos;ll get back to you.</p>
            <div className="contact-direct">
              <a href={`mailto:${site.contact.email}`}><Mail size={17} />{site.contact.email}<ArrowUpRight size={14} /></a>
              {site.contact.phone && <a href={`tel:${site.contact.phone.replaceAll(" ", "")}`}>{site.contact.phone}<ArrowUpRight size={14} /></a>}
            </div>
            <div className="contact-socials">
              <a href={site.contact.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={17} /> LinkedIn</a>
              <a href={site.contact.github} target="_blank" rel="noopener noreferrer"><Github size={17} /> GitHub</a>
            </div>
          </Reveal>

          <Reveal className="contact-form-wrap" delay={0.08}>
            <form className="contact-form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="contact-form__top">
                <span className="eyebrow">SEND A MESSAGE</span>
                <span className="contact-form__index">AJ / 09</span>
              </div>
              <div className="form-grid">
                <label className="form-field">
                  <span>Your name</span>
                  <input
                    type="text"
                    autoComplete="name"
                    {...register("name")}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "contact-name-error" : undefined}
                  />
                  {errors.name && <small id="contact-name-error">{errors.name.message}</small>}
                </label>
                <label className="form-field">
                  <span>Email address</span>
                  <input
                    type="email"
                    autoComplete="email"
                    {...register("email")}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "contact-email-error" : undefined}
                  />
                  {errors.email && <small id="contact-email-error">{errors.email.message}</small>}
                </label>
                <label className="form-field form-field--full">
                  <span>Subject</span>
                  <input
                    type="text"
                    {...register("subject")}
                    aria-invalid={Boolean(errors.subject)}
                    aria-describedby={errors.subject ? "contact-subject-error" : undefined}
                  />
                  {errors.subject && <small id="contact-subject-error">{errors.subject.message}</small>}
                </label>
                <label className="form-field form-field--full">
                  <span>What are you thinking about?</span>
                  <textarea
                    rows={5}
                    {...register("message")}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "contact-message-error" : undefined}
                  />
                  {errors.message && <small id="contact-message-error">{errors.message.message}</small>}
                </label>
              </div>
              {notice && (
                <div className={`form-notice form-notice--${notice.type}`} role="status" aria-live="polite">
                  {notice.type === "success" ? <CheckCircle2 size={17} /> : <span aria-hidden="true">!</span>}
                  <p>{notice.message}</p>
                  {notice.type === "success" && (
                    <button className="form-notice__dismiss" type="button" onClick={() => setNotice(null)}>OK</button>
                  )}
                </div>
              )}
              <div className="contact-form__bottom">
                <p>Form submission is confirmed only after the server accepts it.</p>
                <button className="button button--primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sending…" : "Send message"}
                  <Send size={15} aria-hidden="true" />
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
