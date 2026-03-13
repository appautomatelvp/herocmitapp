export const GROUP_ORDER = [
  'CMIT SM', 'CMIT TSV', 'CMIT Controller', 'CMIT YC', 'CMIT QC',
  'CMIT D&W', 'AH D&W', 'CMIT RTG', 'AH RTG',
  'CMIT RS', 'AH RS', 'CMIT TT', 'AH TT'
];

export const POSITION_GROUPS = {
  'SM': 'CMIT SM',
  'TSV': 'CMIT TSV',
  'CONTROLLER': 'CMIT Controller',
  'YC': 'CMIT YC',
  'QC': 'CMIT QC',
  'D&W': 'CMIT D&W',
  'RTG': 'CMIT RTG',
  'RS': 'CMIT RS',
  'TT': 'CMIT TT'
};

export const GROUP_COLORS = {
  'CMIT SM': 'bg-red-100 text-red-800 border-red-200',
  'CMIT TSV': 'bg-orange-100 text-orange-800 border-orange-200',
  'CMIT Controller': 'bg-blue-100 text-blue-800 border-blue-200',
  'CMIT YC': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'CMIT QC': 'bg-purple-100 text-purple-800 border-purple-200',
  'default': 'bg-gray-100 text-gray-600 border-gray-200'
};

export const OIL_EQUIPMENT_TYPES = ['RTG', 'Truck', 'RS', 'Pickup'];

export const EQUIPMENT_TYPES = [
  { id: 'RTG', label: 'Cẩu RTG (Bãi)', icon: '🏗️' },
  { id: 'QC', label: 'Cẩu QC (Bờ)', icon: '🚢' },
  { id: 'Truck', label: 'Xe đầu kéo (TT)', icon: '🚛' },
  { id: 'RS', label: 'Xe nâng (RS/EH/UN/FL)', icon: '🚜' },
  { id: 'Pickup', label: 'Pickup / BUS16', icon: '🚐' },
  { id: 'DWC', label: 'DWC / WCO (Checker + Điều phối)', icon: '🎧' }
];

export const VALID_EQUIPMENT_LIST = {
  'QC': ['QC01', 'QC02', 'QC03', 'QC04', 'QC05', 'QC06', 'QC07'],
  'RTG': Array.from({ length: 15 }, (_, i) => `RTG${String(i + 1).padStart(2, '0')}`),
  'Truck': [
    'TT01', 'TT02', 'TT03', 'TT04', 'TT06', 'TT07', 'TT08', 'TT09', 'TT10',
    'TT11', 'TT12', 'TT13', 'TT14', 'TT15', 'TT16', 'TT18', 'TT19', 'TT21',
    'TT22', 'TT23', 'TT24', 'TT27', 'TT28', 'TT29', 'TT30', 'TT31', 'TT32',
    'TT33', 'TT34', 'TT35', 'TT36', 'TT37', 'TT38', 'TT39', 'TT40', 'TT41',
    'TT42', 'TT43'
  ],
  'RS': ['UN02', 'UN03', 'EH01', 'EH02', 'LRS01', 'RS01', 'RS02', 'FL25T', 'FL3T NEW', 'FL3T 01', 'FL3T 02', 'FL6T'],
  'Pickup': ['PU34', 'PU064', 'BUS16', '__OTHER__'],
  'DWC': ['WCO01', 'WCO02', 'WCO03', '__OTHER__']
};

