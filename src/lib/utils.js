import { POSITION_GROUPS, CHECKLIST_SCHEMA } from '../config/constants.js';

export const removeAccents = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
};

export const getLastNameUsername = (fullName) => {
  if (!fullName) return '';
  const parts = fullName.trim().split(/\s+/);
  const lastName = parts[parts.length - 1];
  return removeAccents(lastName).toLowerCase();
};

export const normalizePhone = (phone) => {
  if (!phone) return '';
  let clean = phone.replace(/\D/g, '');
  if (clean.startsWith('84')) clean = '0' + clean.slice(2);
  return clean;
};

export const determineGroup = (position) => {
  if (!position) return 'Khác';
  const upperPos = position.toUpperCase();
  if (upperPos.includes('AH')) {
    if (upperPos.includes('RTG')) return 'AH RTG';
    if (upperPos.includes('D&W')) return 'AH D&W';
    if (upperPos.includes('TT')) return 'AH TT';
    if (upperPos.includes('RS')) return 'AH RS';
    return 'AH Khác';
  }
  for (const [key, group] of Object.entries(POSITION_GROUPS)) {
    if (upperPos.includes(key)) return group;
  }
  return 'Khác';
};

export const getBlockPriority = (code, group) => {
  const uCode = (code || '').toUpperCase();
  const uGroup = (group || '').toUpperCase();
  if (uCode.includes('EXT')) return 2;
  if (uCode.includes('CMP')) return 1;
  if (uGroup.includes('AH')) return 2;
  if (uGroup.includes('CMIT')) return 1;
  return 3;
};

export const getThemeColors = (group = '', code = '') => {
  const priority = getBlockPriority(code, group);
  const uGroup = (group || '').toUpperCase();
  const isManager = uGroup.includes('SM') || uGroup.includes('TSV') || uGroup.includes('CONTROLLER') || code === 'ADMIN_KEY';
  if (isManager) {
    return {
      type: 'MANAGER',
      bg: 'bg-yellow-400',
      text: 'text-blue-900',
      border: 'border-yellow-400',
      gradient: 'from-yellow-400 to-yellow-500',
      badge: 'bg-yellow-400 text-blue-900 border-blue-900 shadow-sm',
      iconBg: 'bg-yellow-100 text-blue-900',
      primaryBg: 'bg-yellow-400',
      primaryHover: 'hover:bg-yellow-500',
      primaryText: 'text-blue-900',
      primaryTextDark: 'text-blue-950',
      primaryLightBg: 'bg-yellow-50',
      primaryRing: 'focus:ring-yellow-500',
      primaryBorder: 'border-yellow-400'
    };
  }
  if (priority === 2) {
    return {
      type: 'ADHOC',
      bg: 'bg-orange-700',
      text: 'text-orange-700',
      border: 'border-orange-700',
      gradient: 'from-orange-700 to-orange-500',
      badge: 'bg-orange-50 text-orange-800 border-orange-300',
      iconBg: 'bg-orange-100 text-orange-700',
      primaryBg: 'bg-orange-600',
      primaryHover: 'hover:bg-orange-700',
      primaryText: 'text-orange-600',
      primaryTextDark: 'text-orange-800',
      primaryLightBg: 'bg-orange-50',
      primaryRing: 'focus:ring-orange-500',
      primaryBorder: 'border-orange-200'
    };
  }
  if (priority === 1) {
    return {
      type: 'CMIT',
      bg: 'bg-blue-950',
      text: 'text-blue-950',
      border: 'border-blue-950',
      gradient: 'from-blue-900 to-blue-800',
      badge: 'bg-blue-50 text-blue-950 border-blue-300',
      iconBg: 'bg-blue-100 text-blue-950',
      primaryBg: 'bg-blue-900',
      primaryHover: 'hover:bg-blue-950',
      primaryText: 'text-blue-900',
      primaryTextDark: 'text-blue-950',
      primaryLightBg: 'bg-blue-50',
      primaryRing: 'focus:ring-blue-500',
      primaryBorder: 'border-blue-200'
    };
  }
  return {
    type: 'OTHER',
    bg: 'bg-slate-600',
    text: 'text-slate-600',
    border: 'border-slate-600',
    gradient: 'from-slate-600 to-slate-500',
    badge: 'bg-slate-100 text-slate-800 border-slate-200',
    iconBg: 'bg-slate-200 text-slate-600',
    primaryBg: 'bg-[#1e3a8a]',
    primaryHover: 'hover:bg-[#172554]',
    primaryText: 'text-[#1e3a8a]',
    primaryTextDark: 'text-[#172554]',
    primaryLightBg: 'bg-blue-50',
    primaryRing: 'focus:ring-[#1e3a8a]',
    primaryBorder: 'border-blue-200'
  };
};

export const getAccessLevel = (group) => {
  if (group === 'CMIT SM') return 3;
  if (group === 'CMIT TSV') return 2;
  if (group === 'CMIT Controller') return 1;
  return 0;
};

export const canRecord = (recorderGroup, targetGroup) => {
  const rLevel = getAccessLevel(recorderGroup);
  const tLevel = getAccessLevel(targetGroup);
  return rLevel > tLevel;
};

