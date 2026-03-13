import { addDoc, getCollection } from '../config/firebase.js';
import { getCurrentDate } from './utils.js';

export const createAuditLog = async (actionType, actor, target, details) => {
  try {
    await addDoc(getCollection('system_audit'), {
      action: actionType,
      actorId: actor?.id || 'SYSTEM',
      actorName: actor?.name || 'System',
      actorGroup: actor?.group || 'N/A',
      target: target || 'N/A',
      details: details || {},
      timestamp: Date.now(),
      date: getCurrentDate()
    });
    console.log(`[AUDIT] ${actionType} recorded for ${target}`);
  } catch (e) {
    console.error('Audit Log Error:', e);
  }
};
