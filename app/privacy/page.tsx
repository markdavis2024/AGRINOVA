import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Logo from "../../components/Logo";

export const metadata = {
  title: "Privacy Policy — AGRINOVA",
};

export default function PrivacyPage() {
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
          <h1>Privacy Policy</h1>
          <p className="legal-updated">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <section>
            <p>
              This Privacy Policy explains what information AGRINOVA
              collects, why we collect it, and how it is used. It applies to
              all users of the Platform — Farmers, Buyers, Agronomists, and
              Administrators.
            </p>
          </section>

          <section>
            <h2>1. Information we collect</h2>
            <p>When you register and use AGRINOVA, we collect:</p>
            <ul>
              <li><strong>Account details:</strong> full name, email address, phone number, and password (stored as a secure hash, never in plain text)</li>
              <li><strong>Profile details:</strong> region and town, and role-specific information such as farming type, specialization, institution, or organization</li>
              <li><strong>Content you create:</strong> marketplace listings, orders, messages, consultation requests, diagnosis submissions, and articles</li>
              <li><strong>Uploaded files:</strong> identification or authorization documents, and photos attached to listings or diagnosis requests</li>
              <li><strong>Usage data:</strong> basic activity needed to operate the Platform, such as when your account was created and when you were last active</li>
            </ul>
          </section>

          <section>
            <h2>2. How we use your information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Create and secure your account, and keep you signed in</li>
              <li>Connect Farmers, Buyers, and Agronomists for marketplace orders, messages, and advisory requests</li>
              <li>Allow Administrators to verify Agronomist and Administrator accounts, and to moderate the Platform</li>
              <li>Show you accurate, up-to-date information on your dashboard</li>
            </ul>
          </section>

          <section>
            <h2>3. Who can see your information</h2>
            <p>
              Your name and relevant profile details (such as your
              town/region, or your farm listing) are visible to other users
              where necessary for the Platform to work — for example, a
              Buyer can see a Farmer&apos;s name and contact details after
              placing an order. Private information such as your password
              and unread message content is never shared. Administrators
              can view account details for moderation purposes, including
              approving or suspending accounts.
            </p>
          </section>

          <section>
            <h2>4. How your information is stored</h2>
            <p>
              Your data is stored in a private database that only the
              Platform can access. Passwords are hashed and never stored or
              displayed in plain text. Your login session is kept in a
              secure, browser-managed cookie that cannot be read by other
              websites.
            </p>
          </section>

          <section>
            <h2>5. Your choices</h2>
            <p>
              You can view and update your profile information at any time
              from your account Settings page. You can change your password
              there as well. To request that your account and associated
              data be deleted, contact a Platform administrator.
            </p>
          </section>

          <section>
            <h2>6. Cookies</h2>
            <p>
              AGRINOVA uses a single essential cookie to keep you signed in.
              We do not use advertising or tracking cookies.
            </p>
          </section>

          <section>
            <h2>7. Children&apos;s privacy</h2>
            <p>
              AGRINOVA is not directed at children, and account registration
              is intended for adults operating in a farming, buying,
              advisory, or administrative capacity.
            </p>
          </section>

          <section>
            <h2>8. Changes to this policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Continued
              use of the Platform after changes are posted means you accept
              the updated policy.
            </p>
          </section>

          <section>
            <h2>9. Contact</h2>
            <p>
              Questions about this Privacy Policy or your data can be
              directed to the platform administrator, or to the support
              email configured for this deployment.
            </p>
          </section>

          <p className="legal-disclaimer">
            This document is a general template provided for a student /
            demonstration project and does not constitute legal advice.
            Before using AGRINOVA in a real, public deployment — especially
            one that handles identification documents — have this policy
            reviewed by a qualified lawyer familiar with applicable data
            protection law in your jurisdiction.
          </p>
        </div>
      </div>
    </main>
  );
}
