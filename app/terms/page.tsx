import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Logo from "../../components/Logo";

export const metadata = {
  title: "Terms & Conditions — AGRINOVA",
};

export default function TermsPage() {
  return (
    <main className="legal-page">
      <div className="legal-topbar">
        <Link href="/" className="legal-brand"><Logo width={140} /></Link>
        <Link href="/" className="legal-back-link">
          <ArrowLeft size={14} />
          Back to home
        </Link>
      </div>

      <div className="legal-shell">
        <div className="legal-card">
          <span className="mini-tag">LEGAL</span>
          <h1>Terms &amp; Conditions</h1>
          <p className="legal-updated">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <section>
            <p>
              These Terms &amp; Conditions (&quot;Terms&quot;) govern your access to
              and use of AGRINOVA (&quot;the Platform&quot;, &quot;we&quot;,
              &quot;us&quot;), a web application that connects farmers, buyers,
              agricultural experts (agronomists), and administrators. By
              creating an account or using the Platform, you agree to these
              Terms.
            </p>
          </section>

          <section>
            <h2>1. Who can use AGRINOVA</h2>
            <p>
              AGRINOVA is open to individuals who register under one of four
              roles: Farmer, Buyer, Agronomist, or Administrator. You must
              provide accurate information when registering, and you are
              responsible for keeping your login credentials secure.
              Agronomist and Administrator accounts may be held for manual
              review before they are activated.
            </p>
          </section>

          <section>
            <h2>2. Your account</h2>
            <p>
              You are responsible for all activity that happens under your
              account. If you believe your account has been accessed without
              your permission, contact us immediately. We reserve the right
              to suspend or remove accounts that violate these Terms,
              provide false information, or are used for fraudulent or
              harmful activity.
            </p>
          </section>

          <section>
            <h2>3. Marketplace &amp; orders</h2>
            <p>
              Farmers may list produce for sale, and Buyers may place orders
              directly with Farmers through the Platform. AGRINOVA provides
              the technology that connects both parties, but it is not a
              party to the underlying sale — pricing, quality, delivery, and
              payment arrangements are agreed directly between the Farmer
              and the Buyer. We do not guarantee the accuracy of listings,
              the quality of produce, or that any order will be fulfilled.
            </p>
          </section>

          <section>
            <h2>4. Advisory content &amp; diagnosis</h2>
            <p>
              Agronomists on the Platform may respond to farmer questions,
              consultation requests, and crop diagnosis submissions, and may
              publish advisory articles. This content is provided for
              general informational purposes and reflects the opinion of
              the individual agronomist. It is not a substitute for an
              in-person professional assessment, and AGRINOVA is not
              responsible for outcomes resulting from advice given through
              the Platform.
            </p>
          </section>

          <section>
            <h2>5. Uploaded content</h2>
            <p>
              When you upload documents (such as identification or
              authorization documents) or photos (such as crop images for
              diagnosis or listing photos), you confirm that you own or have
              the right to share that content, and you grant AGRINOVA the
              right to store and display it within the Platform for the
              purpose it was submitted for.
            </p>
          </section>

          <section>
            <h2>6. Acceptable use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Impersonate another person or provide false information during registration</li>
              <li>Use the Platform to sell prohibited goods or engage in fraudulent transactions</li>
              <li>Upload content that is unlawful, abusive, or infringes another person&apos;s rights</li>
              <li>Attempt to interfere with the security or normal operation of the Platform</li>
            </ul>
          </section>

          <section>
            <h2>7. Suspension &amp; termination</h2>
            <p>
              We may suspend or terminate access to the Platform for
              accounts that violate these Terms. You may stop using the
              Platform and request that your account be deleted at any time
              by contacting an administrator.
            </p>
          </section>

          <section>
            <h2>8. Changes to these Terms</h2>
            <p>
              We may update these Terms from time to time. Continued use of
              the Platform after changes are posted means you accept the
              updated Terms.
            </p>
          </section>

          <section>
            <h2>9. Contact</h2>
            <p>
              Questions about these Terms can be sent to the platform
              administrator through the contact details listed in your
              AGRINOVA account, or to the support email configured for this
              deployment.
            </p>
          </section>

          <p className="legal-disclaimer">
            This document is a general template provided for a student /
            demonstration project and does not constitute legal advice.
            Before using AGRINOVA in a real, public deployment, have these
            Terms reviewed by a qualified lawyer familiar with applicable
            law in your jurisdiction.
          </p>
        </div>
      </div>
    </main>
  );
}
