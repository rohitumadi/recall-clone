import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/privacy')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold">Privacy Policy</h1>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">
            1. Information We Collect
          </h2>
          <p className="mb-4 text-muted-foreground">
            We collect information that you provide directly to us, including
            when you create an account, use our services, or communicate with
            us. This may include your name, email address, and any other
            information you choose to provide.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">
            2. How We Use Your Information
          </h2>
          <p className="mb-4 text-muted-foreground">
            We use the information we collect to:
          </p>
          <ul className="mb-4 ml-6 list-disc text-muted-foreground">
            <li>Provide, maintain, and improve our services</li>
            <li>Send you technical notices and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Protect against fraudulent or illegal activity</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">
            3. Information Sharing
          </h2>
          <p className="mb-4 text-muted-foreground">
            We do not share your personal information with third parties except
            as described in this privacy policy. We may share information in the
            following circumstances:
          </p>
          <ul className="mb-4 ml-6 list-disc text-muted-foreground">
            <li>With your consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and prevent fraud</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">4. Data Security</h2>
          <p className="mb-4 text-muted-foreground">
            We take reasonable measures to help protect your personal
            information from loss, theft, misuse, unauthorized access,
            disclosure, alteration, and destruction.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">
            5. Cookies and Tracking
          </h2>
          <p className="mb-4 text-muted-foreground">
            We use cookies and similar tracking technologies to collect
            information about your browsing activities. You can control cookies
            through your browser settings.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">6. Your Rights</h2>
          <p className="mb-4 text-muted-foreground">
            You have the right to access, update, or delete your personal
            information. You can do this by logging into your account or
            contacting us directly.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">7. Children's Privacy</h2>
          <p className="mb-4 text-muted-foreground">
            Our service is not directed to children under 13. We do not
            knowingly collect personal information from children under 13.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">
            8. Changes to This Policy
          </h2>
          <p className="mb-4 text-muted-foreground">
            We may update this privacy policy from time to time. We will notify
            you of any changes by posting the new privacy policy on this page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">9. Contact Us</h2>
          <p className="mb-4 text-muted-foreground">
            If you have any questions about this privacy policy, please contact
            us.
          </p>
        </section>
      </div>
    </div>
  )
}