export const CHECKLIST_SCHEMA = {
  'Truck': [
    { group: '1. Động cơ & Truyền động', items: [
      { id: 'tr_engine_sound', label: 'Động cơ (Tiếng kêu bất thường)', critical: true },
      { id: 'tr_eng_oil', label: 'Nhớt động cơ (Thấm, rò rỉ, thiếu/đủ)', critical: true },
      { id: 'tr_trans_oil', label: 'Dầu hộp số (Thấm, rò rỉ, thiếu/đủ)', critical: true },
      { id: 'tr_coolant', label: 'Nước làm mát (Thấm, rò rỉ, thiếu/đủ)', critical: true }
    ]},
    { group: '2. Gầm & Vận hành an toàn', items: [
      { id: 'tr_hyd_oil', label: 'Dầu thủy lực tay lái (Thấm, rò rỉ, thiếu/đủ)', critical: true },
      { id: 'tr_brakes', label: 'Hệ thống thắng (Tiếng kêu, ăn nhẹ/không ăn)', critical: true },
      { id: 'tr_tires', label: 'Vỏ xe (Mòn nhẹ, mòn tới bố, nứt/rách)', critical: true },
      { id: 'tr_fifth_wheel', label: 'Con cu moóc (Độ rơ đầu kéo-moóc, nứt)', critical: true },
      { id: 'tr_trailer_cond', label: 'Tình trạng moóc (Xéo nhẹ, xéo nặng, lỗi khác)', critical: true }
    ]},
    { group: '3. Cabin & An toàn', items: [
      { id: 'tr_fire_ext', label: 'Bình chữa cháy (Đầy/niêm phong nguyên)', critical: true },
      { id: 'tr_accessories', label: 'Đèn, còi, nút bấm, radio, VMT và tình trạng khác', critical: false }
    ]}
  ],
  'QC': [
    { group: '1. Cơ cấu di chuyển (Tiếng kêu)', items: [
      { id: 'qc_trolley_sound', label: 'Trolley - Xe con (Tiếng kêu bất thường)', critical: true },
      { id: 'qc_hoist_sound', label: 'Hoist - Cơ cấu nâng (Tiếng kêu bất thường)', critical: true },
      { id: 'qc_gantry_sound', label: 'Gantry - Di chuyển chân đế (Tiếng kêu bất thường)', critical: true }
    ]},
    { group: '2. Thiết bị nâng (Spreader)', items: [
      { id: 'qc_spr_id', label: 'Ngáng số mấy (1-10)', critical: false, inputType: 'number', inputMin: 1, inputMax: 10 },
      { id: 'qc_spr_cond', label: 'Tình trạng Spreader (Trim/List/Skew, cáp, đèn ngáng, chân vịt)', critical: true }
    ]},
    { group: '3. Điều khiển & Hệ thống điện', items: [
      { id: 'qc_joystick', label: 'Tay trang điều khiển (Joystick)', critical: true },
      { id: 'qc_plc', label: 'Bảng điều khiển PLC', critical: false },
      { id: 'qc_emerg_stop', label: 'Nút nhấn khẩn cấp (Nguyên vẹn, bất thường)', critical: true }
    ]},
    { group: '4. An toàn & Tiện nghi', items: [
      { id: 'qc_fire_ext', label: 'Bình chữa cháy (Đầy/niêm phong nguyên)', critical: true },
      { id: 'qc_lights', label: 'Đèn chiếu sáng (Toàn bộ cẩu)', critical: false },
      { id: 'qc_misc', label: 'Tình trạng khác (Thang máy, nút bấm, máy lạnh, radio)', critical: false }
    ]}
  ],
  'RTG': [
    { group: '1. Động lực & Nhiên liệu', items: [
      { id: 'rtg_engine_sound', label: 'Động cơ (Tiếng kêu bất thường)', critical: true },
      { id: 'rtg_oil_level', label: 'Nhớt động cơ (Rò rỉ, thiếu/dư)', critical: true },
      { id: 'rtg_coolant', label: 'Nước làm mát (Rò rỉ, thiếu/dư)', critical: true }
    ]},
    { group: '2. Cơ cấu nâng & Di chuyển (Tiếng kêu)', items: [
      { id: 'rtg_hoist_sound', label: 'Hoist (Tiếng kêu bất thường)', critical: true },
      { id: 'rtg_trolley_sound', label: 'Trolley (Tiếng kêu bất thường)', critical: true },
      { id: 'rtg_gantry_sound', label: 'Gantry (Tiếng kêu bất thường, đèn cảnh báo)', critical: true },
      { id: 'rtg_spreader', label: 'Ngáng (Hệ thống Trim/List/Skew, đèn ngáng)', critical: true }
    ]},
    { group: '3. Gầm & Bánh xe', items: [
      { id: 'rtg_axle_leak', label: 'Cầu bánh xe (Rò rỉ dầu cầu)', critical: true },
      { id: 'rtg_tires', label: 'Vỏ xe (Mòn, nứt, rách, bulon)', critical: true }
    ]},
    { group: '4. An toàn & Cabin', items: [
      { id: 'rtg_fire_ext', label: 'Bình chữa cháy (Đầy/niêm phong nguyên)', critical: true },
      { id: 'rtg_lights', label: 'Đèn chiếu sáng (Sáng yếu, cháy bóng, thiếu bóng)', critical: false },
      { id: 'rtg_horn', label: 'Còi (Còi tay, còi chân)', critical: true },
      { id: 'rtg_misc', label: 'Tình trạng khác (Máy lạnh, radio, VMT, nút bấm, ghế)', critical: false }
    ]}
  ],
  'RS': [
    { group: '1. Động lực & Thủy lực', items: [
      { id: 'rs_engine_sound', label: 'Động cơ (Tiếng kêu bất thường)', critical: true },
      { id: 'rs_eng_oil', label: 'Nhớt động cơ (Rò rỉ, thiếu/dư)', critical: true },
      { id: 'rs_trans_oil', label: 'Dầu hộp số (Rò rỉ, thiếu/dư)', critical: true },
      { id: 'rs_coolant', label: 'Nước làm mát (Rò rỉ, thiếu/dư)', critical: true },
      { id: 'rs_hyd_oil', label: 'Dầu thủy lực (Rò rỉ, mức dầu — quan trọng)', critical: true }
    ]},
    { group: '2. Vận hành trực tiếp', items: [
      { id: 'rs_spreader', label: 'Ngáng (Xéo, đèn tín hiệu, không rò rỉ)', critical: true },
      { id: 'rs_brakes', label: 'Hệ thống thắng (Ăn nhẹ, không ăn)', critical: true },
      { id: 'rs_tires', label: 'Vỏ xe (Mòn nhẹ, mòn lòi bố, nứt/rách)', critical: true }
    ]},
    { group: '3. An toàn & Cabin', items: [
      { id: 'rs_fire_ext', label: 'Bình chữa cháy (Đầy/niêm phong nguyên)', critical: true },
      { id: 'rs_misc', label: 'Tình trạng khác (Đèn, còi, máy lạnh, nút bấm, radio, VMT)', critical: false }
    ]}
  ],
  'Pickup': [
    { group: '1. Kiểm tra kỹ thuật', items: [
      { id: 'pu_engine_sound', label: 'Động cơ (Tiếng kêu bất thường)', critical: true },
      { id: 'pu_engine_oil', label: 'Nhớt động cơ (Thấm, rò rỉ, thiếu/đủ)', critical: true },
      { id: 'pu_trans_oil', label: 'Dầu hộp số (Thấm, rò rỉ, thiếu/đủ)', critical: true },
      { id: 'pu_hyd_steering', label: 'Dầu thủy lực tay lái (Thấm, rò rỉ, thiếu/đủ)', critical: true },
      { id: 'pu_coolant', label: 'Nước làm mát (Thấm, rò rỉ, thiếu/đủ)', critical: true },
      { id: 'pu_brakes', label: 'Hệ thống thắng & Vỏ xe (Tiếng kêu, ăn nhẹ/không ăn, mòn/nứt)', critical: true }
    ]},
    { group: '2. An toàn & Tiện nghi', items: [
      { id: 'pu_fire_ext', label: 'Bình chữa cháy (Đầy/niêm phong nguyên)', critical: true },
      { id: 'pu_misc', label: 'Đèn, còi, nút bấm nội thất và tình trạng khác', critical: false }
    ]}
  ],
  'DWC': [
    { group: '1. PPE & An toàn cá nhân', items: [
      { id: 'dwc_life_jacket', label: 'Áo phao (Life Jacket)', critical: true },
      { id: 'dwc_wheel_chock', label: 'Cây căn xe (Wheel Chock)', critical: true },
      { id: 'dwc_fire_ext', label: 'Bình chữa cháy (Đầy/niêm phong nguyên)', critical: true }
    ]},
    { group: '2. Công cụ liên lạc & WCO', items: [
      { id: 'dwc_radio_recv', label: 'Bộ đàm (Nhận ca)', critical: true },
      { id: 'dwc_spare_battery', label: 'Pin dự phòng (Đầy pin, sẵn sàng)', critical: true },
      { id: 'dwc_radio_stick', label: 'Cây đưa đàm (Tiếp cận cabin xe)', critical: true },
      { id: 'dwc_cone', label: 'Cone cảnh báo (Đủ số lượng)', critical: true }
    ]},
    { group: '3. Thiết bị quản lý', items: [
      { id: 'dwc_pc', label: 'Máy tính PC làm việc (Hoạt động bình thường)', critical: true },
      { id: 'dwc_camera', label: 'Camera', critical: true },
      { id: 'dwc_handheld', label: 'Máy Handheld (HHT)', critical: true },
      { id: 'dwc_charger', label: 'Sạc máy tính / Sạc bộ đàm (Đủ)', critical: false }
    ]},
    { group: '4. Bàn giao ca', items: [
      { id: 'dwc_radio_hand', label: 'Bộ đàm (Bàn giao ca)', critical: true },
      { id: 'dwc_pc_hand', label: 'Máy tính PC (Bàn giao ca)', critical: true },
      { id: 'dwc_camera_hand', label: 'Camera (Bàn giao ca)', critical: true },
      { id: 'dwc_misc', label: 'Tiện nghi khu vực (Máy lạnh, túi đồ, môi trường làm việc)', critical: false }
    ]}
  ]
};

export const MOCK_HISTORY = {
  'RTG-01': { date: 'Hôm qua, Ca 3', status: 'Cảnh báo', note: 'Mờ đèn pha bên trái', reporter: 'Nguyen Van A' },
  'RTG-05': { date: 'Hôm qua, Ca 3', status: 'Tốt', note: 'Hoạt động bình thường', reporter: 'Le Van B' },
  'TRUCK-12': { date: 'Hôm nay, Ca 1', status: 'Nghiêm trọng', note: 'Gãy chốt gù số 2', reporter: 'Tran Van C' },
  'QC-10': { date: 'Hôm qua, Ca 2', status: 'Tốt', note: null, reporter: 'Pham Van D' }
};

export const MOCK_METERS = {
  'RTG-01': 12500,
  'RTG-05': 4500,
  'TRUCK-12': 89000,
  'QC-10': 3200
};