export const getCoreRoleIndex = (group) => {
  const uGroup = (group || '').toUpperCase();
  if (uGroup.includes('SM')) return 1;
  if (uGroup.includes('TSV')) return 2;
  if (uGroup.includes('CONTROLLER')) return 3;
  if (uGroup.includes('YC')) return 4;
  if (uGroup.includes('QC')) return 5;
  if (uGroup.includes('D&W')) return 6;
  if (uGroup.includes('RTG')) return 7;
  if (uGroup.includes('RS')) return 8;
  if (uGroup.includes('TT')) return 9;
  return 99;
};

export const sortEmployees = (empList) => {
  return [...empList].sort((a, b) => {
    const blockA = getBlockPriority(a.code, a.group);
    const blockB = getBlockPriority(b.code, b.group);
    if (blockA !== blockB) return blockA - blockB;
    const roleA = getCoreRoleIndex(a.group);
    const roleB = getCoreRoleIndex(b.group);
    if (roleA !== roleB) return roleA - roleB;
    return a.name.localeCompare(b.name);
  });
};

export const getInitials = (name) => {
  if (!name) return '??';
  return name.split(' ').map((n) => n[0]).join('').slice(-2).toUpperCase();
};

export const getCurrentDate = () => {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export const getCurrentTime = () =>
  new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

export const getLocalYYYYMM = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};
export const getLocalYear = () => new Date().getFullYear().toString();
export const getLocalQuarter = () => `Q${Math.floor(new Date().getMonth() / 3) + 1}`;

export const resizeImage = (file, maxWidth = 800, maxHeight = 800) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
};

export const checkDateMatch = (recordDateStr, mode, selectedDateStr) => {
  if (!recordDateStr) return false;
  const separator = recordDateStr.includes('/') ? '/' : '-';
  const parts = recordDateStr.split(separator);
  if (parts.length !== 3) return false;
  let day, month, year;
  if (parts[0].trim().length === 4) {
    year = parts[0].trim();
    month = parts[1].trim();
    day = parts[2].trim();
  } else {
    day = parts[0].trim();
    month = parts[1].trim();
    year = parts[parts.length - 1].trim();
  }
  day = day.padStart(2, '0');
  month = month.padStart(2, '0');
  if (year.length === 2) year = '20' + year;
  if (mode === 'YEAR') return year === selectedDateStr;
  if (mode === 'QUARTER') {
    const selectedParts = selectedDateStr.split('-');
    if (selectedParts.length !== 2) return false;
    const selectedYear = selectedParts[0];
    const selectedQuarter = selectedParts[1];
    if (year !== selectedYear) return false;
    if (selectedQuarter === 'Q1') return ['01', '02', '03'].includes(month);
    if (selectedQuarter === 'Q2') return ['04', '05', '06'].includes(month);
    if (selectedQuarter === 'Q3') return ['07', '08', '09'].includes(month);
    if (selectedQuarter === 'Q4') return ['10', '11', '12'].includes(month);
    return false;
  }
  const selectedParts = selectedDateStr.split('-');
  if (selectedParts.length !== 2) return false;
  return year === selectedParts[0] && month === selectedParts[1];
};

export const normalizeStringForMatch = (str) => {
  if (!str) return '';
  return removeAccents(String(str)).toLowerCase().replace(/\s+/g, '');
};

export const checkFuzzyMatch = (excelVal, dbVal, type) => {
  if (!excelVal || !dbVal) return false;
  if (type === 'NAME') {
    const normExcel = normalizeStringForMatch(excelVal);
    const normDb = normalizeStringForMatch(dbVal);
    return normDb.includes(normExcel) || normExcel.includes(normDb);
  }
  if (type === 'ID') {
    const cleanStr = (s) => String(s).toUpperCase().replace(/[^A-Z0-9]/g, '');
    const excelClean = cleanStr(excelVal);
    const dbClean = cleanStr(dbVal);
    if (excelClean === dbClean) return true;
    const getNum = (s) => parseInt(s.replace(/\D/g, '') || '0', 10);
    const excelNum = getNum(excelClean);
    const dbNum = getNum(dbClean);
    if (excelNum > 0 && dbNum > 0) return excelNum === dbNum;
    return false;
  }
  return false;
};

export const excelDateToJSDate = (serial) => {
  if (!serial) return '';
  if (typeof serial === 'string') return serial;
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  const day = ('0' + date_info.getDate()).slice(-2);
  const month = ('0' + (date_info.getMonth() + 1)).slice(-2);
  const year = date_info.getFullYear();
  return `${day}/${month}/${year}`;
};

export const getChecklistItemLabel = (type, itemId) => {
  let label = itemId;
  const schema = CHECKLIST_SCHEMA[type];
  if (schema) {
    schema.forEach((group) => {
      const found = group.items.find((i) => i.id === itemId);
      if (found) label = found.label;
    });
  }
  return label;
};

export const getDisplayGroup = (group, code) => {
  const priority = getBlockPriority(code, group);
  let g = group || 'Khác';
  if (priority === 2 && g.toUpperCase().includes('CMIT')) {
    g = g.replace(/CMIT/i, 'AH');
  } else if (priority === 1 && g.toUpperCase().includes('AH')) {
    g = g.replace(/AH/i, 'CMIT');
  }
  return g;
};
