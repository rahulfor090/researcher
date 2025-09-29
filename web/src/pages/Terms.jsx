import { colors } from '../theme';

export default function Terms() {
  return (
    <div className="relative min-h-screen pt-24 pb-16" style={{ background: 'linear-gradient(180deg, #fefcf3 0%, #f5f1e8 100%)' }}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8" style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.border}` }}>
          <h1 className="text-3xl font-extrabold" style={{ color: colors.primaryText }}>Terms of Service</h1>
          <p className="mt-1" style={{ color: colors.secondaryText }}><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
      
      <h2 style={{ color: colors.primaryText }}>1. Acceptance of Terms</h2>
      <p style={{ color: colors.secondaryText }}>By accessing and using ResearchLocker, you accept and agree to be bound by the terms and provision of this agreement.</p>
      
      <h2 style={{ color: colors.primaryText }}>2. Description of Service</h2>
      <p style={{ color: colors.secondaryText }}>ResearchLocker is a research paper management application that helps users organize, store, and manage their academic papers and research materials.</p>
      
      <h2 style={{ color: colors.primaryText }}>3. User Accounts</h2>
      <p style={{ color: colors.secondaryText }}>You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer.</p>
      
      <h2 style={{ color: colors.primaryText }}>4. Privacy</h2>
      <p style={{ color: colors.secondaryText }}>Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service.</p>
      
      <h2 style={{ color: colors.primaryText }}>5. Content</h2>
      <p style={{ color: colors.secondaryText }}>Users are responsible for the content they upload and must ensure they have the right to use and share such content.</p>
      
      <h2 style={{ color: colors.primaryText }}>6. Limitation of Liability</h2>
      <p style={{ color: colors.secondaryText }}>ResearchLocker shall not be liable for any indirect, incidental, special, consequential, or punitive damages.</p>
      
      <h2 style={{ color: colors.primaryText }}>7. Contact Information</h2>
      <p style={{ color: colors.secondaryText }}>If you have any questions about these Terms, please contact us at terms@researchlocker.com</p>
        </div>
      </div>
    </div>
  );
}