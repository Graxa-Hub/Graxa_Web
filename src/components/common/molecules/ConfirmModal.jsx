import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirmar', cancelText = 'Cancelar', type = 'warning', loading = false }) => {
    if (!isOpen) return null;
    const isDanger = type === 'error' || type === 'danger';
    const getIcon = () => {
        switch (type) {
            case 'error': case 'danger': return <XCircle style={{ width: 40, height: 40, color: 'var(--accent)' }} />;
            case 'success': return <CheckCircle style={{ width: 40, height: 40, color: 'var(--success)' }} />;
            case 'info': return <Info style={{ width: 40, height: 40, color: 'var(--info)' }} />;
            default: return <AlertTriangle style={{ width: 40, height: 40, color: 'var(--warning)' }} />;
        }
    };
    return (
        <div onClick={onClose} style={{ position:'fixed',inset:0,background:'var(--overlay)',backdropFilter:'blur(3px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,padding:16 }}>
            <style>{`@keyframes confirm-in{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}`}</style>
            <div onClick={e => e.stopPropagation()} style={{ background:'var(--surface-elevated)',border:'1px solid var(--border-hover)',borderRadius:'var(--radius-md)',padding:'28px 24px 22px',width:'100%',maxWidth:360,boxShadow:'var(--shadow-card)',textAlign:'center',animation:'confirm-in 0.18s ease' }}>
                <div style={{ display:'inline-flex',alignItems:'center',justifyContent:'center',width:52,height:52,borderRadius:'50%',marginBottom:14,background:isDanger?'rgba(200,80,60,0.12)':'var(--surface-hover)',color:isDanger?'var(--accent)':'var(--text-secondary)' }}>{getIcon()}</div>
                <h3 style={{ fontSize:15,fontWeight:600,color:'var(--text-primary)',marginBottom:8 }}>{title}</h3>
                <p style={{ fontSize:13,color:'var(--text-muted)',lineHeight:1.55,marginBottom:22 }}>{message}</p>
                <div style={{ display:'flex',gap:8 }}>
                    <button onClick={onClose} disabled={loading} className="modal-btn-secondary" style={{ flex:1,fontSize:13,fontWeight:500,padding:'8px 0',opacity:loading?0.6:1,cursor:loading?'not-allowed':'pointer' }}>{cancelText}</button>
                    <button onClick={onConfirm} disabled={loading} style={{ flex:1,fontSize:13,fontWeight:500,padding:'8px 0',borderRadius:'var(--radius-sm)',border:isDanger?'1px solid rgba(210,80,60,0.35)':'1px solid var(--border-hover)',background:isDanger?'rgba(210,80,60,0.18)':'var(--surface-hover)',color:isDanger?'#d45a42':'var(--text-primary)',cursor:loading?'not-allowed':'pointer',opacity:loading?0.6:1 }}>{loading?'Processando...':confirmText}</button>
                </div>
            </div>
        </div>
    );
};
