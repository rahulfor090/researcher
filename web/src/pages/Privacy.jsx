export default function Privacy() {
  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '40px auto', 
      padding: '20px',
      fontFamily: 'Inter, sans-serif',
      lineHeight: '1.6'
    }}>
      <h1>Privacy Policy</h1>
      <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
      
      <h2>1. Information We Collect</h2>
      <p>We collect information you provide directly to us, such as when you create an account, upload research papers, or contact us for support.</p>
      
      <h2>2. How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide, maintain, and improve our services</li>
        <li>Process transactions and send related information</li>
        <li>Send technical notices and support messages</li>
        <li>Respond to your comments and questions</li>
      </ul>
      
      <h2>3. Information Sharing</h2>
      <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
      
      <h2>4. Data Security</h2>
      <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
      
      <h2>5. Third-Party Services</h2>
      <p>We may use third-party services (like Twitter for authentication) that have their own privacy policies. We encourage you to review their privacy policies.</p>
      
      <h2>6. Data Retention</h2>
      <p>We retain your information for as long as your account is active or as needed to provide you services.</p>
      
      <h2>7. Your Rights</h2>
      <p>You have the right to access, update, or delete your personal information. You can do this through your account settings or by contacting us.</p>
      
      <h2>8. Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, please contact us at privacy@researchlocker.com</p>
    </div>
  );
}