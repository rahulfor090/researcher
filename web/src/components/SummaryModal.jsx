export default function SummaryModal({ summary, onClose }) {
  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Article Summary</h3>
        <div style={summaryContentStyle}>
          <p>{summary || 'No summary available.'}</p>
        </div>
        <div style={buttonContainerStyle}>
          <button onClick={onClose} style={closeButtonStyle}>Close</button>
        </div>
      </div>
    </div>
  );
}

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '12px',
  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  width: '600px',
  maxWidth: '90%',
  textAlign: 'left',
};

const summaryContentStyle = {
  maxHeight: '400px',
  overflowY: 'auto',
  lineHeight: '1.7',
  color: '#374151',
  fontSize: '1.05rem',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '25px',
};

const closeButtonStyle = {
  padding: '10px 20px',
  borderRadius: '8px',
  cursor: 'pointer',
  border: 'none',
  fontSize: '1rem',
  backgroundColor: '#f3f4f6',
  color: '#4b5563',
  transition: 'background-color 0.2s',
  fontWeight: '500',
};
