import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
export default function Privacy() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return (
    <div className={`relative min-h-screen bg-gray-50 overflow-hidden pt-24 pb-16 transition-all duration-500 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`} style={{ fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif' }}>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50 to-purple-50 opacity-50 z-0"></div>
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob z-0"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000 z-0"></div>
      <div className="bg-blob bg-blob--1"></div>
      <div className="bg-blob bg-blob--2"></div>
      <div className="bg-blob bg-blob--3"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            aria-label="Go back"
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-2 rounded-xl transition"
          >
            <span>←</span>
            <span>Back</span>
          </button>
          <div className="flex-1" />
        </div>

        <div className="bg-white/95 backdrop-blur-sm border border-gray-100 rounded-3xl shadow-xl p-6 sm:p-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Privacy Policy</h1>
          <p className="mt-1 text-gray-500"><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>

      <p>
        This Privacy Policy describes how Research Locker ("we", "us", or "our") collects, uses,
        discloses, and safeguards personal information when you use our website and services
        (collectively, the "Services"). By using the Services, you agree to the practices described
        in this policy.
      </p>

      <h2>1. Information We Collect</h2>
      <p>We collect information in the following ways:</p>
      <ul>
        <li><strong>Account and Profile Information</strong>: name, email address, password, and optional profile fields.</li>
        <li><strong>Content You Provide</strong>: uploaded files (e.g., PDFs, images), article metadata, comments, and tags.</li>
        <li><strong>Payment Information</strong>: transaction details if you purchase a plan (handled by our payment processor; we do not store full card numbers).</li>
        <li><strong>Authentication Data</strong>: tokens or identifiers from third-party sign-in providers if used.</li>
        <li><strong>Usage Data</strong>: log data, device information, IP address, browser type, pages viewed, and referral URLs.</li>
        <li><strong>Cookies and Similar Technologies</strong>: to keep you signed in, remember preferences, and analyze usage.</li>
      </ul>

      <h2>2. How We Use Information</h2>
      <ul>
        <li>Provide, operate, and improve the Services</li>
        <li>Authenticate users and secure accounts</li>
        <li>Process payments and manage subscriptions</li>
        <li>Respond to support requests and communicate updates</li>
        <li>Personalize content and features</li>
        <li>Monitor and prevent fraud, abuse, or security incidents</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h2>3. Legal Bases for Processing (EEA/UK users)</h2>
      <ul>
        <li><strong>Contract</strong>: to provide the Services you request.</li>
        <li><strong>Legitimate interests</strong>: to secure and improve the Services and support users.</li>
        <li><strong>Consent</strong>: where required (e.g., certain cookies or marketing).</li>
        <li><strong>Legal obligation</strong>: to comply with applicable laws.</li>
      </ul>

      <h2>4. Cookies and Analytics</h2>
      <p>
        We use cookies and similar technologies to enable core functionality (such as authentication) and
        to understand how the Services are used. You can control cookies through your browser settings.
        Disabling cookies may impact certain features.
      </p>

      <h2>5. Payments</h2>
      <p>
        Payments and subscriptions may be processed by third parties such as PayPal. These providers collect and process
        your payment information in accordance with their own privacy policies. We receive limited information such as
        payment status or a transaction ID and do not store full payment card details.
      </p>

      <h2>6. Information Sharing</h2>
      <p>We share information only as necessary to provide the Services or as required by law, including with:</p>
      <ul>
        <li><strong>Service Providers</strong>: vendors that help with hosting, storage, analytics, authentication, customer support, and payments.</li>
        <li><strong>Legal and Safety</strong>: to comply with legal requests or protect rights, property, and safety.</li>
        <li><strong>Business Transfers</strong>: in connection with a merger, acquisition, or asset sale.</li>
      </ul>
      <p>We do not sell personal information.</p>

      <h2>7. Data Retention</h2>
      <p>
        We retain personal information for as long as needed to provide the Services, comply with legal obligations,
        resolve disputes, and enforce agreements. Uploaded content may be retained until you delete it or your account
        is closed, subject to backups retained for a limited period.
      </p>

      <h2>8. Data Security</h2>
      <p>
        We implement administrative, technical, and physical safeguards designed to protect personal information.
        However, no method of transmission or storage is 100% secure.
      </p>

      <h2>9. Your Rights and Choices</h2>
      <ul>
        <li>Access, correct, or delete your personal information</li>
        <li>Download a copy of your data, where applicable</li>
        <li>Object to or restrict certain processing</li>
        <li>Withdraw consent where we rely on consent</li>
      </ul>
      <p>You can exercise these rights via your account settings or by contacting us.</p>

      <h2>10. International Transfers</h2>
      <p>
        If we transfer personal information across borders, we do so using appropriate safeguards as required by applicable laws.
      </p>

      <h2>11. Children's Privacy</h2>
      <p>
        Our Services are not directed to children under 13 (or older threshold where applicable). We do not knowingly collect
        personal information from children. If you believe a child has provided us personal information, contact us to request deletion.
      </p>

      <h2>12. Third-Party Links and Services</h2>
      <p>
        The Services may contain links to third-party websites or services. Their privacy practices are governed by their own policies.
      </p>

      <h2>13. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. If we make material changes, we will notify you by updating the "Last updated"
        date and, where appropriate, by additional notice.
      </p>

      <h2>14. Contact Us</h2>
      <p>
        If you have questions or requests regarding this Privacy Policy, contact us at
        <a href="mailto:privacy@researchlocker.com"> privacy@researchlocker.com</a>.
      </p>
        </div>
      </div>
    </div>
  );
}