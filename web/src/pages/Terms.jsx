export default function Terms() {
  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '40px auto', 
      padding: '20px',
      fontFamily: 'Inter, sans-serif',
      lineHeight: '1.6'
    }}>
      <h1>Terms of Service</h1>
      <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
      
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing and using ResearchLocker, you accept and agree to be bound by the terms and provision of this agreement.</p>
      
      <h2>2. Description of Service</h2>
      <p>ResearchLocker is a research paper management application that helps users organize, store, and manage their academic papers and research materials.</p>
      
      <h2>3. User Accounts</h2>
      <p>You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer.</p>
      
      <h2>4. Privacy</h2>
      <p>Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service.</p>
      
      <h2>5. Content</h2>
      <p>Users are responsible for the content they upload and must ensure they have the right to use and share such content.</p>
      
      <h2>6. Limitation of Liability</h2>
      <p>ResearchLocker shall not be liable for any indirect, incidental, special, consequential, or punitive damages.</p>
      
      <h2>7. Contact Information</h2>
      <p>If you have any questions about these Terms, please contact us at terms@researchlocker.com</p>
    </div>
  );
}