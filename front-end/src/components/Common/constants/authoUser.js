export const authoUser = {
  "ROLE_DATAENTRY":
    [	{ path: "/VohReport/insert", name: "NHẬP LIỆU" }],
  "ROLE_MC":
    [	{ path: '/VohReport/records', name: "BẢNG TIN" }],
  "ROLE_EDITOR" :
    [ { path: '/VohReport/edit', name: 'BIÊN TẬP'},
      { path: '/VohReport/records', name: "BẢNG TIN"  },
      { path: '/VohReport/statistic', name: 'THỐNG KÊ' }],
  "ROLE_ADMIN":
    [	{ path: "/VohReport/insert", name: "NHẬP LIỆU" },
      { path: '/VohReport/edit', name: 'BIÊN TẬP'},
      { path: '/VohReport/records', name: "BẢNG TIN"  },
      { path: '/VohReport/statistic', name:'THỐNG KÊ' },
      { path: '/VohReport/admin', name: 'QUẢN TRỊ VIÊN' }],
  "ROLE_DATAENTRY_EDITOR":
    [
      { path: "/VohReport/insert", name: "NHẬP LIỆU" },
      { path: '/VohReport/records', name: "BẢNG TIN"  },
      { path: '/VohReport/statistic', name: 'THỐNG KÊ' }
    ]
};