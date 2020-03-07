export const districtList = [
  { name: "Q.Khác", 			key: "quan_khac" },
  { name: "Q.1", 					key: "quan_1" },
  { name: "Q.2", 					key: "quan_2" },
  { name: "Q.3", 					key: "quan_3" },
  { name: "Q.4", 					key: "quan_4" },
  { name: "Q.5", 					key: "quan_5" },
  { name: "Q.6", 					key: "quan_6" },
  { name: "Q.7", 					key: "quan_7" },
  { name: "Q.8", 					key: "quan_8" },
  { name: "Q.9", 					key: "quan_9" },
  { name: "Q.10", 				key: "quan_10" },
  { name: "Q.11", 				key: "quan_11" },
  { name: "Q.12", 				key: "quan_12" },
  { name: "Q.Thủ Đức", 		key: "quan_thu_duc" },
  { name: "Q.Gò Vấp", 		key: "quan_go_vap" },
  { name: "Q.Bình Thạnh", key: "quan_binh_thanh" },
  { name: "Q.Tân Bình", 	key: "quan_tan_binh" },
  { name: "Q.Tân Phú", 		key: "quan_tan_phu" },
  { name: "Q.Phú Nhuận", 	key: "quan_phu_nhuan" },
  { name: "Q.Bình Tân", 	key: "quan_binh_tan" },
  { name: "H.Củ Chi", 		key: "huyen_cu_chi" },
  { name: "H.Nhà Bè", 		key: "huyen_nha_be" },
  { name: "H.Bình Chánh", key: "huyen_binh_chanh" },
  { name: "H.Cần Giờ", 		key: "huyen_can_gio" },
  { name: "H.Hóc Môn", 		key: "huyen_hoc_mon" },
  { name: "Bình Dương", 	key: "binh_duong" },
  { name: "Đồng Nai", 	  key: "dong_nai" },
  { name: "Long An",      key:"long_an"}
];

export const keyToDistrictObject = (keyList) => {
  let outputList =  [];
  if (keyList !== null && keyList !== []) {
    for (let index in keyList) {
      let result = districtList.find(x => x['key'] === keyList[index]);
      if (result) {
        outputList.push(result);
      }
    }
  }
  return outputList ;
};

