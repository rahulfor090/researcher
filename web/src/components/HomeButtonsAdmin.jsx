import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { syncHomePageButtons, manualSync } from '../utils/homeButtonsSync';
import { colors, shadows, cardStyle, primaryButtonStyle, secondaryButtonStyle } from '../theme';

const HomeButtonsAdmin = () => {
  const [buttons, setButtons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [newButton, setNewButton] = useState({ name: '', position: 'header' });
  const [editingButton, setEditingButton] = useState(null);

  // Load buttons from database
  const loadButtons = async () => {
    setLoading(true);
    try {
      const response = await api.get('/home-buttons');
      setButtons(response.data || []);
    } catch (error) {
      console.error('Failed to load buttons:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sync buttons from homepage
  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await syncHomePageButtons();
      if (result.success) {
        alert(`Sync completed!\nAdded: ${result.added} buttons\nRemoved: ${result.removed} buttons\nTotal: ${result.total} buttons`);
        await loadButtons(); // Reload the list
      } else {
        alert(`Sync failed: ${result.error}`);
      }
    } catch (error) {
      alert(`Sync failed: ${error.message}`);
    } finally {
      setSyncing(false);
    }
  };

  // Add new button
  const handleAddButton = async (e) => {
    e.preventDefault();
    if (!newButton.name.trim()) return;

    try {
      await api.post('/home-buttons', newButton);
      setNewButton({ name: '', position: 'header' });
      await loadButtons();
    } catch (error) {
      alert(`Failed to add button: ${error.response?.data?.message || error.message}`);
    }
  };

  // Update button
  const handleUpdateButton = async (e) => {
    e.preventDefault();
    if (!editingButton || !editingButton.name.trim()) return;

    try {
      await api.put(`/home-buttons/${editingButton.id}`, {
        name: editingButton.name,
        position: editingButton.position
      });
      setEditingButton(null);
      await loadButtons();
    } catch (error) {
      alert(`Failed to update button: ${error.response?.data?.message || error.message}`);
    }
  };

  // Delete button
  const handleDeleteButton = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await api.delete(`/home-buttons/${id}`);
      await loadButtons();
    } catch (error) {
      alert(`Failed to delete button: ${error.response?.data?.message || error.message}`);
    }
  };

  useEffect(() => {
    loadButtons();
  }, []);

  const headerButtons = buttons.filter(btn => btn.position === 'header');
  const footerButtons = buttons.filter(btn => btn.position === 'footer');

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.primaryText, marginBottom: '8px' }}>
          Home Buttons Management
        </h1>
        <p style={{ color: colors.secondaryText }}>
          Manage buttons that appear in the header and footer of the homepage
        </p>
      </div>

      {/* Sync Section */}
      <div style={{ ...cardStyle, marginBottom: '24px', padding: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: colors.primaryText, marginBottom: '12px' }}>
          Auto-Sync from Homepage
        </h2>
        <p style={{ color: colors.secondaryText, marginBottom: '16px' }}>
          Automatically extract and sync all buttons from the homepage header and footer sections.
        </p>
        <button
          onClick={handleSync}
          disabled={syncing}
          style={{
            ...primaryButtonStyle,
            opacity: syncing ? 0.6 : 1,
            cursor: syncing ? 'not-allowed' : 'pointer'
          }}
        >
          {syncing ? '🔄 Syncing...' : '🔄 Sync from Homepage'}
        </button>
      </div>

      {/* Add New Button */}
      <div style={{ ...cardStyle, marginBottom: '24px', padding: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: colors.primaryText, marginBottom: '12px' }}>
          Add New Button
        </h2>
        <form onSubmit={handleAddButton} style={{ display: 'flex', gap: '12px', alignItems: 'end', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', color: colors.primaryText, fontWeight: '500' }}>
              Button Name
            </label>
            <input
              type="text"
              value={newButton.name}
              onChange={(e) => setNewButton({ ...newButton, name: e.target.value })}
              placeholder="Enter button name"
              style={{
                padding: '8px 12px',
                border: `1px solid ${colors.border}`,
                borderRadius: '6px',
                fontSize: '14px',
                width: '200px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', color: colors.primaryText, fontWeight: '500' }}>
              Position
            </label>
            <select
              value={newButton.position}
              onChange={(e) => setNewButton({ ...newButton, position: e.target.value })}
              style={{
                padding: '8px 12px',
                border: `1px solid ${colors.border}`,
                borderRadius: '6px',
                fontSize: '14px',
                width: '120px'
              }}
            >
              <option value="header">Header</option>
              <option value="footer">Footer</option>
            </select>
          </div>
          <button type="submit" style={primaryButtonStyle}>
            ➕ Add Button
          </button>
        </form>
      </div>

      {/* Buttons List */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Header Buttons */}
        <div style={{ ...cardStyle, padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: colors.primaryText, marginBottom: '16px' }}>
            Header Buttons ({headerButtons.length})
          </h2>
          {loading ? (
            <p style={{ color: colors.secondaryText }}>Loading...</p>
          ) : headerButtons.length === 0 ? (
            <p style={{ color: colors.mutedText }}>No header buttons found</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {headerButtons.map((button) => (
                <div
                  key={button.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '6px',
                    background: colors.background
                  }}
                >
                  {editingButton?.id === button.id ? (
                    <form onSubmit={handleUpdateButton} style={{ display: 'flex', gap: '8px', flex: 1 }}>
                      <input
                        type="text"
                        value={editingButton.name}
                        onChange={(e) => setEditingButton({ ...editingButton, name: e.target.value })}
                        style={{
                          padding: '4px 8px',
                          border: `1px solid ${colors.border}`,
                          borderRadius: '4px',
                          fontSize: '14px',
                          flex: 1
                        }}
                      />
                      <button type="submit" style={{ ...secondaryButtonStyle, padding: '4px 8px', fontSize: '12px' }}>
                        ✅
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingButton(null)}
                        style={{ ...secondaryButtonStyle, padding: '4px 8px', fontSize: '12px' }}
                      >
                        ❌
                      </button>
                    </form>
                  ) : (
                    <>
                      <span style={{ color: colors.primaryText, fontWeight: '500' }}>{button.name}</span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => setEditingButton(button)}
                          style={{ ...secondaryButtonStyle, padding: '4px 8px', fontSize: '12px' }}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteButton(button.id, button.name)}
                          style={{ ...secondaryButtonStyle, padding: '4px 8px', fontSize: '12px', background: '#fee2e2', color: '#dc2626' }}
                        >
                          🗑️
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div style={{ ...cardStyle, padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: colors.primaryText, marginBottom: '16px' }}>
            Footer Buttons ({footerButtons.length})
          </h2>
          {loading ? (
            <p style={{ color: colors.secondaryText }}>Loading...</p>
          ) : footerButtons.length === 0 ? (
            <p style={{ color: colors.mutedText }}>No footer buttons found</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {footerButtons.map((button) => (
                <div
                  key={button.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '6px',
                    background: colors.background
                  }}
                >
                  {editingButton?.id === button.id ? (
                    <form onSubmit={handleUpdateButton} style={{ display: 'flex', gap: '8px', flex: 1 }}>
                      <input
                        type="text"
                        value={editingButton.name}
                        onChange={(e) => setEditingButton({ ...editingButton, name: e.target.value })}
                        style={{
                          padding: '4px 8px',
                          border: `1px solid ${colors.border}`,
                          borderRadius: '4px',
                          fontSize: '14px',
                          flex: 1
                        }}
                      />
                      <button type="submit" style={{ ...secondaryButtonStyle, padding: '4px 8px', fontSize: '12px' }}>
                        ✅
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingButton(null)}
                        style={{ ...secondaryButtonStyle, padding: '4px 8px', fontSize: '12px' }}
                      >
                        ❌
                      </button>
                    </form>
                  ) : (
                    <>
                      <span style={{ color: colors.primaryText, fontWeight: '500' }}>{button.name}</span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => setEditingButton(button)}
                          style={{ ...secondaryButtonStyle, padding: '4px 8px', fontSize: '12px' }}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteButton(button.id, button.name)}
                          style={{ ...secondaryButtonStyle, padding: '4px 8px', fontSize: '12px', background: '#fee2e2', color: '#dc2626' }}
                        >
                          🗑️
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeButtonsAdmin;
